import React from 'react'
import styled from 'styled-components'
import { useAppSelector } from '../../../hooks/reduxHooks'

export const ClipTitle = ({clipSlug, className}: { clipSlug: string, className?: string}) => {

  let title = useAppSelector(s => s.clips.clips[clipSlug].title)

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
  padding-left: 4px;

  span {
    margin-top: auto;
    margin-bottom: auto;
    text-align: left;
    overflow-wrap: anywhere;
    font-size: 17px;
    color: white;
    font-weight: bold;
    text-shadow: -1px 1px 1px black;
  }
`