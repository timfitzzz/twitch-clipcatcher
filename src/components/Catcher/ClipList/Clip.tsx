import React from 'react'
// import { useContextSelector } from 'use-context-selector'
import styled from 'styled-components';
import { Box, Flex } from 'rendition';

// clip components
import ClipStats from './ClipStats'
import PlayButton from './PlayButton';
import ClipThumb from './ClipThumb';
import ClipTitle from './ClipTitle';

// badges
import StreamerBadge from '../../badges/StreamerBadge';
import SpecialBadge from '../../badges/SpecialBadge';
import Delay from '../../badges/WhenAgoBadge';
import VoteCount from '../../badges/VoteCount';
import ViewCountBadge from '../../badges/ViewCountBadge';
import ClipDurationBadge from '../../badges/ClipDurationBadge';

const ClipThumbContainer = styled.div`
  position:relative;
  display: inline-block;
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

const ClipOverlayFrogCountBadge = styled(VoteCount)`
  margin-right: 4px;
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
  justifyContent: 'flex-end',
  alignItems: 'flex-start'
}))`
  height: 50%;
`

const ClipOverlayLowerRight = styled(Flex).attrs(p => ({
  ...p,
  flexDirection: 'column',
  justifyContent: 'flex-end',
  alignItems: 'flex-end'
}))`
  height: 50%;
`

const ClipOverlayWhenAgoBadge = styled(Delay)`
  margin-top: auto;
  margin-bottom: 4px;
`

const Clip = ({clipSlug, channelName, className}: { clipSlug: string, channelName: string, className?: string}) => {

  return (
    <Box className={className}>
      <Flex flexDirection={'row'}>
         <ClipThumbContainer>
           <ClipThumb clipSlug={clipSlug} />
           <ClipOverlay flexDirection={'column'} justifyContent={'space-between'}>
              <Flex flexDirection={'row'} height={'100%'}>
                <PlayButton channelName={channelName} clipSlug={clipSlug} />
                <ClipOverlayLeft>
                  <ClipOverlayUpperLeft>
                    <StreamerBadge clipSlug={clipSlug}/>
                    <Flex flexDirection={'row'}>
                      <SpecialBadge type={'meta'} clipSlugs={[clipSlug]} channelName={channelName}/>
                      <SpecialBadge type={'drama'} clipSlugs={[clipSlug]} channelName={channelName}/>
                    </Flex>
                  </ClipOverlayUpperLeft>
                  <ClipOverlayLowerLeft>
                      <ClipTitle clipSlug={clipSlug}/>
                  </ClipOverlayLowerLeft>
                </ClipOverlayLeft>
                <ClipOverlayRight>
                  <ClipOverlayUpperRight>
                    <ClipOverlayFrogCountBadge clipSlug={clipSlug} channelName={channelName}/>
                    <ViewCountBadge clipSlug={clipSlug}/>
                  </ClipOverlayUpperRight>
                  <ClipOverlayLowerRight>
                    <ClipOverlayWhenAgoBadge clipSlug={clipSlug} />
                    <ClipDurationBadge clipSlug={clipSlug}/>
                  </ClipOverlayLowerRight>
               </ClipOverlayRight>
             </Flex>
           </ClipOverlay>
         </ClipThumbContainer>
         <Flex flexDirection={'column'}>
          <ClipStats clipSlugs={[clipSlug]} channelName={channelName} />
         </Flex>
      </Flex>
    </Box>
  )
}

export default styled(Clip)`
  margin: 4px;
`