import React, { ClipProps, ReactChild, useEffect, useMemo, useRef, useState } from 'react'
import { useContextSelector } from 'use-context-selector'
import { Box } from 'rendition'
import styled from 'styled-components'
import { PlayerContext } from '../../contexts/PlayerContext/playerCtx'
import { RestartAlt } from '@styled-icons/material'

interface ClipEmbedOptions {
  src: string
  height: string | number
  width: string | number
  // allowFullScreen: boolean
  // parent: string
  preload: string
  autoplay: boolean
  muted: boolean
}


const PlayerPane = ({className}: { className?: string }) => {

  let currentClip = useContextSelector(PlayerContext, (c) => c.currentClip)
  let playing = useContextSelector(PlayerContext, (c) => c.playing)
  let [playerFrame, setPlayerFrame] = useState<ReactChild | null>(null)

  const renderPlayer = useMemo(() => (props: ClipEmbedOptions) => {

    let { autoplay, muted, ...rest } = props;
    // console.log(rest)
    return (
      <iframe {...rest}/>
    )

  }, [])

  useEffect(() => {
    if (currentClip) {
      let player = renderPlayer({
        src: currentClip.embed_url + '&autoplay=true&muted=false&parent=localhost&allowfullscreen=true',
        height: '100%',
        width: '100%',
        preload: 'auto',
        autoplay: true,
        muted: false
      })
      playing && setPlayerFrame(player)
    }
  }, [currentClip])

  return (
    <Box className={className}>
      {playerFrame}
    </Box>
  )

}

export default styled(PlayerPane)`
  height: 100%;
  width: 100%;


`