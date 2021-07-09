import React from 'react'
import styled from 'styled-components'
import { OndemandVideo } from '@styled-icons/material/OndemandVideo'
import { useAppSelector } from '../../../../hooks/reduxHooks'
import useUpdateLock from '../../../../hooks/useUpdateLock'
import { abbreviateNumber } from 'js-abbreviation-number'
import { Lock } from '@styled-icons/fa-solid/Lock'

const LockedClipsDisplay = styled(({count, className}: {count: string, className?: string}) => {
  return (
    <div className={className}>
      <span>{count}</span>
      <Lock/>
    </div>
  )
})`

  display: flex;
  flex-direction: column;
  height: 24px;
  span {
    line-height: 14px;
    font-size: 14px;
    margin: 1px auto;
    position: relative;
    display: flex-item;
  }

  svg {
    height: 10px;
  }

`

export const CountOfClips = styled(({channelName, className}: {channelName: string, className?: string}) => {
  
  const clipsCount = useAppSelector(state => state.channels[channelName].clips.length)
  const holdUpdates = useAppSelector(state => state.channels[channelName].holdUpdates)
  const displayedClipsCount = useUpdateLock(clipsCount, channelName)
  
  return (
    <div className={className}>
      <span className={'clipscount'}>{abbreviateNumber(displayedClipsCount)}</span>
      { holdUpdates && (
        <LockedClipsDisplay count={abbreviateNumber(clipsCount - displayedClipsCount)}/>
      )}
      <OndemandVideo/>
    </div>
  )
})`

  padding-left: 8px;
  font-size: 30px;
  line-height: 30px;
  // padding-bottom: 2px;
  display: flex;
  flex-direction: row;
  margin-top: auto;
  margin-bottom: auto;

  .clipscount {
    margin-left: auto;

    margin-top: -2px;
    margin-bottom: auto;
    position: relative;
    display: flex-item;
  }


  > svg {
    height: 24px;
    width: 24px;

    margin-left: 4px;
    margin-top: auto;
    margin-bottom: auto;
    margin-right: 0px;
  }

`
export default CountOfClips