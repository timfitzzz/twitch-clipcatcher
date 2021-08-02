import { Card } from 'rendition'
import styled from 'styled-components'

export const ButtonCard = styled(Card).attrs(p => ({
  ...p,
  small: true
}))`
  > div {
    > div {
      display: flex;
      
    }

    
    display: flex;
  }
  background-color: ${p => p.theme.colors.quartenary.semilight};
  border-color: ${p => p.theme.colors.secondary.semilight};
  display: flex;
  flex-direction: column;
  margin-right: 4px;
  margin-left: auto;
  padding: 0px;
  border-radius: 4px;
  cursor: pointer;
  &:last-of-type {
    margin-left: 0px;
    margin-right: 8px;
  }

  &:hover {
    filter: linear-gradient(${p => p.theme.colors.gray.light}, ${p => p.theme.colors.gray.dark});
  }
`