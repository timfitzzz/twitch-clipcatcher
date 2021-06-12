import { Radar } from '@styled-icons/material'
import React, { useEffect, useRef } from 'react'
import { Flex } from 'rendition'
import styled from 'styled-components'
import { MessageCountStore } from '../../contexts/ChannelsContext/MessageCountStore'

const ScannedBadge = styled.div`
  padding-left: 4px;
  padding-right: 4px;
  border: 1px dotted ${p => p.theme.colors.statusUpdating.main}; 
  background-color: transparent;
  color: ${p => p.theme.colors.statusInactive.dark};
`

const ScannedCount = styled.span`
`

const ScannerWithCount = ({className, channelName}: {className?: string, channelName: string}) => {

  const scanCountRef = useRef<HTMLSpanElement | null>(null)

  console.log('rendered tabtitle')

  useEffect(() => {

    MessageCountStore.registerCallback(channelName, (count: number) => {
      let countSpan = scanCountRef.current
      if (countSpan) {
        countSpan.innerHTML = `${count}`
      }
    })

    return (() => {
      MessageCountStore.clearCallback(channelName)
    })

  },[channelName])

  return (
    <Flex flexDirection={'row'} className={className}>
      <Radar viewBox={'0 0 24 24'}/>
      <ScannedBadge>
        <ScannedCount ref={scanCountRef}>
          0
        </ScannedCount>
      </ScannedBadge>
    </Flex>
  )
}

export default styled(ScannerWithCount)<{ spin: boolean }>`

  margin-left: 4px;

  span {
    font-size: 12px;

  }

  svg {

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
  }

  @keyframes spin {
    from {
        transform:rotate(0deg);
    }
    to {
        transform:rotate(360deg);
    }
}

`