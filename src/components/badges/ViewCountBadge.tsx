import React from 'react'
import styled from 'styled-components'
import { Visibility } from '@styled-icons/material/Visibility'
import { useAppSelector } from '../../hooks/reduxHooks'
import { abbreviateNumber } from 'js-abbreviation-number'

export const ViewCountBadge = ({clipSlug, className}: {clipSlug: string, className?: string}) => {
  let views = useAppSelector(s => s.clips.clips[clipSlug].views)

  return (
    <div className={className}>
      <span>{abbreviateNumber(views)}</span><Visibility/>
    </div>
  )
}

export default styled(ViewCountBadge)`
  display: flex;
  flex-direction: row;

  margin: 4px 4px auto auto;
  padding: 0px 4px 2px 4px;
  
  line-height: 16px;
  color: ${p => p.theme.colors.success.dark};
  border-radius: 4px;
  height: 18px;

  background-color: ${p => p.theme.colors.success.light};
  width: fit-content;
  font-weight: bold;

  svg {
    padding-top: 2px;
    margin-top: auto;
    margin-bottom: auto;
    margin-left: 4px;
    height: 14px;
  }

  span {
    padding-top: 0.5px;
    margin-top: auto;
    margin-bottom: auto;
  }

`