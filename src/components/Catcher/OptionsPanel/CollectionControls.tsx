import React from 'react'
import { DeleteForever } from '@styled-icons/material/DeleteForever'
import { PauseCircle } from '@styled-icons/feather/PauseCircle'
import { Record } from '@styled-icons/foundation/Record'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks'
import { channelCleared, scanningStarted, scanningStopped } from '../../../redux/channels'
import { OptionsPanelSection, OptionsPanelSectionTitle } from '.'
import { RecordingIcon } from '../../badges/RecordingIcon'
import { RecordingButton } from '../../badges/RecordingButton'
import { LockButton } from '../../badges/LockButton'
import { PauseIcon } from '../../badges/PauseIcon'


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

const LargerLockButton = styled(LockButton)`
  height: 24px;
  width: 24px;
  svg {
    height: 24px;
    width: 24px;
  }

`

const ClearIcon = styled(DeleteForever)`
  height: 30px;
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 0px;
  fill: ${p => p.theme.colors.warning.light};
  width: 30px;

  &:hover {
    fill: red;
  }
`

const ReusableCollectionControls = ({locked, toggleDisplayLock, channelName, className, resetChannel}: {locked: boolean, toggleDisplayLock: () => void, channelName: string, resetChannel: () => void, className?: string}) => {

  const scanning = useAppSelector(state => state.channels[channelName].scanning)
  const dispatch = useAppDispatch()

  const toggleScanning = () => {
    if (scanning) {
      dispatch(scanningStopped(channelName))
    } else {
      dispatch(scanningStarted(channelName))
    }
  }
  
  return (
    <div className={className}>
      <OptionsPanelSectionTitle isActive={true}>
        ctrl
      </OptionsPanelSectionTitle>
      <LargerRecordingButton recording={scanning} toggleRecording={toggleScanning} />
      <LargerLockButton locked={locked} toggleLock={toggleDisplayLock}/>
      <ClearIcon onClick={() => resetChannel()}/>
      {/* <RecordingIcon onClick={() => scanning ? null : toggleScanning()} scanning={scanning}/>
      <PauseIcon scanning={scanning} onClick={() => scanning ? toggleScanning() : null}/> */}

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