import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'
import { MessageCountStore } from '../../contexts/ChannelsContext/MessageCountStore'


const CountBadge = styled.div`
  padding-left: 4px;
  padding-right: 4px;
  // border: 1px dotted ${p => p.theme.colors.statusUpdating.main}; 
  background-color: transparent;
  color: ${p => p.theme.colors.statusInactive.dark};
`

const CountText = styled.span`
  color: lightgray;
`
export const ReusableCount = ({channelName, className}: { channelName: string, className?: string}) => {

const scanCountRef = useRef<HTMLSpanElement | null>(null)

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
  <CountBadge className={className}>
    <CountText ref={scanCountRef}>
    0
    </CountText>
  </CountBadge>
)
}

const MessageCount = styled(ReusableCount)`
`

export default MessageCount