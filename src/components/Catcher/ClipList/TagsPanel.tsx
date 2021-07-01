import React from 'react'
import { useMemo } from 'react'
import { shallowEqual } from 'react-redux'
import styled from 'styled-components'
import { useAppSelector } from '../../../hooks/reduxHooks'
import { SectionTitle } from '../../typography/SectionTitle'


const Tag = styled.span.attrs(p => ({
  scale: 0.5,
  ...p,
}))<{scale: number}>`

  font-size: ${p => p.scale * 15}px;
  padding-right: 4px;

`

export const TagsPanel = ({channelName, clipSlugs}: { channelName: string, clipSlugs: string[] }) => {

  let tags = useAppSelector(state => clipSlugs.reduce((agg, clipSlug) => {
      if (state.clips.clips[clipSlug].taggedIn && state.clips.clips[clipSlug].taggedIn[channelName]) {
        agg.tags = agg.tags.concat(state.clips.clips[clipSlug].taggedIn[channelName].as.tags)
        state.clips.clips[clipSlug].taggedIn[channelName].as.tags.forEach(tag => {
          if (agg.byTag[tag]) {
            agg.byTag[tag].concat(state.clips.clips[clipSlug].taggedIn[channelName].as.byTag[tag])
          } else {
            agg.byTag[tag] = state.clips.clips[clipSlug].taggedIn[channelName].as.byTag[tag]
          }
        })
      }
      return agg
    },
    {
      tags: [],
      byTag: {}
    } as {
      tags: string[],
      byTag: { [tagName: string]: string[] }
    }), shallowEqual)  

  let leadingTagCount = useMemo(() => tags.tags.reduce((counter, tag) => tags.byTag[tag].length > counter ? tags.byTag[tag].length : counter, 0), [tags])


  return (
    <div>
      <SectionTitle>tags</SectionTitle>
      <p>{tags.tags.map(tag => <Tag scale={tags.byTag[tag].length / leadingTagCount}>{tag} </Tag>)}</p> 
    </div>
  )


}

export default TagsPanel