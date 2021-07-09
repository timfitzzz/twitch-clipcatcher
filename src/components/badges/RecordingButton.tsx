import React from 'react'
import { RecordingIcon } from './RecordingIcon'
import { PauseIcon } from './PauseIcon'
import styled from 'styled-components'

const RecordingButtonContainer = styled.div<{recording: boolean}>`
  width: 30px;
  height: 30px;
  margin-left: 4px;
  margin-top: auto;
  margin-bottom: auto;
  > svg {
    height: 30px;
    width: 30px;
    position: absolute;
    margin-top: auto;
    margin-bottom: auto;
    cursor: pointer;
  }

  &:hover {
    ${p => p.recording ? `
      #pauseicon {
        opacity: 1;
        > circle {
          fill: transparent;
        }
        > line {
          opacity: 1;
        }
      }

    `: `
      #recordicon {
        opacity: 1;
      }
      #pauseicon {
        > line {
          opacity: 0;
        }
      }
    `}
  }

  ${p => p.recording ? `
    #pauseicon {
      > line {
        opacity: 0;
      }
    }
  `: `
    #pauseicon {
      opacity: 1;
      > line {
        opacity: 1;
      }
    }
  `}
`

export const RecordingButton = ({recording, toggleRecording, className}: {recording: boolean, toggleRecording: () => void, className?: string }) => {

  return (
    <RecordingButtonContainer recording={recording} onClick={(e) => toggleRecording()} className={className} >
      <RecordingIcon id={'recordicon'} scanning={recording}/>
      <PauseIcon id={'pauseicon'} scanning={recording}/>
    </RecordingButtonContainer>
  )


}

export default RecordingButton