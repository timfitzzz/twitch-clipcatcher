import React from 'react'
import styled from 'styled-components'
import { ExpandMore } from '@styled-icons/material/ExpandMore'
import { ExpandLess } from '@styled-icons/material/ExpandLess'
import { abbreviateNumber } from 'js-abbreviation-number'

export const ExpandButtonBadge = ({expandToggle, expanded, clipsCount, className}: {expandToggle: () => void, expanded: boolean, clipsCount: number, className?: string}) => {

  return (
    <div className={className} onClick={clipsCount === 1 ? () => {} : expandToggle}>
      <span>{clipsCount === 1 ? '' : abbreviateNumber(clipsCount)}</span>
      { clipsCount === 1 ? (
        <></>
        ) : expanded ? (
        <ExpandLess />
      ) : (
        <ExpandMore />
      )}
    </div>
  )
}

export default styled(ExpandButtonBadge)`
  display: flex;
  flex-direction: row;

  margin: 4px 4px 4px auto;
  padding: 0px 4px;
  
  font-size: 16px;
  line-height: 17.8px;
  color: ${p => p.clipsCount > 1 
            ? p.theme.colors.success.dark
            : p.theme.colors.gray.light
  };
  
  border-radius: 4px;

  background-color: ${p => p.clipsCount > 1 
    ? p.theme.colors.gray.dark
    : p.theme.colors.quartenary.main
  };
  width: fit-content;
  font-weight: bold;

  svg {
    margin-top: auto;
    margin-bottom: auto;
    margin-left: 4px;
    height: 16px;
  }

  span {
    margin-left: 2px;
    padding-bottom: 1px;
    height: 17.8px;
  }

  ${p => p.clipsCount > 1
    && 'cursor: pointer;'}

`