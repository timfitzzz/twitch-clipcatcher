import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { Close } from '@styled-icons/material/Close'
import { useAppDispatch } from '../../../hooks/reduxHooks'
import { channelRemoved } from '../../../redux/channels'
import Tooltip from '../../popovers/Tooltip'
import debounce from 'lodash/debounce'

const CloseIcon = styled(Close)`
  width: 18px;
  height: 18px;
  fill: ${p => p.theme.colors.gray.dark};

  margin-left: -1px;
  margin-top: -7px;
  cursor: pointer;
  &:hover {
    fill: red;
  } 
`
const ChannelCloseButtonText = styled.span`
  color: ${p => p.theme.colors.danger.main};
`


const ChannelCloseButton = ({channelName, className}: { channelName: string, className?: string}) => {

  const dispatch = useAppDispatch()

  let popoverTarget = useRef<HTMLDivElement>(null)
  let [showPopover, setShowPopover] = useState<any>(false)

  const handlePopover = debounce(() => setShowPopover(true), 100)

  const handleMouseExit = () => {
    handlePopover.cancel()
    setShowPopover(false)
  }

  return (
    <div className={className} onMouseEnter={handlePopover} onMouseLeave={handleMouseExit} ref={popoverTarget} onClick={(e) => dispatch(channelRemoved(channelName))}>
      {showPopover && !!(popoverTarget.current) && (
        <Tooltip target={popoverTarget.current} placement={'top'} onDismiss={() => {}}>
          <ChannelCloseButtonText>Close Channel (Irreversible!)</ChannelCloseButtonText>
       </Tooltip>
      )}
      <CloseIcon className={'ChannelCloseButton'} />      
    </div>
  )

}

export default styled(ChannelCloseButton)`
  height: 18px;
  width: 18px;
  right: 0;
  margin-top: -2px;
  margin-left: auto;
  margin-right: 0px;
  // background-color: rgba(255,255,255,0.5);
  border-radius: 4px;
  // border: 1px solid ${p => p.theme.colors.primary.light};
  box-sizing: border-box;
  display: flex;

  svg {
    
    position: relative;
    margin: auto;
    height: 18px;
  }

  &:hover {
    background-color: ${p => p.theme.colors.danger.main};
    // border-top: 1px solid ${p => p.theme.colors.danger.light};
    // border-right: 1px solid ${p => p.theme.colors.danger.light};
    svg {
      fill: white;
    }
  }

`