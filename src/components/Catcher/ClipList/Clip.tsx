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
import ClipUpperRightOverlay from './ClipUpperRightOverlay';
import ClipLowerRightOverlay from './ClipLowerRightOverlay';


const ClipThumbContainer = styled.div`
  position:relative;
  display: inline-block;
  img {
    display: block;
  }
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

const Clip = ({clipSlug, channelName, hideStats = false, className}: { clipSlug: string, channelName: string, hideStats?: boolean, className?: string}) => {

  return (
    <Box className={className}>
      <Flex flexDirection={'row'}>
         <ClipThumbContainer>
           <ClipThumb clipSlug={clipSlug} />
           <ClipOverlay flexDirection={'column'} justifyContent={'space-between'}>
              <Flex flexDirection={'row'} height={'100%'}>
                <PlayButton channelName={channelName} clipSlug={clipSlug} />
                <ClipOverlayLeft fullWidth={hideStats}>
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
                { !hideStats && (
                                <ClipOverlayRight >
                                  <ClipUpperRightOverlay clipSlug={clipSlug} channelName={channelName}/>
                                  <ClipLowerRightOverlay clipSlug={clipSlug} channelName={channelName}/>
                               </ClipOverlayRight>
                )}
             </Flex>
           </ClipOverlay>
         </ClipThumbContainer>
      </Flex>
    </Box>
  )
}

export default styled(Clip)`
  margin-left: 4px;
`