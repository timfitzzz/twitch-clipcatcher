import React, { useRef, useState } from 'react'
import { Lock } from '@styled-icons/fa-solid/Lock'
import { Unlock } from '@styled-icons/fa-solid/Unlock'
import styled from 'styled-components'
import { Popover } from 'rendition'
import debounce from 'lodash/debounce'

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

export const LockButtonPopover = styled(Popover)`
    span {
      font-size: 10px;
      font-weight: bold;
      text-transform: uppercase;
      padding: 4px;
      margin: auto;
    }
    div {
      display: flex;
      overflow: hidden;
      border-radius: 4px;
    }

    

`

export const LockButton = ({locked, toggleLock, className}: {locked: boolean, toggleLock: () => void, className?: string }) => {

  let popoverTarget = useRef<HTMLDivElement>(null)
  let [showPopover, setShowPopover] = useState<any>(false)

  const handlePopover = debounce(() => setShowPopover(true), 100)

  const handleMouseExit = () => {
    handlePopover.cancel()
    setShowPopover(false)
  }


  return (
    <LockButtonContainer onMouseEnter={handlePopover} onMouseLeave={handleMouseExit} ref={popoverTarget} locked={locked} onClick={(e) => toggleLock()} className={className} >
      { showPopover && popoverTarget && !!(popoverTarget.current) && (
        <LockButtonPopover target={popoverTarget.current} onDismiss={()=>{}}>
          <span>Lock / Unlock List of Clips</span>
        </LockButtonPopover>
      ) }
      { locked ? (
        <Lock/>
      ) : (
        <Unlock/>
      )}
    </LockButtonContainer>
  )


}

export default LockButton