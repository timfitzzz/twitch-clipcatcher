import React from 'react';
import styled from 'styled-components';
import { Button, Flex } from 'rendition';
import ScannerWithCount from '../../badges/ScannerWithCount';
import { Filters, SortTypes } from '../../../types';
import { OptionsPanelContainer, OptionsPanelRow, OptionsPanelSection } from '.'
import CollectionControls from './CollectionControls';
import Count from '../../badges/MessageCount';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { channelCleared } from '../../../redux/channels';
import { DeleteForever } from '@styled-icons/material';
import ClipsCount from '../../badges/ClipsCount';
import SortSetter from './SortSetter';


const OptionsPanelTitle = styled.h4`
  margin-top: 2px;
  margin-bottom: 2px;
  font-size: 18px;
  flex-grow: 0;
`

const ClearIcon = styled(DeleteForever)`
  height: 21px;
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 0px;
  fill: orange;
  width: 21px;

  &:hover {
    fill: red;
  }
`

const Options = ({
  channelName,
  clipCount,
  scanning,
  currentSort,
  setSort,
  filters,
  setFilter,
}: {
  channelName: string;
  clipCount: number;
  currentSort: [type: SortTypes, direction: "asc" | "desc"];
  scanning: boolean;
  setSort: (sort: SortTypes, direction: "asc" | "desc") => void;
  setFilter: (filterName: keyof Filters) => void;
  filters: Filters;
}) => {

  const dispatch = useAppDispatch()
  const resetChannel = () => {
    dispatch(channelCleared(channelName))
  }


  return (
    <OptionsPanelContainer>
      <OptionsPanelRow>
        <OptionsPanelSection>
          <CollectionControls channelName={channelName}/>
          <OptionsPanelTitle>{channelName}</OptionsPanelTitle>
        </OptionsPanelSection>
        <OptionsPanelSection>
        </OptionsPanelSection>
        <OptionsPanelSection style={{marginRight: '0px', marginLeft: 'auto'}}>
          <ClipsCount value={clipCount} inverted={true} />/
          <Count channelName={channelName}/>
          <ClearIcon onClick={() => resetChannel()}/>
        </OptionsPanelSection>
      </OptionsPanelRow>
      <OptionsPanelRow>
        <OptionsPanelSection>
          <SortSetter currentSort={currentSort} setSort={setSort}/>
        </OptionsPanelSection>
        <OptionsPanelSection>
          <span>filters</span>
        </OptionsPanelSection>
      </OptionsPanelRow>
    </OptionsPanelContainer>
  )
};


export const OptionsPanel = styled(Options)`

`

export default OptionsPanel