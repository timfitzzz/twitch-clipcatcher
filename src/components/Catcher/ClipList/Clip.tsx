import React from 'react'
// import { useContextSelector } from 'use-context-selector'
import styled from 'styled-components';
import { Box, Flex } from 'rendition'
import { CaughtClip } from '../../../types'
import { CatcherBadge } from '../../badges/CatcherBadge';
import { useContextSelector } from 'use-context-selector';
import { PlayerContext } from '../../../contexts/PlayerContext/playerCtx';
import { useAppSelector } from '../../../hooks/reduxHooks';
import VoteCount from '../../badges/VoteCount';
// import { PlayerContext } from '../../../contexts/PlayerContext/playerCtx';


const ClipThumb = styled.img`
  height: 147px;
  width: 260px;
`

const ClipTitleContainer = styled(Box)`
  margin-bottom: 4px;
  margin-top: auto;
  line-height: 16px;
  padding-left: 4px;
`

const ClipTitle = styled.span`
  margin-top: auto;
  margin-bottom: auto;
  text-align: left;
  overflow-wrap: anywhere;
  font-size: 17px;
  color: white;
  font-weight: bold;
`

const ClipThumbContainer = styled.div`
  position:relative;
  display: inline-block;
`

const ClipControlsContainer = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
  height: 147px;
  width: 260px;
`

const ClipOverlay = styled(Flex)`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(100,100,100,0.2);
  box-sizing: border-box;
  display: flex;
  height: 147px;
  width: 260px;
`

// const PlayPauseButton = styled.div`


// `

const ClipOverlayStreamerBadge = styled(CatcherBadge).attrs((p) => ({
  ...p,
  type: 'streamer'
}))`
  margin-top: 0;
  margin-left: 0;
  margin-right: auto;
  

`

const ClipOverlayDurationBadge = styled(CatcherBadge).attrs((p) => ({
  ...p,
  type: 'duration'
}))`
  margin-right: 0;
  margin-left: auto;
  margin-top: 0px;
  margin-bottom: 4px;
`

const ClipOverlayFrogCountBadge = styled(VoteCount)`
  margin-right: 0;
  margin-left: auto;
  margin-top: 4px;
  margin-bottom: auto;
`

const ClipOverlayViewCountBadge = styled(CatcherBadge).attrs((p) => ({
  ...p,
  type: 'viewCount'
}))`
  margin-right: 0;
  margin-left: auto;
  margin-top: 4px;
  margin-bottom: auto;
`

const ClipOverlayRight = styled(Flex).attrs(p => ({
  ...p,
  flexDirection: 'column',
  height: '100%',
  marginLeft: "auto",
  marginRight: "0"
}))`
  min-width: 75px;

`

const ClipOverlayLeft = styled(Flex).attrs(p => ({
  ...p,
  flexDirection: 'column',
  height: '100%',
  marginLeft: "0",
  marginRight: "auto"
}))`
`

const ClipOverlayUpperLeft = styled(Box)`
  height: 50%;

`

const ClipOverlayUpperRight = styled(Box)`
  height: 50%;

`

const ClipOverlayLowerLeft = styled(Flex).attrs(p => ({
  ...p,
  flexDirection: 'column',
  justifyContent: 'bottom'
}))`
  height: 50%;
`

const ClipOverlayLowerRight = styled(Flex).attrs(p => ({
  ...p,
  flexDirection: 'column',
  justifyContent: 'bottom'
}))`
  height: 50%;
`

// const ClipOverlayTrustedBadge = styled(CatcherBadge).attrs(p => ({
//   ...p,
//   type: 'trusted'
// }))``

const ClipOverlayWhenAgoBadge = styled(CatcherBadge).attrs(p => ({
  ...p,
  type: 'whenago'
}))`
  margin-top: auto;
  margin-bottom: 4px;
`

const Clip = ({clipSlug, channelName, className}: { clipSlug: string, channelName: string, className?: string}) => {

  let clip = useAppSelector(s => s.clips.clips[clipSlug])
  let playClip = useContextSelector(PlayerContext, (c) => c.playClip)

  return (
    <Box className={className}>
      <Flex flexDirection={'row'}>
         <ClipThumbContainer>
           <ClipThumb src={clip.thumbnails.small} />
           <ClipOverlay flexDirection={'column'} justifyContent={'space-between'}>
              <Flex flexDirection={'row'} height={'100%'}>
                <ClipOverlayLeft>
                  <ClipOverlayUpperLeft>
                    <ClipOverlayStreamerBadge value={clip.broadcaster.name}/>
                  </ClipOverlayUpperLeft>
                  <ClipOverlayLowerLeft>
                    <ClipTitleContainer>
                      <ClipTitle>{clip.title}</ClipTitle>
                    </ClipTitleContainer>
                  </ClipOverlayLowerLeft>
                </ClipOverlayLeft>
                <ClipOverlayRight>
                  <ClipOverlayUpperRight>
                    <ClipOverlayFrogCountBadge upvotes={clip.votes[channelName].up} downvotes={clip.votes[channelName].down}/>
                    <ClipOverlayViewCountBadge value={clip.views}/>
                  </ClipOverlayUpperRight>
                  <ClipOverlayLowerRight>
                    {/* <ClipOverlayTrustedBadge value={`${clip.postedBy[channelName].mods ? true : false} ${clip.postedBy[channelName].vips ? true : false} ${clip.postedBy[channelName].broadcaster ? true : false}`}/>               */}
                    <ClipOverlayWhenAgoBadge value={clip.startEpoch}/>
                    <ClipOverlayDurationBadge value={clip.duration.toString()}/>
                  </ClipOverlayLowerRight>
               </ClipOverlayRight>
             </Flex>
           </ClipOverlay>
           <ClipControlsContainer onClick={(e) => playClip && playClip(clip)}>
            </ClipControlsContainer>
         </ClipThumbContainer>
         <Flex flexDirection={'column'}>
           {/* <Flex flexDirection={'row'}>
             <CatcherBadge type={'streamer'} value={clip.broadcaster.name}/>
             <ClipTitle>{clip.title}</ClipTitle>
           </Flex> */}
           {/* <Flex flexDirection={'row'}>
             <CatcherBadge type={'duration'} value={clip.duration.toString()}/>
           </Flex> */}
         </Flex>
      </Flex>
    </Box>
  )
}

export default styled(Clip)`
  margin: 4px;
`