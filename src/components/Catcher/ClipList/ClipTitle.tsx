import React from 'react'
import styled from 'styled-components'
import { useAppSelector } from '../../../hooks/reduxHooks'
import { selectClipTitle } from '../../../redux/selectors'

export const ClipTitle = ({clipSlug, className}: { clipSlug: string, className?: string}) => {

  let title = useAppSelector(state => selectClipTitle(state.clips.clips[clipSlug]))

  return (
    <div className={className}>
      <span>{title}</span>
    </div>
  )
}

export default styled(ClipTitle)`
  margin-bottom: 4px;
  margin-top: auto;
  line-height: 16px;
  padding-left: 8px;
  padding-right: 8px;
  padding-bottom: 4px;

  span {
    margin-top: auto;
    margin-bottom: auto;
    text-align: left;
    overflow-wrap: anywhere;
    font-size: 15px;
    color: white;
    font-weight: bold;
    text-shadow: -1.5px 1.5px 1.5px black;
  }
`