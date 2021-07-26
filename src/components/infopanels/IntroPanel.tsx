import React from 'react'
import TitleAndFeatures from './TitleAndFeatures'
import WhoDidThis from './WhoDidThis'
import styled from 'styled-components'

export const IntroPanelOuterContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow-y: auto;
`



export const IntroPanelContainer = styled.div`
  margin: 16px 16px;
  color: black;
  display: flex;
  flex-direction: column;
  justify-content: center;


`

export const IntroPanel = ({className}: { className?: string }) => {
  return (
    <IntroPanelOuterContainer className={className}>
      <IntroPanelContainer>
        <TitleAndFeatures/>
        <WhoDidThis/>
      </IntroPanelContainer>
    </IntroPanelOuterContainer>
  )
}

export default styled(IntroPanel)`

`