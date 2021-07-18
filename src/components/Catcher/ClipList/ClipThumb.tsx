import React from 'react'
import styled from 'styled-components';
import { useAppSelector } from '../../../hooks/reduxHooks';

export const ClipThumb = styled(({clipSlug, thumbSize = "small", className}: { clipSlug: string, thumbSize?: "small" | "medium" | "tiny", className?: string}) => {
  let { [thumbSize]: thumbUrl } = useAppSelector(s => s.clips.clips[clipSlug].thumbnails)
  return (
    <div className={className} style={{ backgroundImage: `url("${thumbUrl}")`}}/>
  )
})`
  height: 142px;
  object-fit: cover;
  border-radius: 4px;
  min-width: 150px;
  background-position: center;
  flex-grow: 1;
  // width: 100%;
  display: flex;
`

export default ClipThumb