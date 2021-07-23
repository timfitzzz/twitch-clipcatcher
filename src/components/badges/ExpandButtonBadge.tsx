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
  margin: 4px 4px 4px auto;
  background-color: ${p => p.clipsCount > 1 
    ? p.theme.colors.quartenary.main
    : p.theme.colors.gray.dark
  };
  padding: 0px 4px;
  border-radius: 4px;
  box-sizing: border-box;
  line-height: 21px;

  svg {
    margin-top: auto;
    margin-bottom: auto;
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
    height: 14px;
  }
  
  span {
    margin-top: -2px;
    margin-left: 2px;
    height: 21px;
    font-size: 16px;
  }


  border: 2px solid ${p => p.theme.colors.gray.dark};



  color: ${p => p.clipsCount > 1 
            ? p.theme.colors.success.dark
            : p.theme.colors.gray.light
  }; 
  



  width: fit-content;
  font-weight: bold;




  ${p => p.clipsCount > 1
    ? `

    cursor: pointer;
    ` : `

    `}

`