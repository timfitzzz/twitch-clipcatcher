import React, { useState, useMemo, useRef } from 'react'
import { shallowEqual } from 'react-redux'
import styled from 'styled-components'
import { useAppSelector } from '../../../hooks/reduxHooks'
import useUpdateLock from '../../../hooks/useUpdateLock'
import { SectionTitle } from '../../typography/SectionTitle'
import { Tag as TagIcon } from '@styled-icons/feather/Tag'
import debounce from 'lodash/debounce'
import { Popover } from 'rendition'


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

const PopoverContentsContainer = styled.div`
  padding: 8px;
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
    font-weight: normal;

    > div {
      padding-top: 0px;
      padding-bottom: 0px;
      margin-top: 1px;
      margin-bottom: 1px;
    }

  }
`

export const TagsBadge = ({channelName, clipSlugs, className}: { channelName: string, clipSlugs: string[], className?: string }) => {

  let [tagsExpanded, setTagsExpanded] = useState<boolean>(false)

  let tags = useAppSelector(state => clipSlugs.reduce((agg: { tags: string[], byTag: { [tagName: string]: string[] }}, clipSlug) => {
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


  // set up popover
  let popoverTarget = useRef<HTMLDivElement>(null)
  let [showPopover, setShowPopover] = React.useState<any>(false)

  const handlePopover = debounce(() => setShowPopover(true), 500)

  const handleMouseExit = () => {
    handlePopover.cancel()
    setShowPopover(false)
  }

  return (
    <div className={className} ref={popoverTarget} onMouseLeave={handleMouseExit} onMouseOver={handlePopover}>
      { showPopover && popoverTarget && popoverTarget.current && (
        <Popover placement={'right'} target={popoverTarget.current} onDismiss={()=>{}}>
          <PopoverContentsContainer>
            <SectionTitle>{displayTagElements.length}{displayTagElements.length === 1 ? ' tag' : ' tags'}</SectionTitle>
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
          </PopoverContentsContainer>
        </Popover>
      )}
      <span>{displayTagElements.length}</span>
      <TagIcon />
    </div>
  )
}

export default styled(TagsBadge)`
  display: flex;
  flex-direction: row;
  margin: 4px 4px 4px auto;
  background-color: ${({theme}) => theme.colors.warning.dark};
  padding: 0px 4px;
  border-radius: 4px;
  z-index: 10;
  line-height: 21px;

  svg {
    padding-top: 1px;
    margin-top: auto;
    margin-bottom: auto;
    height: 16px;
    color: black;
    stroke-width: 2px;
  }

  span {
    color: black;
    font-weight: bold;
    margin-right: 4px;
    margin-left: 2px;
    font-size: 16px;

    padding-bottom: 1px;
  }

  > div {
    max-width: 100px;
    padding: 8px;

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
  }

`