import React from 'react'
import styled from 'styled-components'
import { BalanceScale } from '@styled-icons/fa-solid/BalanceScale'
import { BalanceScaleLeft } from '@styled-icons/fa-solid/BalanceScaleLeft'
import { BalanceScaleRight } from '@styled-icons/fa-solid/BalanceScaleRight'
import { OptionsPanelSectionTitle, FiltersRow } from '.'
import { FilterButton } from '../../badges/FilterButton'


const ModerationTitleIcon = styled(BalanceScale)`
  width: 14px;
  height: 14px;
`

const ReusableToggleSetter = ({channelName, className}: {channelName: string, className?: string}) => {

  // const clipsCount = useAppSelector(state => state.channels[channelName].clips.length)
  
  return (
    <div className={className}>
      <OptionsPanelSectionTitle isActive={true}>
        <ModerationTitleIcon/>
      </OptionsPanelSectionTitle>
        <FiltersRow>
          <FilterButton Icon={BalanceScaleLeft}/>
          <FilterButton Icon={BalanceScaleRight}/>
          {/* <FilterButton Icon={FavoritesIcon}/>
          <FilterButton Icon={TodayIcon}/> */}
        </FiltersRow>
    </div>
  )

}

const ModerationFilter = styled(ReusableToggleSetter)`
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  padding-left: 8px;
`

export default ModerationFilter