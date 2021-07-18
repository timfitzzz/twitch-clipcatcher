import React from 'react'
import styled from 'styled-components'
import { Close } from '@styled-icons/material/Close'
import { useAppDispatch } from '../../../hooks/reduxHooks'
import { channelRemoved } from '../../../redux/channels'

const CloseIcon = styled(Close)`
  width: 18px;
  height: 18px;
  fill: ${p => p.theme.colors.gray.dark};

  margin-left: -1px;
  margin-top: -7px;

  &:hover {
    fill: red;
  } 
`

const ChannelCloseButton = ({channelName, className}: { channelName: string, className?: string}) => {

  const dispatch = useAppDispatch()

  return (
    <div className={className} onClick={(e) => dispatch(channelRemoved(channelName))}>
        <CloseIcon />      
    </div>
  )

}

export default styled(ChannelCloseButton)`
  height: 18px;
  width: 18px;
  right: 0;
  margin-left: 8px;
  margin-right: 4px;
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