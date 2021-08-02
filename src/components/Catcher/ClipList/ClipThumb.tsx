import React from 'react'
import styled from 'styled-components';
import { useAppSelector } from '../../../hooks/reduxHooks';
import { selectClipThumbnails } from '../../../redux/selectors';

export const ClipThumb = styled(({clipSlug, thumbSize = "small", className}: { clipSlug: string, thumbSize?: "small" | "medium" | "tiny", className?: string}) => {
  let { [thumbSize]: thumbUrl } = useAppSelector(state => selectClipThumbnails(state.clips.clips[clipSlug]))
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