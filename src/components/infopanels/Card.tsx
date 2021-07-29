import React, { ReactNode } from 'react'
import styled from 'styled-components'

export enum CardTypes {
  default,
  error,
  info
}

const CardInnerDiv = styled.div<{type: CardTypes}>`
  padding: 16px;
  background-color: ${({type, theme}) => {

    switch (type) {
      case CardTypes['default']:
        break;
      case CardTypes['error']:
        return `background-color: ${theme.colors.warning.light};`
      default:
        break;
    }
  }}

  margin: 16px;

  div {
    padding: 4px 8px;
    background-color: ${({theme}) => theme.colors.warning.main};
    border: 1px solid ${({theme}) => theme.colors.danger.main};
    width: fit-content;
    border-radius: 8px;
    cursor: pointer;
    &:hover {
      background-color: ${({theme}) => theme.colors.danger.main};
    }
  }
`


const Card = ({className, type = CardTypes['default'], children}: { className: string, type?: CardTypes, children: ReactNode | ReactNode[] }) => {

  return (<CardInnerDiv className={className} type={type}>
    {children}
  </CardInnerDiv>)

}

export default Card