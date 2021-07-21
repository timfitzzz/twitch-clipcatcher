import React, { ReactChild, useEffect, useMemo, useRef, useState } from 'react'
import { useContextSelector } from 'use-context-selector'
import { Box } from 'rendition'
import styled from 'styled-components'
import { PlayerContext } from '../../contexts/PlayerContext/playerCtx'
import { useAppSelector } from '../../hooks/reduxHooks'
import { AuthContext } from '../../contexts/AuthContext'
import IntroPanel from '../infopanels/IntroPanel'

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
`

const PlayerBackground = styled.div`
  position: absolute;
  display: flex;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: -50;
  font-size: 24px;
  color: white;

  span {
    margin: auto;
  }

`

const PlayerIFrame = styled.iframe`
  z-index: 10;
`

const parentString = process.env.REACT_APP_VERCEL_ENV === 'production' 
                      ? "clipstime.manapool.nyc" 
                      : process.env.REACT_APP_VERCEL_ENV === 'preview'
                        ? process.env.REACT_APP_VERCEL_URL
                        : "localhost"

const PlayerPane = ({className}: { className?: string }) => {
  let isAuthenticated = useContextSelector(AuthContext, (c) => c.isAuthenticated ? c.isAuthenticated() : false)
  let currentClipObject = useContextSelector(PlayerContext, (c) => c.currentClip)
  let currentClipId = useMemo(() => currentClipObject?.currentClipId, [currentClipObject])
  let currentClip = useAppSelector(s => currentClipId && s.clips.clips[currentClipId] ? s.clips.clips[currentClipId] : null)
  let embed_url = useMemo(() => currentClip ? currentClip.embed_url : null, [currentClip])
  let tracking_id = useMemo(() => currentClip ? currentClip.tracking_id : null, [currentClip])
  let playing = useContextSelector(PlayerContext, (c) => c.playing)
  let [playerFrame, setPlayerFrame] = useState<ReactChild | null>(null)
  let iframeRef = useRef<HTMLIFrameElement>(null)

  let makeIFrameVisible = () => {
    if (iframeRef && iframeRef.current) {
      iframeRef.current!.style.visibility = 'visible'
    }
  }

  const renderPlayer = useMemo(() => (props: ClipEmbedOptions) => {
    let { autoplay, muted, title, ...rest } = props;
    // console.log(rest)
    return (
      <>
        <PlayerBackground><span>{currentClip ? currentClip!.title! : title}</span></PlayerBackground>
        <PlayerIFrame ref={iframeRef} style={{visibility: 'hidden'}} onLoad={makeIFrameVisible} key={Math.random()} allowFullScreen title={title} {...rest}/>
      </>
    )
  }, [currentClip])

  useEffect(() => {
    if (embed_url && tracking_id) {
      let player = renderPlayer({
        src: embed_url + `&autoplay=true&muted=false&parent=${parentString}&allowfullscreen=true`,
        height: '100%',
        width: '100%',
        preload: 'auto',
        autoplay: true,
        muted: false,
        title: tracking_id
      })
      playing && setPlayerFrame(player)
    }
  }, [currentClipObject, embed_url, tracking_id, playing, renderPlayer])

  return (
    <PlayerContainer className={className} inUse={embed_url ? true : false}>
      { !isAuthenticated ? <IntroPanel/> : playerFrame }
    </PlayerContainer>
  )

}

export default styled(PlayerPane)`
  height: 100%;
  flex-grow: 1;


`