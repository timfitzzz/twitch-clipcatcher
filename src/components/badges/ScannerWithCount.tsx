import { Radar } from '@styled-icons/material/Radar'
import React, { useEffect, useRef } from 'react'
import { Flex } from 'rendition'
import styled from 'styled-components'
import Count from './MessageCount'



const ScannerIcon = styled(Radar)<{ spin: boolean }>`
  ${p => p.spin ? `
  animation-name: spin;
  animation-duration: 5000ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  fill: ${p.theme.colors.warning.main};
  `:``}

  margin-top: auto;
  margin-bottom: auto;
  margin-right: 4px;
  height: 22px;

  @keyframes spin {
    from {
        transform:rotate(0deg);
    }
    to {
        transform:rotate(360deg);
    }
`

export const Scanner = ({spin}: { spin: boolean }) => {
  return (<ScannerIcon viewBox={'0 0 24 24'} spin={spin}/>)
}



const ScannerWithCount = ({className, channelName, spin}: {className?: string, channelName: string, spin: boolean}) => {

  return (
    <Flex flexDirection={'row'} className={className}>
      <ScannerIcon spin={spin} />
      <Count channelName={channelName}/>
    </Flex>
  )
}

export default styled(ScannerWithCount)`
  margin-left: 4px;
  span {
    font-size: 12px;
  }
`