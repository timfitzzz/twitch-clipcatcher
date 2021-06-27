import { Frog } from '@styled-icons/fa-solid/Frog'
import React from 'react'
import { Flex } from 'rendition'
import styled from 'styled-components'

const VoteCountBadge = styled(Flex)`
  padding-left: 4px;
  padding-right: 4px;
  margin-left: auto;
  margin-right: 4px;
  line-height: 14px;
  color: ${p => p.theme.colors.success.light};
  border-radius: 4px;
  height: 18px;

  margin-top: 4px;
  margin-bottom: 0px;
  background-color: ${p => p.theme.colors.success.dark};
  width: fit-content;
  font-weight: bold;
  font-size: 12px;
  box-sizing: content-box;


  #total {
    margin-top: auto;
    margin-bottom: auto;
    margin-right: 4px;
  }

  #subtotals {
    margin-top: auto;
    margin-bottom: auto;
    font-size: 10px;
    margin-left: 2px;
  }

  #upvotes {

  }

  #downvotes {

  }

  svg {
    margin-left: 2px;
    margin-top: auto;
    margin-bottom: auto;
    height: 12px;
    fill: ${p => p.theme.colors.success.light};
    path {
      fill:${p => p.theme.colors.success.light};
    }
  }
  

`

// <span id='subtotals'>({upvotes.length}/{downvotes.length})</span>

const VoteCount = ({className, upvotes, downvotes}: {className?: string, upvotes: string[], downvotes: string[]}) => (
    <VoteCountBadge flexDirection={"row"} className={className}>
      <span id='total'>{upvotes.length-downvotes.length}</span><Frog/>
    </VoteCountBadge>
)

export default VoteCount