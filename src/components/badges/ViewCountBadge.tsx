import React from 'react'
import styled from 'styled-components'
import { Visibility } from '@styled-icons/material/Visibility'
import { useAppSelector } from '../../hooks/reduxHooks'
import { abbreviateNumber } from 'js-abbreviation-number'

export const ViewCountBadge = ({clipSlugs, className, zIndex}: {clipSlugs: string[], zIndex?: number, className?: string}) => {
  let views = useAppSelector(s => clipSlugs.reduce(
      (viewCount, clipSlug) => viewCount + s.clips.clips[clipSlug].views
    , 0))

  return (
    <div className={className}>
      <span>{abbreviateNumber(views)}</span><Visibility/>
    </div>
  )
}

export default styled(ViewCountBadge)`
  display: flex;
  flex-direction: row;
  width: fit-content;

  margin: 4px 4px 4px auto;
  padding: 0px 4px;
  
  font-size: 16px;
  line-height: 21px;
  color: ${p => p.theme.colors.success.light};
  border-radius: 4px;

  background-color: ${p => p.theme.colors.success.dark};

  span {
    margin-left: 2px;
    padding-bottom: 1px;
  }

  svg {
    margin-top: auto;
    margin-bottom: auto;
    margin-left: 4px;
    height: 16px;
  }

  ${p => p.zIndex && `
    z-index: ${p.zIndex};
  `}

`