import React from 'react';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import styled from 'styled-components';
import { Filters, SortList, SortTypes } from '../../../types';
import { OptionsPanelContainer, OptionsPanelRow, OptionsPanelSection } from '.'
import CollectionControls from './CollectionControls';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { channelCleared } from '../../../redux/channels';

import SortSetter from './SortSetter';
import StatsPanel from './StatsPanel';
import CloseChannelButton from './CloseChannelButton';
import FilterSetter from './FilterSetter';
import ModerationFilter from './ModerationFilter';


// const OptionsPanelTitle = styled.h4`
//   margin-top: 2px;
//   margin-bottom: 2px;
//   font-size: 18px;
//   flex-grow: 0;
// `

const Options = ({
  locked,
  toggleDisplayLock,
  channelName,
  // clipCount,
  // scanning,
  // filters,
  // setFilter,
  className
}: {
  locked: boolean
  toggleDisplayLock: () => void
  className?: string
  channelName: string
  // clipCount: number
  // scanning: boolean
  // setFilter: (filterName: keyof Filters) => void
  // filters: Filters
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
            <CollectionControls channelName={channelName} locked={locked} toggleDisplayLock={toggleDisplayLock} resetChannel={resetChannel}/>
            {/* <OptionsPanelTitle>{channelName}</OptionsPanelTitle> */}
          </OptionsPanelSection>
          <OptionsPanelSection>
            <StatsPanel channelName={channelName}/>
          </OptionsPanelSection>
          <CloseChannelButton channelName={channelName}/>
        </OptionsPanelRow>
        <OptionsPanelRow>
          <OptionsPanelSection>
            <FilterSetter channelName={channelName}/>
          </OptionsPanelSection>
          <OptionsPanelSection>
            <ModerationFilter channelName={channelName} />
          </OptionsPanelSection>
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