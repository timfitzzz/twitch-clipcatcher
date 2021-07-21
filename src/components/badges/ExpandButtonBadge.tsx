import React from 'react'
import styled from 'styled-components'
import { ExpandMore } from '@styled-icons/material/ExpandMore'
import { ExpandLess } from '@styled-icons/material/ExpandLess'
import { OndemandVideo } from '@styled-icons/material/OndemandVideo'
import { abbreviateNumber } from 'js-abbreviation-number'

export const ExpandButtonBadge = ({expandToggle, expanded, clipsCount, className}: {expandToggle: () => void, expanded: boolean, clipsCount: number, className?: string}) => {

  return (
    <div className={className} onClick={clipsCount === 1 ? () => {} : expandToggle}>
      { clipsCount === 1 ? (
        <></>
        ) : expanded ? (
        <ExpandLess className={'expand'} />
      ) : (
        <ExpandMore className={'expand'}/>
      )}
      <span>{abbreviateNumber(clipsCount)}</span>
      <OndemandVideo className={'clipsIcon'}/>
    </div>
  )
}

export default styled(ExpandButtonBadge)`
  display: flex;
  flex-direction: row;

  
  box-sizing: border-box;
  border: 2px solid ${p => p.theme.colors.gray.dark};
  padding: 0px 2px !important;
  font-size: 16px;
  line-height: 17.8px;
  color: ${p => p.clipsCount > 1 
            ? p.theme.colors.success.dark
            : p.theme.colors.gray.light
  }; 
  
  border-radius: 4px;

  background-color: ${p => p.clipsCount > 1 
    ? p.theme.colors.quartenary.main
    : p.theme.colors.gray.dark
  };
  width: fit-content;
  font-weight: bold;

  svg {
    margin-top: auto;
    margin-bottom: auto;
    height: 13px;
   

  }

  .expand {
    margin-left: 0px;
    margin-right: auto!important;
    height: 18px;
  }

  .clipsIcon {
    margin-top: 2px;
    margin-bottom: auto;
    margin-left: 4px;
    margin-right: 2px!important;
  }

  span {
    margin-left: 2px;
    padding-bottom: 1px;
    height: 17.8px;
  }

  ${p => p.clipsCount > 1
    ? `

    cursor: pointer;
    ` : `

    `}

`