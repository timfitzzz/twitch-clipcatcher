import React from 'react'
import styled from 'styled-components'
import { useAppSelector } from '../../hooks/reduxHooks'
import { selectChannelClipsCount } from '../../redux/selectors'

const ClipsCount = ({channelName, className, inverted}: {channelName: string, className?: string, inverted?: boolean}) => {

  const clipsCount = useAppSelector(state => selectChannelClipsCount(state.channels[channelName]))

  return (
  <div className={className}>
    <span>{clipsCount}</span>
  </div>
  )
}
  

export default styled(ClipsCount)`
  display: flex;
  flex-direction: row;
  line-height: 1.5;
  box-sizing: border-box;

  > span {
    display: inline-block;
    padding: 1px 4px;
    margin: auto 4px;
    line-height: 14px;
    color: ${({theme}) => theme.colors.primary.main};
    color: rgb(0, 113, 113);
    background-color: #c7ffff;

    border-radius: 1em;
    font-size: 12px;

    ${p => p.inverted && `
      
      background-color: #c7ffff;
      // line-height: 13px;
      // padding-right: 2px;
      // padding-top: 0px;
      // padding-bottom: 0px;
    `}
`