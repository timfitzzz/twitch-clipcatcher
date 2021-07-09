import React from 'react'
import { DeleteForever } from '@styled-icons/material/DeleteForever'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks'
import { channelUpdatesHeld, channelUpdatesReleased, scanningStarted, scanningStopped } from '../../../redux/channels'
import { OptionsPanelSectionTitle } from '.'
import { RecordingButton } from '../../badges/RecordingButton'
import { LockButton } from '../../badges/LockButton'


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

const ClearIcon = styled(DeleteForever)`
  height: 29px;
  margin-top: -1.5px;
  margin-bottom: auto;
  margin-right: 0px;
  fill: ${p => p.theme.colors.warning.light};
  width: 29px;
  cursor: pointer;
  view-box: 0 0 20 21;

  &:hover {
    fill: red;
  }
`

const ReusableCollectionControls = ({channelName, className, resetChannel}: {channelName: string, resetChannel: () => void, className?: string}) => {

  const scanning = useAppSelector(state => state.channels[channelName].scanning)
  const holdUpdates = useAppSelector(state => state.channels[channelName].holdUpdates)
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
  
  return (
    <div className={className}>
      <OptionsPanelSectionTitle isActive={true}>
        ctrl
      </OptionsPanelSectionTitle>
      <LargerRecordingButton recording={scanning} toggleRecording={toggleScanning} />
      <LockButton locked={holdUpdates} toggleLock={toggleUpdateHold}/>
      <ClearIcon onClick={() => resetChannel()}/>
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