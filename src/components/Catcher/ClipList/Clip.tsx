import React from 'react'
import { useContextSelector } from 'use-context-selector'
import styled from 'styled-components';
import { Box, Flex } from 'rendition'
import { TwitchClipV5 } from '../../../types'
import { CatcherBadge } from '../../badges/CatcherBadge';
import { PlayerContext } from '../../../contexts/PlayerContext/playerCtx';


const ClipThumb = styled.img`
  height: 45px;
  width: 86px;
`

const ClipTitle = styled.h3`
  margin-top: 0px;
  margin-bottom: 4px;
  margin-left: 4px;
  text-align: left;
`

const ClipThumbContainer = styled.div`
position:relative;
`

const ClipControlsContainer = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(100,100,100,0.5);
`

const PlayPauseButton = styled.div`


`


const Clip = ({clip, className}: { clip: TwitchClipV5, className?: string}) => {

   let playClip = useContextSelector(PlayerContext, (c) => c.playClip)


   return (
     <Box className={className}>
       <Flex flexDirection={'row'}>
          <ClipThumbContainer>
            <ClipThumb src={clip.thumbnails.tiny} />
            <ClipControlsContainer onClick={(e) => playClip && playClip(clip)}>

            </ClipControlsContainer>
          </ClipThumbContainer>
          <Flex flexDirection={'column'}>
            <Flex flexDirection={'row'}>
              <CatcherBadge type={'streamer'} value={clip.broadcaster.name}/>
              <ClipTitle>{clip.title}</ClipTitle>
            </Flex>
            <Flex flexDirection={'row'}>
              <CatcherBadge type={'duration'} value={clip.duration.toString()}/>
            </Flex>
          </Flex>
       </Flex>
     </Box>
   )


}

export default styled(Clip)`
  margin: 4px;
`