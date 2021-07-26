
/* eslint-disable react/jsx-pascal-case */
import React from 'react'
import styled from 'styled-components'
import { Heading } from 'rendition'
import { useAppDispatch } from '../../../hooks/reduxHooks'
import { channelRemoved } from '../../../redux/channels'

const ErrorCard = styled(({className, channelName}: { channelName: string, className?: string }) => {

  const dispatch = useAppDispatch()

  return (
    <div className={className}>
      <Heading.h4>
        Error
      </Heading.h4>
      <p>Joining channel {channelName} failed. Does it exist?</p>
      <p>Next steps:
      <ul>
      <li>Use Record button to retry</li>
      <li>Click below to close the channel</li>
      </ul>
      </p>
      <div onClick={() => dispatch(channelRemoved(channelName))}>Close channel</div>
    </div>
  )
})`

  padding: 16px;
  background-color: ${({theme}) => theme.colors.warning.light};
  margin: 16px;

  div {
    padding: 4px 8px;
    background-color: ${({theme}) => theme.colors.warning.main};
    border: 1px solid ${({theme}) => theme.colors.danger.main};
    width: fit-content;
    border-radius: 8px;
    cursor: pointer;
    &:hover {
      background-color: ${({theme}) => theme.colors.danger.main};
    }
  }

`

export default ErrorCard