import { Timer } from '@styled-icons/material/Timer'
import React from 'react'
import styled from 'styled-components'
import { useAppSelector } from '../../hooks/reduxHooks'

const DurationBadge = ({clipSlug, className, zIndex}: {clipSlug: string, zIndex?: number, className?: string}) => {
  
  let duration = useAppSelector(s => s.clips.clips[clipSlug].duration)
  
  return (
    <div className={className}>
      <span>{duration}s</span><Timer viewBox={'0 0 24 24'}/>
    </div>
  )
}

export default styled(DurationBadge)`
  
  display: flex;
  flex-direction: row;
  width: fit-content;

  margin: 4px 4px 4px auto;
  padding: 0px 4px;

  
  // align-self: flex-end;
  font-size: 16px;
  line-height: 21px;
  color: ${p => p.theme.colors.gray.light};
  border-radius: 4px;
  
  background-color: ${p => p.theme.colors.primary.dark};

  span {
    margin-left: 2px;
    margin-top: auto;
    margin-bottom: auto;
    font-weight: bold;
    padding-bottom: 1px;
  }

  svg {
    margin-top: auto;
    margin-bottom: auto;
    margin-left: 2px;
    margin-right: 0px;
    height: 16px;
    line-weight: 2px;
  }

  
  ${p => p.zIndex && `
    z-index: ${p.zIndex};
  `}

`