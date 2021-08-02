import React, { useMemo } from 'react'
import { Flex } from 'rendition'
import styled from 'styled-components'
// import { defaultFilters, Filters } from '../../../types'
import {OptionsPanel} from '../OptionsPanel'
import useClipStacks from '../../../hooks/useClipStacks'
import NoClips from './NoClips'
import useUpdateLock from '../../../hooks/useUpdateLock'
import ClipStack from './ClipStack'
import ChannelStatsPanel from '../Channel/ChannelStatsPanel'
import { VariableSizeList } from 'react-window'
import { memo } from 'react'
import { useState } from 'react'
import { useRef } from 'react'
import { selectChannelError, selectChannelSort } from '../../../redux/selectors'
import { useAppSelector } from '../../../hooks/reduxHooks'
import ErrorCard from './ErrorCard'

const collapsedStackHeight = 176
const additionalHeightPerExpandedClip = 146

const ClipListContainer = styled(Flex)`
  flex-grow: 1;
  flex-basis: 0;
  border: 4px solid ${p => p.theme.colors.primary.semilight};

`

const ClipsContainer = styled(Flex)`
  display: flex;
  overflow-y: auto;
  margin-top: 0px;
  margin-bottom: 0px;
  width: 100%;
  overflow-x: hidden;
  flex-grow: 1;
  flex-basis: 0;
  align-items: stretch;
  padding-left: 0px;
  padding-top: 0px;
  padding-bottom: 0px;
  padding-right: 0px;
  scrollbar-width: none;
  border-left: 1px solid ${({theme}) => theme.colors.primary.light};
  border-right: 1px solid ${({theme}) => theme.colors.primary.light};
  border-bottom: 1px solid ${({theme}) => theme.colors.primary.light};

`
const InlineChannelStatsPanel = styled(ChannelStatsPanel)`
  height: 30px;
  display: flex;
  flex-direction: row;
  width: 100%;
  flex-grow: 0;
  justify-content: center;
  background-color: ${p => p.theme.colors.quartenary.main};
  border-left: 1px solid ${({theme}) => theme.colors.primary.light};
  border-top: 1px solid ${({theme}) => theme.colors.primary.light};
  border-right: 1px solid ${({theme}) => theme.colors.primary.light};
  > div {
  }
`


const RenderedStack = memo(({ className, style, index, data: { channelName, toggleExpandStack, isExpanded, clipStacks } }: { className?: string, style: any, index: number, data: { toggleExpandStack: (clipStack: string[], stackIndex: number) => void, isExpanded: (clipStack: string[]) => string | null, channelName: string, clipStacks: (string[] | string)[]}}) => (
  <div style={style}>
    {
      Array.isArray(clipStacks[index]) ? (
        <ClipStack stackIndex={index} toggleExpandStack={toggleExpandStack} isExpanded={isExpanded} key={channelName+(clipStacks[index] as string[]).reduce((string, slug) => string + slug, "")} clipSlugs={clipStacks[index] as string[]} channelName={channelName} />
      ) : (
        <ClipStack stackIndex={index} toggleExpandStack={toggleExpandStack} isExpanded={isExpanded} key={channelName+clipStacks[index]} clipSlugs={[clipStacks[index] as string]} channelName={channelName} />
      )
    }
  </div>
))

const ClipList = ({channelName}: {channelName: string, scanning: boolean}) => {
  const currentClipStacks = useClipStacks(channelName)
  const clipStacks = useUpdateLock(currentClipStacks, channelName)
  const sort = useAppSelector(state => selectChannelSort(state.channels[channelName]))
  const error = useAppSelector(state => selectChannelError(state.channels[channelName]))
  const [expandedStacks, setExpandedStacks] = useState<{ [key: string]: 1 }>({})
  const listRef = useRef<VariableSizeList>(null)

  const isExpanded = (clipStack: string[]): string | null => {
    let isExpanded = null
    let i = 0
      while (i < clipStack.length && !isExpanded) {
        if (expandedStacks[clipStack[i]]) {
          isExpanded = clipStack[i]
        }
        i++
    }
    return isExpanded
  }

  const getStackHeight = (index: number) => {
    let clipStack = clipStacks[index]
    if (Array.isArray(clipStack) && isExpanded(clipStack)) {
      return collapsedStackHeight + (Array.isArray(clipStack) ? (clipStack.length - 1) * additionalHeightPerExpandedClip : additionalHeightPerExpandedClip)
    } else {
      return collapsedStackHeight
    }
  }

  const toggleExpandStack = (clipSlugs: string[], stackIndex: number) => {
    if (listRef && listRef.current) {
      let expandedSlug = isExpanded(clipSlugs)
      if (!expandedSlug) {
        setExpandedStacks({
          ...expandedStacks,
          [clipSlugs[0]]: 1
        })
      } else {
        let { [expandedSlug]: unexpandingStack, ...others } = expandedStacks
        setExpandedStacks(others)
      }
      listRef!.current!.resetAfterIndex(stackIndex, false)
    }
  }

  useMemo(() => {
    if (listRef && listRef.current) {
      listRef.current.resetAfterIndex(0, false)
    }
    // we're using this to handle resetting the react-window when sort occurs, so 
    // sort is required. but since we don't use it in the function, eslint complains.
    // silly eslint.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, listRef])

  return (
    <ClipListContainer flexDirection={"column"}>
      <OptionsPanel channelName={channelName}/>
      <InlineChannelStatsPanel channelName={channelName}/>
      <ClipsContainer id={"#clipscontainer"} flexDirection={"column"}>
        { clipStacks && clipStacks.length > 0 && (
            <VariableSizeList
            ref={listRef}
            height={850}
            overscanCount={2}
            estimatedItemSize={176}
            itemCount={clipStacks.length}
            itemData={{clipStacks, toggleExpandStack, isExpanded, channelName}}
            itemSize={getStackHeight}
            itemKey={(index,data) => Array.isArray(data.clipStacks[index]) ? channelName + 'listcontainer' + (clipStacks[index] as string[]).join("") : channelName + 'listcontainer' + clipStacks[index]}
            width={'100%'}
            style={{boxSizing: 'border-box', marginRight: 8, padding: 8, paddingRight: 12, overflowX: 'hidden'}}
          >
            {props => <RenderedStack {...props} />} 
          </VariableSizeList>
        )}

        {/* { clipStacks && clipStacks.map(clipStack => 
          {
          if (Array.isArray(clipStack)) {
            return clipStack.length === 1 ? (
              <ClipStack key={channelName+clipStack.reduce((string, slug) => string + slug, "")} clipSlugs={clipStack} channelName={channelName}/>
            ) : ( 
              <ClipStack key={channelName+clipStack.reduce((string, slug) => string + slug, "")} clipSlugs={clipStack} channelName={channelName} />
            )
          } else {
            return <ClipStack key={channelName+clipStack} clipSlugs={[clipStack]} channelName={channelName} />
          }
        })} */}
        { error && (
          <ErrorCard channelName={channelName}/>
        )}
        { !error && clipStacks && clipStacks.length === 0 ? (
          <NoClips/>
        ) : (<></>)}
      </ClipsContainer>
    </ClipListContainer>
  )

}

export default ClipList