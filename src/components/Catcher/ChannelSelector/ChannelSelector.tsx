import React, { useEffect, useMemo, useState } from 'react';
import { Close, Add } from '@styled-icons/material'
import { useContextSelector } from 'use-context-selector';
import styled from 'styled-components';
import { Box, Flex, Tabs } from 'rendition';

import Tab from './Tab';

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

const CloseIcon = styled(Close)`
  width: 18px;
  height: 18px;
  fill: ${p => p.theme.colors.gray.dark};

  &:hover {
    fill: red;
  }
`

const CloseTab = styled(Tab)`
  margin-right: 0px;
  margin-left: auto;
  padding: 4px 1px 1px 1px;
  margin-top: 8px;
  border: none;
`

const ChannelSelectorTabs = styled(Flex).attrs(p => ({
  ...p,
  flexDirection: 'row'
}))`
  width: 100%;
  flex-wrap: wrap;
`;

export const ReusableChannelSelector = ({
  className,
  channelNames,
  currentChannelName,
  setAddPanelVisible,
  addPanelSelected,
  handleChannelChange,
}: {
  setAddPanelVisible: (showPanel: boolean) => void;
  addPanelSelected: boolean;
  handleChannelChange: (channelName: string) => void;
  className?: string;
  channelNames: string[];
  currentChannelName: string | null;
}) => {


  // const switchToChannel = (idx: number) => {
  //   setCurrentChannel(idx);
  //   setAddPanelVisible(false)
  // };

  // const showAddPanel = () => {
  //   setAddPanelVisible(true)
  // }

  // const hideAddPanel = () => {
  //   setAddPanelVisible(false)
  // }

  // console.log('rendering channelselector');

  // useEffect(() => {
  //   if (currentChannel !== -1) {
  //     let allButCurrent: string[] = channelNames.splice(currentChannel, 1)
  //     allButCurrent.push(channelNames[currentChannel])
  //     setChannelNameOrder(allButCurrent)
  //   } else {
  //     setChannelNameOrder(channelNames)
  //   }
  // }, [currentChannel, channelNames])

  // useEffect(() => {
  //   setAddPanelVisible(false)
  // }, [channelNames])

  return (
    <ChannelSelectorTabs>
      <Flex flexDirection={'row'} width={'100%'}>
        <Flex flexDirection={'row-reverse'} justifyContent={"flex-end"} flexWrap={"wrap"}>
          {channelNames.map((channelName) => (
            <Tab
              onClick={() => { setAddPanelVisible(false); handleChannelChange(channelName) }}
              title={channelName}
              current={!addPanelSelected && channelName === currentChannelName}
              key={channelName+'tab'}
            />
          ))}
          <Tab
            onClick={() => setAddPanelVisible(true)}
            icon={AddIcon}
            current={addPanelSelected === true}
            key={'addPanelTab'}
          />
        </Flex>
        <CloseTab
            hidden={addPanelSelected === true}
            onClick={() => setAddPanelVisible(true)}
            icon={CloseIcon}
            current={true}
            key={'addPanelTab'}

          />
      </Flex>

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
