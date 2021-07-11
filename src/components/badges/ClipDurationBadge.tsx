import { Timer } from '@styled-icons/material/Timer'
import React from 'react'
import styled from 'styled-components'
import { useAppSelector } from '../../hooks/reduxHooks'

const DurationBadge = ({clipSlug, className}: {clipSlug: string, className?: string}) => {
  
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
  margin: 4px 4px 4px auto;
  padding: 0px 4px;
  width: fit-content;
  align-self: flex-end;

  line-height: 14px;
  color: ${p => p.theme.colors.secondary.dark};
  border-radius: 4px;
  height: 18px;
  background-color: ${p => p.theme.colors.primary.light};

  span {
    margin-top: auto;
    margin-bottom: auto;
    font-weight: bold;
    padding-bottom: 1px;
  }

  svg {
    margin-top: auto;
    margin-bottom: 1.5px;
    margin-left: 2px;
    margin-right: 0px;
    height: 14px;
    line-weight: 2px;
  }



`