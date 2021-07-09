import React from 'react';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import styled from 'styled-components';
import { OptionsPanelContainer, OptionsPanelRow, OptionsPanelSection } from '.'
import CollectionControls from './CollectionControls';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { channelCleared } from '../../../redux/channels';

import SortSetter from './SortSetter';
import StatsPanel from './StatsPanel';
import CloseChannelButton from './CloseChannelButton';

const Options = ({
  channelName,
  className
}: {
  channelName: string
  className?: string
}) => {

  const dispatch = useAppDispatch()
  const resetChannel = () => {
    dispatch(channelCleared(channelName))
  }

  return (
    <OptionsPanelContainer className={className}>
      <DndProvider backend={HTML5Backend}>
        <OptionsPanelRow>
          <OptionsPanelSection>
            <CollectionControls channelName={channelName} resetChannel={resetChannel}/>
          </OptionsPanelSection>
          <OptionsPanelSection>
            <StatsPanel channelName={channelName}/>
          </OptionsPanelSection>
          <CloseChannelButton channelName={channelName}/>
        </OptionsPanelRow>
        <OptionsPanelRow>
          <OptionsPanelSection>
            <SortSetter channelName={channelName}/>
          </OptionsPanelSection>
        </OptionsPanelRow>
      </DndProvider>
    </OptionsPanelContainer>
  )
};


export const OptionsPanel = styled(Options)`

  background-color: ${p => p.theme.colors.primary.semilight};

`

export default OptionsPanel