import React from 'react'
import { Card, Heading } from 'rendition'
import styled from 'styled-components'

export const NoClips = ({className}: {className?: string}) => (
  <Card className={className}>
    <Heading>Waiting for clips...</Heading>
  </Card>
)

export default styled(NoClips)`
  margin: 8px;
  display: flex;
  height: 100px;
  align-content: center;
  justify-content: center;
  flex-direction: column;
  background-color: ${({theme}) => theme.colors.quartenary.semilight};

`