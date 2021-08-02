import { Stopwatch } from '@styled-icons/fa-solid/Stopwatch'
import React from 'react'
import styled from 'styled-components'
import { useAppSelector } from '../../hooks/reduxHooks'
import { selectStackDurationRange } from '../../redux/selectors'

const StackDurationBadge = ({clipSlugs, className, direction }: {clipSlugs: string[], direction: 'asc' | 'desc', zIndex?: number, className?: string}) => {
  
  let [min, max] = useAppSelector(state => selectStackDurationRange(clipSlugs.map(clipName => state.clips.clips[clipName])))
  
  return (
    <div className={className}>
      { direction === 'asc' ? (
        <span>{Math.round(min)}-{Math.round(max)}s</span>
      ) : (
        <span>{Math.round(max)}-{Math.round(min)}s</span>
      )}
      <Stopwatch />
    </div>
  )
}

export default styled(StackDurationBadge)`
  
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
    margin-right: 3px!important;
    height: 14px;
    line-weight: 2px;
  }

  
  ${p => p.zIndex && `
    z-index: ${p.zIndex};
  `}

`