import React from 'react'
import { DeleteForever } from '@styled-icons/material/DeleteForever'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks'
import { channelCleared, channelUpdatesHeld, channelUpdatesReleased, scanningStarted, scanningStopped } from '../../../redux/channels'
import { OptionsPanelSectionTitle } from '.'
import { RecordingButton } from '../../badges/RecordingButton'
import { LockButton } from '../../badges/LockButton'
import ClearButton from '../../badges/ClearButton'
import memoize from 'proxy-memoize'


const LargerRecordingButton = styled(RecordingButton)`
  padding-left: 4px;
  height: 30px;
  width: 30px;
  svg {
    height: 30px;
    width: 30px;
  }
  margin-left: 4px;
  margin-top: auto;
  margin-bottom: auto;
`


const ReusableCollectionControls = ({channelName, className}: {channelName: string, className?: string}) => {

  const scanning = useAppSelector(memoize(state => state.channels[channelName].scanning))
  const holdUpdates = useAppSelector(memoize(state => state.channels[channelName].holdUpdates))
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
    <div className={'CollectionControls ' + className}>
      <OptionsPanelSectionTitle isActive={true}>
        ctrl
      </OptionsPanelSectionTitle>
      <LargerRecordingButton recording={scanning} toggleRecording={toggleScanning} />
      <LockButton locked={holdUpdates} toggleLock={toggleUpdateHold}/>
      <ClearButton resetChannel={resetChannel}/>
    </div>
  )

}

const CollectionControls = styled(ReusableCollectionControls)`
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  padding-left: 4px;
`

export default CollectionControls