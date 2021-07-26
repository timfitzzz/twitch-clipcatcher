import React from 'react'
// import { useContextSelector } from 'use-context-selector'
import styled from 'styled-components';
import { Box, Flex } from 'rendition';

// clip components
import PlayButton from './PlayButton';
import ClipThumb from './ClipThumb';
import ClipTitle from './ClipTitle';

// badges
import StreamerBadge from '../../badges/StreamerBadge';
import SpecialBadge from '../../badges/SpecialBadge';
import ClipDurationBadge from '../../badges/ClipDurationBadge';
import ClipUpperRightOverlay from './ClipUpperRightOverlay';
import ClipLowerRightOverlay from './ClipLowerRightOverlay';


const ClipThumbContainer = styled.div`
  position:relative;
  display: flex;
  flex-direction: row;
  margin-right: 0px;
  justify-content: stretch;
  flex-grow: 1;
  margin-left: auto;
  width: 100%;
  img {
    display: block;
  }
`

const ClipOverlay = styled(Flex)`
  position: absolute;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(100,100,100,0.2);
  box-sizing: border-box;
  display: flex;
  // height: 142px;
  // width: 252px;
  border-radius: 4px;
`

const ClipOverlayRight = styled(Flex).attrs(p => ({
  ...p,
  flexDirection: 'column',
  height: '100%',
  marginLeft: "auto",
  marginRight: "0"
}))`
  min-width: 75px;
  position: absolute;
  right: 0px;

`

const ClipOverlayLeft = styled(Flex).attrs(p => ({
  ...p,
  flexDirection: 'column',
  height: '100%',
  marginLeft: "0",
  marginRight: "auto"
}))<{fullWidth?: boolean}>`
${({fullWidth}) => !fullWidth && 'max-width: 65%;' }
`

const ClipOverlayUpperLeft = styled(Box)`
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

const ClipSpecialBadgeContainer = styled.div<{hideStats: boolean}>`
  display: flex;
  flex-direction: row;
  ${({hideStats}) => hideStats && `
  display: none;
  `}
`

const Clip = ({clipSlug, channelName, showDuration = false, hideStats = false, className}: { clipSlug: string, channelName: string, showDuration?: boolean, hideStats?: boolean, className?: string}) => {

  return (
         <ClipThumbContainer className={className}>
           <ClipThumb clipSlug={clipSlug} />
           <ClipOverlay flexDirection={'column'} justifyContent={'space-between'}>
              <Flex flexDirection={'row'} height={'100%'}>
                <PlayButton channelName={channelName} clipSlug={clipSlug} />
                <ClipOverlayLeft fullWidth={hideStats}>
                  <ClipOverlayUpperLeft>
                    <StreamerBadge clipSlug={clipSlug}/>
                    <ClipSpecialBadgeContainer hideStats={hideStats}>
                      <SpecialBadge type={'meta'} clipSlugs={[clipSlug]} channelName={channelName}/>
                      <SpecialBadge type={'drama'} clipSlugs={[clipSlug]} channelName={channelName}/>
                    </ClipSpecialBadgeContainer>
                  </ClipOverlayUpperLeft>
                  <ClipOverlayLowerLeft>
                      <ClipTitle clipSlug={clipSlug}/>
                      <div></div>
                  </ClipOverlayLowerLeft>
                </ClipOverlayLeft>
                { !hideStats ? (
                                <ClipOverlayRight >
                                  <ClipUpperRightOverlay clipSlug={clipSlug} channelName={channelName}/>
                                  <ClipLowerRightOverlay clipSlug={clipSlug} channelName={channelName}/>
                               </ClipOverlayRight>
                ) : showDuration && (
                  <ClipOverlayRight>
                    <ClipDurationBadge clipSlug={clipSlug} key={'duration'+clipSlug}/>
                  </ClipOverlayRight>
                )}
             </Flex>
           </ClipOverlay>
         </ClipThumbContainer>
  )
}

export default styled(Clip)`
  margin-left: 4px;
`