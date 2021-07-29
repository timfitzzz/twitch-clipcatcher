import React from 'react'
import styled from 'styled-components'

import CountOfMessages from './StatsPanel/CountOfMessages';
import CountOfClips from './StatsPanel/CountOfClips';


const ReusableStatsPanel = ({channelName, className}: {channelName: string, className?: string}) => {
  
  return (
    <div className={className}>
      <CountOfClips channelName={channelName}/>
      <CountOfMessages channelName={channelName}/>
    </div>
  )

}

const ChannelStatsPanel = styled(ReusableStatsPanel)`
  background-color: ${p => p.theme.colors.quartenary.semilight};

  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  flex-grow: 1;
  height: 100%;
  align-self: flex-end;
  align-content: center;

  margin-top: auto;
  margin-bottom: auto;
  margin-left: auto;
  margin-right: auto;

  // span {
  //   line-height: 20px;
  //   font-size: 20px;
  //   margin: 1px auto;
  //   position: relative;
  //   display: flex-item;
  //   margin-left: auto;
  //   margin-right: 0px;
  //   margin-bottom: auto;
  //   position: relative;
  //   display: flex-item;
  // }
`

export default ChannelStatsPanel