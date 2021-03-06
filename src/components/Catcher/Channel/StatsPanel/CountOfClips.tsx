import React from 'react'
import styled from 'styled-components'
import { OndemandVideo } from '@styled-icons/material/OndemandVideo'
import { useAppSelector } from '../../../../hooks/reduxHooks'
import useUpdateLock from '../../../../hooks/useUpdateLock'
import { abbreviateNumber } from 'js-abbreviation-number'
import { Lock } from '@styled-icons/fa-solid/Lock'
import { selectChannelClipsCount, selectChannelUpdateHold } from '../../../../redux/selectors'

const LockedClipsDisplay = styled(({count, className}: {count: string, className?: string}) => {
  return (
    <div className={className}>
      <span className={'lockedCount'}>{count}</span>
      <Lock/>
    </div>
  )
})`

  display: flex;
  flex-direction: column;
  height: 20px;
  margin-left: 2px;
  .lockedCount {
    line-height: 10px;
    font-size: 10px;
    margin: 1px auto;
    position: relative;
  }

  svg {
    height: 7px;
    width: 7px;
  }

`

export const CountOfClips = styled(({channelName, className}: {channelName: string, className?: string}) => {
  
  const clipsCount = useAppSelector(state => selectChannelClipsCount(state.channels[channelName]))
  const holdUpdates = useAppSelector(state => selectChannelUpdateHold(state.channels[channelName]))
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

  display: flex;
  flex-direction: row;
  margin-top: auto;
  margin-bottom: auto;

  .clipscount {
    margin-left: auto;
    margin-top: auto;
    margin-bottom: auto;
    position: relative;
    display: flex-item;
    font-size: 20px;
    line-height: 20px;
  }


  > svg {
    height: 20px;
    width: 20px;

    margin-left: 4px;
    margin-top: 1px;
    margin-bottom: auto;
    margin-right: 0px;
  }

`
export default CountOfClips