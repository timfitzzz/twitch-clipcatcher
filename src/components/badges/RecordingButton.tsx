import React, { useRef, useState } from 'react'
import { RecordingIcon } from './RecordingIcon'
import { PauseIcon } from './PauseIcon'
import debounce from 'lodash/debounce'
import styled from 'styled-components'
import Tooltip from '../popovers/Tooltip'

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

  let popoverTarget = useRef<HTMLDivElement>(null)
  let [showPopover, setShowPopover] = useState<any>(false)

  const handlePopover = debounce(() => setShowPopover(true), 100)

  const handleMouseExit = () => {
    handlePopover.cancel()
    setShowPopover(false)
  }

  return (
    <RecordingButtonContainer ref={popoverTarget} onMouseEnter={handlePopover} onMouseLeave={handleMouseExit} recording={recording} onClick={(e) => toggleRecording()} className={className} >
      {showPopover && !!(popoverTarget.current) && (
        <Tooltip target={popoverTarget.current} placement={'top'} onDismiss={() => {}}>
          <span>Record / Pause</span>
        </Tooltip>
      )}
      <RecordingIcon id={'recordicon'} scanning={recording}/>
      <PauseIcon id={'pauseicon'} scanning={recording}/>
    </RecordingButtonContainer>
  )


}

export default RecordingButton