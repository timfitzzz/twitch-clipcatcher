import React from 'react'
import styled from 'styled-components'
import { MessageSquare } from '@styled-icons/feather/MessageSquare'
import Count from '../../../badges/MessageCount';

export const CountOfMessages = styled(({channelName, className}: {channelName: string, className?: string}) => (
  <div className={className}>
    <span>
      <Count channelName={channelName}/>
    </span>
    <MessageSquare/>
  </div>
))`


  padding-left: 8px;
  font-size: 20px;
  line-height: 20px;
  display: flex;
  flex-direction: row;
  margin-top: auto;
  margin-bottom: auto;

  span {
    margin-left: auto;
    margin-right: 0px;
    margin-bottom: auto;
    position: relative;
    display: flex-item;
    color: ${p => p.theme.colors.gray.dark};
  }

  svg {
    color: ${p => p.theme.colors.gray.dark};
    height: 18px;
    width: 18px;
    margin-top: auto;
    margin-bottom: auto;
  }

`

export default CountOfMessages