import React from 'react'
import styled from 'styled-components';
import { useAppSelector } from '../../../hooks/reduxHooks';

export const ClipThumb = styled(({clipSlug, thumbSize = "small", className}: { clipSlug: string, thumbSize?: "small" | "medium" | "tiny", className?: string}) => {
  let { [thumbSize]: thumbUrl } = useAppSelector(s => s.clips.clips[clipSlug].thumbnails)
  return (
    <img className={className} src={thumbUrl} alt={"thumbnail for clip " + clipSlug}/>
  )
})`
  height: 147px;
  width: 260px;
`

export default styled(ClipThumb)`

`