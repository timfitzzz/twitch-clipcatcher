import React, { ReactChild, useEffect, useMemo, useState } from 'react'
import { useContextSelector } from 'use-context-selector'
import { Box } from 'rendition'
import styled from 'styled-components'
import { PlayerContext } from '../../contexts/PlayerContext/playerCtx'

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

  background-image: linear-gradient(black, ${p => p.theme.colors.gray.dark});

`

const parentString = process.env.REACT_APP_VERCEL_ENV === 'production' 
                      ? "clipstime.manapool.nyc" 
                      : process.env.REACT_APP_VERCEL_ENV === 'preview'
                        ? process.env.REACT_APP_VERCEL_URL
                        : "localhost"

const PlayerPane = ({className}: { className?: string }) => {

  let currentClip = useContextSelector(PlayerContext, (c) => c.currentClip)
  let playing = useContextSelector(PlayerContext, (c) => c.playing)
  let [playerFrame, setPlayerFrame] = useState<ReactChild | null>(null)

  const renderPlayer = useMemo(() => (props: ClipEmbedOptions) => {

    let { autoplay, muted, title, ...rest } = props;
    // console.log(rest)
    return (
      <iframe title={title} {...rest}/>
    )

  }, [])

  useEffect(() => {
    if (currentClip) {
      let player = renderPlayer({
        src: currentClip.embed_url + `&autoplay=true&muted=false&parent=${parentString}&allowfullscreen=true`,
        height: '100%',
        width: '100%',
        preload: 'auto',
        autoplay: true,
        muted: false,
        title: currentClip.tracking_id
      })
      playing && setPlayerFrame(player)
    }
  }, [currentClip, playing, renderPlayer])

  return (
    <PlayerContainer className={className} inUse={currentClip ? true : false}>
      {playerFrame}
    </PlayerContainer>
  )

}

export default styled(PlayerPane)`
  height: 100%;
  width: 100%;


`