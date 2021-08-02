import React from 'react'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks'
import { channelCleared, channelUpdatesHeld, channelUpdatesReleased, scanningStarted, scanningStopped } from '../../../redux/channels'
import { RecordingButton } from '../../badges/RecordingButton'
import { LockButton } from '../../badges/LockButton'
import ClearButton from '../../badges/ClearButton'
import { selectChannelScanning, selectChannelUpdateHold } from '../../../redux/selectors'


const LargerRecordingButton = styled(RecordingButton)`
  height: 21px;
  width: 21px;
  svg {
    height: 21.5px;
    width: 21.5px;
  }
  margin-top: auto;
  margin-bottom: auto;
`


const ReusableChannelControls = ({channelName, className}: {channelName: string, className?: string}) => {

  const scanning = useAppSelector(state => selectChannelScanning(state.channels[channelName]))
  const holdUpdates = useAppSelector(state => selectChannelUpdateHold(state.channels[channelName]))

  const dispatch = useAppDispatch()

  const toggleScanning = () => {
    if (scanning) {
      dispatch(scanningStopped(channelName))
    } else {
      dispatch(scanningStarted(channelName))
    }
  }

  const toggleUpdateHold = () => {
    if (holdUpdates) {
      dispatch(channelUpdatesReleased(channelName))
    } else {
      dispatch(channelUpdatesHeld(channelName))
    }
  }

  const resetChannel = () => {
    dispatch(channelCleared(channelName))
  }

  
  return (
    <div className={className + ' ChannelControlBar'}>
      <LargerRecordingButton recording={scanning} toggleRecording={toggleScanning} />
      <LockButton locked={holdUpdates} toggleLock={toggleUpdateHold}/>
      <ClearButton resetChannel={resetChannel}/>
    </div>
  )

}

const ChannelControlBar = styled(ReusableChannelControls)`
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  padding-left: 4px;
  align-items: center;
  margin-left: 0px;
  margin-right: 0px;
`

export default ChannelControlBar