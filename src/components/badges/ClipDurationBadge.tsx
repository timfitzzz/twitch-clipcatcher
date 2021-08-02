import { Stopwatch } from '@styled-icons/fa-solid/Stopwatch'
import React from 'react'
import styled from 'styled-components'
import { useAppSelector } from '../../hooks/reduxHooks'
import { selectDuration } from '../../redux/selectors'

const ClipDurationBadge = ({clipSlug, className, hideIcon = true, zIndex}: {clipSlug: string, zIndex?: number, hideIcon?: boolean, className?: string}) => {
  
  let duration = useAppSelector(state => selectDuration(state.clips.clips[clipSlug]))
  
  return (
    <div className={className}>
      <span>{Math.round(duration)}s</span>{!hideIcon && (<Stopwatch />)}
    </div>
  )
}

export default styled(ClipDurationBadge)`
  
  display: flex;
  flex-direction: row;
  width: fit-content;

  margin: 4px 4px 4px auto;
  padding: 0px 4px;
  cursor: default;

  
  // align-self: flex-end;
  font-size: 16px;
  line-height: 21px;
  color: white;
  border-radius: 4px;
  
  background-color: ${p => p.theme.colors.primary.dark};

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
    height: 14px;
    line-weight: 2px;
  }

  
  ${p => p.zIndex && `
    z-index: ${p.zIndex};
  `}

`