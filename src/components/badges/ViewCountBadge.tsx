import React from 'react'
import styled from 'styled-components'
import { Visibility } from '@styled-icons/material/Visibility'
import { useAppSelector } from '../../hooks/reduxHooks'
import { abbreviateNumber } from 'js-abbreviation-number'

export const ViewCountBadge = ({clipSlugs, className, hideIcon = true, zIndex}: {clipSlugs: string[], hideIcon?: boolean, zIndex?: number, className?: string}) => {
  let views = useAppSelector(s => clipSlugs.reduce(
      (viewCount, clipSlug) => viewCount + s.clips.clips[clipSlug].views
    , 0))

  return (
    <div className={className}>
      <span>{abbreviateNumber(views)}</span>{ !hideIcon && (<Visibility/>)}
    </div>
  )
}

export default styled(ViewCountBadge)`
  display: flex;
  flex-direction: row;
  width: fit-content;

  margin: 4px 4px 4px auto;
  padding: 0px 4px;
  
  color: white;
  border-radius: 4px;

  background-color: #3151FC; // #001584; // #0023DD; //${p => p.theme.colors.success.dark};

  span {
    margin-right: ${p => typeof p.hideIcon === 'boolean' && p.hideIcon === false ? '2px' : '0px'};
    font-size: 14px;
    font-weight: 700;
  }

  svg {
    margin-top: auto;
    margin-bottom: auto;
    margin-left: 2px;
    margin-right: 2px;
    height: 16px;
  }

  ${p => p.zIndex && `
    z-index: ${p.zIndex};
  `}

`