import React from 'react';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import styled from 'styled-components';
import { OptionsPanelContainer, OptionsPanelRow, OptionsPanelSection } from '.'

import SortSetter from './SortSetter';

const Options = ({
  channelName,
  className
}: {
  channelName: string
  className?: string
}) => {

  return (
    <OptionsPanelContainer className={className}>
      <DndProvider backend={HTML5Backend}>
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