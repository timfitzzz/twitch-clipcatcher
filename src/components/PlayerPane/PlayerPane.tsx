import React, { ReactChild, useEffect, useMemo, useRef, useState } from 'react'
import { useContextSelector } from 'use-context-selector'
import { Box } from 'rendition'
import styled from 'styled-components'
import { PlayerContext } from '../../contexts/PlayerContext/playerCtx'
import { useAppSelector } from '../../hooks/reduxHooks'
import { AuthContext } from '../../contexts/AuthContext'
import IntroPanel from '../infopanels/IntroPanel'
import PlayerPaneOverlay from './PlayerPaneOverlay'
import PlayerBackground from './PlayerBackground'
import { selectPlayerPoppedout } from '../../redux/selectors'

interface ClipEmbedOptions {
  src: string
  height: string | number
  width: string | number
  // allowFullScreen: boolean
  // parent: string
  preload: string
  autoplay: boolean
  muted: boolean
  title: string
}

const PlayerContainer = styled(Box)<{inUse: boolean}>`

  background-image: linear-gradient(black, 90%, ${p => p.theme.colors.primary.semilight});
  background-color: black;
  z-index: 0;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`

const PlayerIFrame = styled.iframe`
  z-index: 10;
  border-width: 0px;
`

const parentString = process.env.REACT_APP_VERCEL_ENV === 'production' 
                      ? "clipstime.manapool.nyc" 
                      : process.env.REACT_APP_VERCEL_ENV === 'preview'
                        ? process.env.REACT_APP_VERCEL_URL
                        : "localhost"

const PlayerPane = ({className, draggingDivider}: { draggingDivider: boolean, className?: string }) => {
  let isAuthenticated = useContextSelector(AuthContext, (c) => c.isAuthenticated ? c.isAuthenticated() : false)
  let currentClipObject = useContextSelector(PlayerContext, (c) => c.currentClip)
  let currentClipId = useMemo(() => currentClipObject?.currentClipId, [currentClipObject])
  let currentClip = useAppSelector(s => currentClipId && s.clips.clips[currentClipId] ? s.clips.clips[currentClipId] : null)
  let poppedOut = useAppSelector(state => selectPlayerPoppedout(state.settings))
  let embed_url = useMemo(() => currentClip ? currentClip.embed_url : null, [currentClip])
  let tracking_id = useMemo(() => currentClip ? currentClip.tracking_id : null, [currentClip])
  let playing = useContextSelector(PlayerContext, (c) => c.playing)
  let [playerFrame, setPlayerFrame] = useState<ReactChild | null>(null)
  let iframeRef = useRef<HTMLIFrameElement>(null)
  let [mouseIsOver, setMouseIsOver] = useState<boolean>(false)
  let handleMouseOver = (e: React.MouseEvent) => setMouseIsOver(true)
  let handleMouseExit = (e: React.MouseEvent) => setMouseIsOver(false)

  let makeIFrameVisible = () => {
    if (iframeRef && iframeRef.current) {
      iframeRef.current!.style.visibility = 'visible'
    }
  }

  const renderPlayer = useMemo(() => (props: ClipEmbedOptions) => {
    let { autoplay, muted, title, ...rest } = props;
    // console.log(rest)
    return <PlayerIFrame ref={iframeRef} style={{visibility: 'hidden'}} onLoad={makeIFrameVisible} key={Math.random()} allowFullScreen title={title} {...rest}/>
  }, [])

  useEffect(() => {
    if (embed_url && tracking_id) {
      let player = renderPlayer({
        src: embed_url + `&autoplay=true&muted=false&parent=${parentString}&allowfullscreen=${!poppedOut}`,
        height: '100%',
        width: '100%',
        preload: 'auto',
        autoplay: true,
        muted: false,
        title: tracking_id
      })
      playing && setPlayerFrame(player)
    }
  }, [currentClipObject, embed_url, tracking_id, playing, renderPlayer, poppedOut])

  return (
    <PlayerContainer onMouseEnter={handleMouseOver} onMouseLeave={handleMouseExit} className={className} inUse={embed_url ? true : false}>
      { !isAuthenticated && <IntroPanel /> }
      <PlayerBackground currentClip={currentClip}/>
      { isAuthenticated && playerFrame }
      <PlayerPaneOverlay mouseIsOver={mouseIsOver} draggingDivider={draggingDivider}/>
    </PlayerContainer>
  )

}

export default styled(PlayerPane)`
  height: 100%;
  flex-grow: 1;

`