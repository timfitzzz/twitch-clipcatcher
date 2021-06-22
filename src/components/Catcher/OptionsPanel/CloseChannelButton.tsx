import React from 'react'
import styled from 'styled-components'
import { Close } from '@styled-icons/material/Close'
import { useAppDispatch } from '../../../hooks/reduxHooks'
import { channelRemoved } from '../../../redux/channels'

const CloseIcon = styled(Close)`
  width: 18px;
  height: 18px;
  fill: ${p => p.theme.colors.gray.dark};

  &:hover {
    fill: red;
  } 
`

const CloseChannelButton = ({channelName, className}: { channelName: string, className?: string}) => {

  const dispatch = useAppDispatch()

  return (
    <div className={className} onClick={(e) => dispatch(channelRemoved(channelName))}>
      <div style={{height: '100%'}}>
        <CloseIcon />
      </div>
      
    </div>
  )

}

export default styled(CloseChannelButton)`
  position: absolute;
  height: 18px;
  width: 18px;
  right: 0;
  margin-right: -8px;
  margin-top: -4px;
  background-color: rgba(255,255,255,0.5);
  border-bottom-left-radius: 4px;
  border-left: 1px solid ${p => p.theme.colors.primary.light};
  border-bottom: 1px solid ${p => p.theme.colors.primary.light};
  svg {
    position: relative;
    margin-top: -6px;
    margin-left: 1px
    margin-bottom: auto;
    height: 18px;
  }

  &:hover {
    background-color: ${p => p.theme.colors.danger.main};
    border-left: 1px solid ${p => p.theme.colors.danger.light};
    border-bottom: 1px solid ${p => p.theme.colors.danger.light};
    svg {
      fill: white;
    }
  }

`