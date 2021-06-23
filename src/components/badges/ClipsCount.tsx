// import React from 'react'
import { Badge, Flex } from 'rendition'
import styled from 'styled-components'

const ClipsCountBadge = styled(Badge)<{inverted?: boolean}>`
padding-left: 4px;
padding-right: 4px;
margin-left: 4px;
margin-right: 4px;
margin-top: auto;
margin-bottom: auto;
line-height: 14px;
padding-top: 1px;
padding-bottom: 1px;

${p => p.inverted && `
  color: ${p.theme.colors.primary.dark};
  background-color: white;
  font-size: 17px;
  line-height: 13px;
  padding-right: 2px;
  padding-top: 0px;
  padding-bottom: 0px;
`}

`

const ClipsCount = ({className, value, inverted}: {className?: string, inverted?: boolean, value: string | number}) => (
  <Flex flexDirection={'row'} className={className}>
    <ClipsCountBadge inverted={inverted}>{value.toString()}</ClipsCountBadge>
  </Flex>
)

export default styled(ClipsCount)`


`