import React from 'react'
import { Lock } from '@styled-icons/fa-solid/Lock'
import { Unlock } from '@styled-icons/fa-solid/Unlock'
import styled from 'styled-components'

const LockButtonContainer = styled.div<{locked: boolean}>`
  width: 18px;
  height: 18px;
  margin-left: 4px;
  margin-top: auto;
  margin-bottom: auto;
  > svg {
    height: 18px;
    width: 18px;
    position: absolute;
    margin-top: auto;
    margin-bottom: auto;
    cursor: pointer;

    ${p => p.locked && `
      
      > path {
        fill: #e80404;
        animation: lockblink 1s cubic-bezier(.5, 1, 1, 1) infinite alternate;
      }
    `}

    @keyframes lockblink {
      from {
          fill: gold;
      }
      to {
          fill: ${p => p.theme.colors.text.main};
      }
    }
  }

  &:hover {
    svg {
      color: gold;
      > path {
        animation: none;
      }
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