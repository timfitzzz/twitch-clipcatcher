import { Twitch } from '@styled-icons/feather'
import React from 'react'
import { Flex } from 'rendition'
import styled from 'styled-components'

const SourceStreamBadge = styled(Flex)<{charCount: number}>`
  padding-left: 4px;
  padding-right: 4px;
  margin-left: 4px;
  margin-right: 4px;
  line-height: 24px;
  background-color: rgb(100,65,164);
  color: white;
  border-radius: 8px;
  font-size: 22px;
  padding-top: 2px;
  padding-bottom: 2px;
  width: fit-content;
  margin-top: 4px;
  margin-bottom: auto;


  span {
    svg {
      margin-top: auto;
      margin-bottom: auto;
      margin-right: 4px;
      height: 22px;
    }

  }

  ${p => {
    if (p.charCount > 15) {
      if (p.charCount <= 20) {
        return `
          font-size: 17px;
        `
      } else {
        return `
          font-size: 15px;
        `
      }

    }
  }}
  

`

const SourceStream = ({className, value}: {className?: string, value: string | number}) => (
    <SourceStreamBadge flexDirection={"row"} className={className} charCount={value.toString().length}>
      <span><Twitch viewBox={'0 0 24 24'}/>{value.toString()}</span>
    </SourceStreamBadge>
)

export default styled(SourceStream)`



`