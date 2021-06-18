import React from 'react'
import styled from 'styled-components'
import { Button, Flex } from 'rendition'

export * from './OptionsPanel'

export const OptionsPanelContainer = styled(Flex).attrs(p => ({
  ...p,
  flexDirection: 'column'
}))`
  padding: 0px 4px;
`

export const OptionsPanelRow = styled(Flex).attrs(p => ({
  ...p,
  flexDirection: 'row'
}))`
  padding-top: 2px;
`

export const OptionsPanelSection = styled(Flex)`
  padding-top: 2px;
  margin-top: auto;
  margin-bottom: auto;
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