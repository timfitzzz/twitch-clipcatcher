import React from 'react'
import { Lock } from '@styled-icons/fa-solid/Lock'
import { Unlock } from '@styled-icons/fa-solid/Unlock'
import styled from 'styled-components'

const LockButtonContainer = styled.div<{locked: boolean}>`
  width: 18px;
  height: 18px;
  margin-right: 4px;
  margin-top: auto;
  margin-bottom: auto;
  > svg {
    height: 17px;
    width: 17px;
    position: absolute;
    margin-top: auto;
    margin-bottom: auto;
  }

  &:hover {
    svg {
      color: gold;
    }
    ${p => p.locked ? `
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

  ${p => p.locked ? `
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

export const LockButton = ({locked, toggleLock, className}: {locked: boolean, toggleLock: () => void, className?: string }) => {

  return (
    <LockButtonContainer locked={locked} onClick={(e) => toggleLock()} className={className} >
      { locked ? (
        <Lock/>
      ) : (
        <Unlock/>
      )}
    </LockButtonContainer>
  )


}

export default LockButton