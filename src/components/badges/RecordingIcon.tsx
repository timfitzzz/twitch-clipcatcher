import React from 'react'
import styled from 'styled-components'
import { FiberManualRecord } from '@styled-icons/material/FiberManualRecord'

export const RecordingIcon = styled(FiberManualRecord).attrs(p => ({
  ...p,
  viewBox: "0 0 24 24"
}))<{ scanning: boolean }>`
  height: 21px;
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 0px;
  // fill: #946e6e;
  fill: #e80404;
  padding-top: 0px;
  padding-bottom: 0px;
  width: 21px;
  opacity: 0.2;

  ${p => p.scanning ? `
  animation: blink 1s cubic-bezier(.5, 1, 1, 1) infinite alternate;
  fill: #e80404;
  `:`
  &:hover {
      opacity: 1;
  `}

  @keyframes blink {
    from {
        opacity: 1;
    }
    to {
        opacity: 0.2;
    }

`

export default RecordingIcon