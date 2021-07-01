// import React from 'react'
import styled from 'styled-components'
import { Button, Flex } from 'rendition'
import { SectionTitle } from '../../typography/SectionTitle'
// import { StyledIcon } from '@styled-icons/styled-icon'

export * from './OptionsPanel'

export const OptionsPanelContainer = styled(Flex).attrs(p => ({
  ...p,
  flexDirection: 'column'
}))`
  padding: 0px 4px 4px 0px;
`

export const OptionsPanelRow = styled(Flex).attrs(p => ({
  ...p,
  flexDirection: 'row'
}))`
  padding-top: 0px;
  position: relative;
`

export const OptionsPanelSection = styled(Flex)`
  margin-top: auto;
  margin-bottom: auto;
  margin: 2px;
  border-radius: 5px;
  padding: 4px;
  flex-direction: row;
  justify-content: center;
`

export const OptionsPanelSectionTitle = styled(SectionTitle)<{isActive: boolean}>`
  color: ${p => p.isActive ? p.theme.colors.secondary.dark : 'white'};
`

export const FlatterButton = styled(Button)`

  padding-top: 0px;
  padding-bottom: 0px;
  padding-right: 0px;
  padding-left: 0px;
  height: 24px;
  width: 36px;
  > svg {
    padding-top: 0px;
    padding-bottom: 0px;
    margin-top: auto;
    padding-left: 0px;
    padding-right: 0px;
    margin-bottom: auto;
    margin-right: 0px;
    margin-left: 0px;
    height: 14px;
  }

`

export const FiltersRow = styled.div`
  margin-left: 8px;
  height: 30px;
  display: flex;


  &:first-of-type {
  }
`