import React from 'react'
import { useState } from 'react'
import { useMemo } from 'react'
import { shallowEqual } from 'react-redux'
import styled from 'styled-components'
import { useAppSelector } from '../../../hooks/reduxHooks'
import useUpdateLock from '../../../hooks/useUpdateLock'
import { SectionTitle } from '../../typography/SectionTitle'


const Tag = styled.div.attrs(p => ({
  scale: 0.5,
  ...p,
}))<{scale: number, taggers: string[]}>`
  padding: 0px 2px 0px 0px;
  margin: 0px;
  display: inline-block;
  line-height: ${p => p.scale ? Math.max(p.scale * 18, 10) : 14}px;
  font-size: ${p => p.scale ? Math.max(p.scale * 18, 10) : 14}px;

`

export const TagsPanel = ({channelName, clipSlugs, className}: { channelName: string, clipSlugs: string[], className?: string }) => {

  let [tagsExpanded, setTagsExpanded] = useState<boolean>(false)

  let tags = useAppSelector(state => clipSlugs.reduce((agg: { tags: string[], byTag: { [tagName: string]: string[] }}, clipSlug) => {
      if (state.clips.clips[clipSlug].taggedIn && state.clips.clips[clipSlug].taggedIn![channelName]) {
        agg.tags = agg.tags.concat(state.clips.clips[clipSlug].taggedIn![channelName].as.tags)
        state.clips.clips[clipSlug].taggedIn![channelName].as.tags.forEach(tag => {
          if (agg.byTag[tag]) {
            agg.byTag[tag].concat(state.clips.clips[clipSlug].taggedIn![channelName].as.byTag[tag])
          } else {
            agg.byTag[tag] = state.clips.clips[clipSlug].taggedIn![channelName].as.byTag[tag]
          }
        })
      }
      agg.tags.sort((a, b) => agg.byTag[b].length - agg.byTag[a].length)
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
  let tagElements = useMemo(() => tags.tags.map(tag => <Tag key={tag+channelName+clipSlugs[0]} taggers={tags.byTag[tag]} scale={leadingTagCount > 1 ? tags.byTag[tag].length / leadingTagCount : undefined}>{tag} </Tag>), [channelName, clipSlugs, tags, leadingTagCount])

  let displayTagElements = useUpdateLock(tagElements, channelName)

  return (
    <div className={className}>
      <SectionTitle>tags</SectionTitle>
      <div>
        { tagsExpanded ? (
          <>{displayTagElements}</>
        ) : (
          <>
            {displayTagElements.slice(0, 10)}
            { displayTagElements.length > 10 ? (
              <div style={{fontSize: 12}} onClick={(e) => setTagsExpanded(true)}>...({displayTagElements.length - 10})</div>
            ):(<></>)}
          </>
        )}
      </div>
    </div>
  )


}

export default styled(TagsPanel)`

  max-width: 100px;

  h5 {
    margin-top: 4px;
    margin-bottom: 4px;
  }

  > div {
    margin-top: 4px;
    margin-bottom: 4px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    > div {
      padding-top: 0px;
      padding-bottom: 0px;
      margin-top: 1px;
      margin-bottom: 1px;
    }

  }

`