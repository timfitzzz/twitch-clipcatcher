import React from 'react';
import { Add } from '@styled-icons/material/Add'
import styled from 'styled-components';
import { Flex } from 'rendition';

import Tab from './Tab';
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

const ChannelSelectorTabContainer = styled(Flex).attrs(p => ({
  ...p,
  flexDirection: "row-reverse",
  justifyContent: "flex-end",
  flexWrap: "wrap"
}))`




`
const ChannelSelectorTabsContainer = styled(Flex).attrs(p => ({
  ...p,
  flexDirection: "row"
}))`

  width: 100%;
  background-color: ${p => p.theme.colors.quartenary.semilight};

  padding-top: 8px;

`
const ChannelSelectorTabs = styled(Flex).attrs(p => ({
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
    <ChannelSelectorTabs>
      <ChannelSelectorTabsContainer>
        <ChannelSelectorTabContainer>
          {channelNames.map((channelName) => (
            <Tab
              onClick={() => { changeChannel(channelName) }}
              title={channelName}
              current={channelName === currentChannel}
              key={channelName+'tab'}
            />
          ))}
          <Tab
            onClick={() => changeChannel(-1)}
            icon={AddIcon}
            current={currentChannel === -1}
            key={'addPanelTab'}
          />
        </ChannelSelectorTabContainer>
      </ChannelSelectorTabsContainer>

    </ChannelSelectorTabs>
  );
};

const ChannelSelector = styled(ReusableChannelSelector)`
  width: 100%;
  height: 100%;
`

export default ChannelSelector

// <Tab title={"+"}>
//   <AddChannelForm />
// </Tab>
