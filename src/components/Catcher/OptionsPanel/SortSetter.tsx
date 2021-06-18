import React from 'react'
import styled from 'styled-components'
import { ButtonGroup, Button } from 'rendition'
import { SortTypes } from '../../../types'
import { Frog } from '@styled-icons/fa-solid'
import { FlatterButton } from '.'
import { Timer, SortByAlpha, Visibility, AccessTimeFilled } from '@styled-icons/material'


const DurationIcon = styled(Timer)`
  // margin-top: auto;
  // margin-bottom: 1px;
  // margin-right: 4px;
  // height: 14px;
`

const FrogIcon = styled(Frog)`
  // fill: ${p => p.theme.colors.success.dark};
  // path {
  //   fill:${p => p.theme.colors.success.dark};
  // }
`

export const SortSetter = ({currentSort, setSort}: {
  currentSort: [type: SortTypes, direction: "asc" | "desc"]
  setSort: (sort: SortTypes, direction: "asc" | "desc") => void
}) => {

  return (
    <ButtonGroup>
      <FlatterButton icon={<FrogIcon/>}></FlatterButton>
      <FlatterButton icon={<Visibility/>}></FlatterButton>
      <FlatterButton icon={<DurationIcon/>}></FlatterButton>
      <FlatterButton icon={<SortByAlpha/>}></FlatterButton>
      <FlatterButton icon={<AccessTimeFilled/>}></FlatterButton>
    </ButtonGroup>
  )


}

export default SortSetter