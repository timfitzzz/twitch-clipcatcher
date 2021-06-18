import React from 'react'
import { FiberManualRecord, DeleteForever } from '@styled-icons/material'
import { PauseCircle } from '@styled-icons/feather'
import { Record } from '@styled-icons/foundation'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks'
import { channelCleared, scanningStarted, scanningStopped } from '../../../redux/channels'
import { OptionsPanelSection } from '.'
import { RecordingIcon } from '../../badges/RecordingIcon'
import { RecordingButton } from '../../badges/RecordingButton'
import { PauseIcon } from '../../badges/PauseIcon'

const StartRecordingIcon = styled(Record)`
  height: 21px;
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 0px;
  fill: orange;
  width: 21px;
`

const ReusableCollectionControls = ({channelName, className}: {channelName: string, className?: string}) => {

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
    <OptionsPanelSection className={className}>
      <RecordingButton recording={scanning} toggleRecording={toggleScanning} />
      {/* <RecordingIcon onClick={() => scanning ? null : toggleScanning()} scanning={scanning}/>
      <PauseIcon scanning={scanning} onClick={() => scanning ? toggleScanning() : null}/> */}

    </OptionsPanelSection>
  )


}

const CollectionControls = styled(ReusableCollectionControls)`

`

export default CollectionControls