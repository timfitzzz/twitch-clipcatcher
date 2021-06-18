import React from 'react'
import styled from 'styled-components'
import { PauseCircle } from '@styled-icons/feather'

export const PauseIcon = styled(PauseCircle)<{scanning: boolean}>`
  height: 17px;
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 0px;
  width: 17px;

  ${p => p.scanning ? `
    opacity: 1;
    &:hover {
      > circle {
        fill: black;
      }
      line {
        stroke: white;
        &:first-of-type {  
          x1: 9;
          x2: 11;
        }
        &:last-of-type { 
          x1: 13;
          x2: 15;
        }
      }
    }
  `: `
    opacity: 0.2;
  `}


`

export default PauseIcon