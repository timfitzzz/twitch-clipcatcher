import React from 'react';
import { Add } from '@styled-icons/material/Add'
import styled from 'styled-components';
import { Flex } from 'rendition';

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
