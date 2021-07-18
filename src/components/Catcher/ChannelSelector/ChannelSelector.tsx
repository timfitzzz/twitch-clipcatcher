import React from 'react';
import { Add } from '@styled-icons/material/Add'
import styled from 'styled-components';
import { Flex } from 'rendition';

import ChannelButton from './Tab';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { channelChanged } from '../../../redux/settings';

const AddIcon = styled(Add)`
  width: 18px;
  height: 20px;
  fill: ${p => p.theme.colors.gray.dark};
  margin-top: auto;
  margin-bottom: auto;
  padding-top: 0px;
  padding-bottom: 0px;
  &:hover {
    fill: green
  }
`

const ChannelButtonContainer = styled(Flex).attrs(p => ({
  ...p,
  flexDirection: "row",
  alignContent: "flex-start",

}))`
  width: 100%;
  flex-wrap: wrap-reverse;
  height: fit-content;
`

const ChannelButtonsContainer = styled(Flex).attrs(p => ({
  ...p,
  flexDirection: "row"
}))`

  width: 100%;
  background-color: ${p => p.theme.colors.gray.semilight};

  padding-top: 0px;
  padding-bottom: 3px;

  &:first-of-type {
    > div {
      margin-left: 0px;
    }
  }

`
const ChannelButtons = styled(Flex).attrs(p => ({
  ...p,
  flexDirection: 'row'
}))`
  width: 100%;
  flex-wrap: wrap;
`;

export const ReusableChannelSelector = ({
  channelNames,
  className
}: {
  channelNames: string[];
  className?: string;
}) => {

  const currentChannel = useAppSelector(state => state.settings.currentChannel)
  const dispatch = useAppDispatch()

  const changeChannel = (channelName: string | -1) => {
    dispatch(channelChanged({newChannel: channelName}))
  }


  return (
    <ChannelButtons className={className}>
      <ChannelButtonsContainer>
        <ChannelButton
          onClick={() => changeChannel(-1)}
          icon={AddIcon}
          current={currentChannel === -1}
          key={'addPanelChannelButton'}
        />
        <ChannelButtonContainer>
          {channelNames.map((channelName) => (
            <ChannelButton
              onClick={() => { changeChannel(channelName) }}
              title={channelName}
              current={currentChannel === channelName}
              key={channelName+'tab'}
            />
          ))}
        </ChannelButtonContainer>
      </ChannelButtonsContainer>
    </ChannelButtons>
  );
};

const ChannelSelector = styled(ReusableChannelSelector)`
  width: 100%;
`

export default ChannelSelector