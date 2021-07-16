import React from 'react'
import { Card, Heading } from 'rendition'
import styled from 'styled-components'

export const NoClips = ({className}: {className?: string}) => (
  <Card className={className}>
    <Heading>Waiting for clips...</Heading>
  </Card>
)

export default styled(NoClips)`
  margin-left: auto;
  margin-right: auto;
  display: flex;
  height: 100px;
  align-content: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  background-color: ${({theme}) => theme.colors.quartenary.semilight};

  h3 {
    text-align: center;
  }
`