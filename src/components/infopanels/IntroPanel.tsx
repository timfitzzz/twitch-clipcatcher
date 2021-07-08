import React from 'react'
import TitleAndFeatures from './TitleAndFeatures'
import WhoDidThis from './WhoDidThis'
import styled from 'styled-components'

export const IntroPanelOuterContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`

export const IntroPanelContainer = styled.div`
  margin: 32px 32px;
  color: black;

  > div {
    background-color: ${({theme}) => theme.colors.primary.semilight};
    border-left: 5px solid ${({theme}) => theme.colors.primary.light};
    border-top: 5px solid ${({theme}) => theme.colors.primary.light};
  }
`

export const IntroPanel = ({className}: { className?: string }) => {
  return (
    <IntroPanelOuterContainer>
      <IntroPanelContainer>
        <TitleAndFeatures/>
        <WhoDidThis/>
      </IntroPanelContainer>
    </IntroPanelOuterContainer>
  )
}

export default styled(IntroPanel)`

`