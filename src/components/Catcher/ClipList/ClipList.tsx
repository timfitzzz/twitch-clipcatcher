import React, { useCallback, useState, useMemo, useRef } from 'react'
import { Flex } from 'rendition'
import styled from 'styled-components'
import { CaughtClip, SubmitterFilters, ChannelFilters, defaultFilters, Filters, SortTypes, SortList, defaultSort } from '../../../types'
import Clip from './Clip'
import {OptionsPanel} from '../OptionsPanel'
import update from 'immutability-helper';



const ClipListContainer = styled(Flex)`
  flex-grow: 1;
  flex-basis: 0;
`

const ClipsContainer = styled(Flex)`
  display: block;
  overflow-y: auto;
  margin-top: 0px;
  margin-bottom: 0px;
  width: 100%;
  overflow-x: hidden;
  flex-grow: 1;
  flex-basis: 0;

`



// const defaultSort: SortTypes[] = []

const ClipList = ({clips: currentClips, channelName, scanning}: {clips: CaughtClip[], channelName: string, scanning: boolean}) => {

  // console.log('rendering cliplist') 
  const prevCurrentClipsRef = useRef<CaughtClip[]>();
  const [sort, setSort] = useState<SortList>(defaultSort)
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [lockDisplay, setLockDisplay] = useState<boolean>(false)
  const clips: CaughtClip[] = useMemo(() => {
    if (lockDisplay && prevCurrentClipsRef.current) {
      return prevCurrentClipsRef.current
    } else {
      prevCurrentClipsRef.current = currentClips
      return currentClips
    }
  }, [currentClips, lockDisplay])

  const moveSort = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragSort = sort[dragIndex]
      setSort(
        update(sort, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragSort]
        ]
      }))
    },
    [sort]
  )

  const toggleDisplayLock = () => {
    setLockDisplay(!lockDisplay)
  }

  const toggleSort = (toggleType: SortTypes) => {
    console.log('toggling sort ', toggleType)
    const newSort = [...sort]
    newSort.forEach((sortSetting, i) => {
      let { type: sortType, active, direction} = sortSetting
      if (sortType === toggleType) {
        if (!active) {
          newSort[i].active = true
          newSort[i].direction = "desc"
        } else if (direction === 'desc') {
          newSort[i].direction = 'asc'
        } else if (direction === 'asc') {
          newSort[i].active = false
        }
      }
    })
    setSort(newSort)
  }

  const setFilter = (filterName: keyof Filters, value?: SubmitterFilters | ChannelFilters ) => {
    if (value) {
      setFilters({
        ...filters,
        [filterName]: value
      })
    } else {
      setFilters({
        ...filters,
        [filterName]: !filters[filterName]
      })
    }
  }


  return (
    <ClipListContainer flexDirection={"column"}>
      <OptionsPanel locked={lockDisplay} toggleDisplayLock={toggleDisplayLock} toggleSort={toggleSort} channelName={channelName} clipCount={clips.length} scanning={scanning} currentSort={sort} moveSort={moveSort} filters={filters} setFilter={setFilter}/>
      {/* <Flex flexDirection={"row"}>
        
      </Flex> */}
      <ClipsContainer flexDirection={"column"}>
        { clips && clips.map((clip, idx) => <Clip key={clip.tracking_id + idx} clip={clip}/>)}
      </ClipsContainer>
    </ClipListContainer>
  )

}

export default ClipList