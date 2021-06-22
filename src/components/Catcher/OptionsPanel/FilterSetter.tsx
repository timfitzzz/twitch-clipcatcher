import React from 'react'
import styled from 'styled-components'
import { useAppSelector } from '../../../hooks/reduxHooks'
import { OptionsPanelSectionTitle, FiltersRow } from '.'
import { FilterButton } from '../../badges/FilterButton'
import { ShieldVirus as MetaIcon } from '@styled-icons/fa-solid/ShieldVirus'
import { PooStorm as DramaIcon } from '@styled-icons/fa-solid/PooStorm'
import { Star as FavoritesIcon } from '@styled-icons/fa-solid/Star'
import { Today as TodayIcon } from '@styled-icons/material/Today'

const ReusableFiltersSetter = ({channelName, className}: {channelName: string, className?: string}) => {

  const clipsCount = useAppSelector(state => state.channels[channelName].clips.length)
  
  return (
    <div className={className}>
      <OptionsPanelSectionTitle isActive={true}>
        tags
      </OptionsPanelSectionTitle>
        <FiltersRow>
          <FilterButton Icon={MetaIcon}/>
          <FilterButton Icon={DramaIcon}/>
          {/* <FilterButton Icon={FavoritesIcon}/>
          <FilterButton Icon={TodayIcon}/> */}
        </FiltersRow>
    </div>
  )

}

const FiltersSetter = styled(ReusableFiltersSetter)`
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  padding-left: 4px;
`

export default FiltersSetter