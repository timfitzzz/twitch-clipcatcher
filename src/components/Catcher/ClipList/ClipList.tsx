import React, { useState, useMemo, useRef } from 'react'
import { Flex } from 'rendition'
import styled from 'styled-components'
// import { defaultFilters, Filters } from '../../../types'
import Clip from './Clip'
import {OptionsPanel} from '../OptionsPanel'
import useClips from '../../../hooks/useClips'
import NoClips from './NoClips'



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

const ClipList = ({channelName, scanning}: {channelName: string, scanning: boolean}) => {

  // console.log('rendering cliplist') 
  const prevCurrentClipsRef = useRef<string[]>();
  const currentClips = useClips({channelName})
  // const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [lockDisplay, setLockDisplay] = useState<boolean>(false)
  const clips: string[] = useMemo(() => {
    if (lockDisplay && prevCurrentClipsRef.current) {
      return prevCurrentClipsRef.current
    } else {
      prevCurrentClipsRef.current = currentClips
      return currentClips
    }
  }, [currentClips, lockDisplay])

  
  const toggleDisplayLock = () => {
    setLockDisplay(!lockDisplay)
  }

  // const moveSort = useCallback(
  //   (dragIndex: number, hoverIndex: number) => {
  //     const dragSort = sort[dragIndex]
  //     setSort(
  //       update(sort, {
  //       $splice: [
  //         [dragIndex, 1],
  //         [hoverIndex, 0, dragSort]
  //       ]
  //     }))
  //   },
  //   [sort]
  // )


  // const toggleSort = (toggleType: SortTypes) => {
  //   console.log('toggling sort ', toggleType)
  //   const newSort = [...sort]
  //   newSort.forEach((sortSetting, i) => {
  //     let { type: sortType, active, direction} = sortSetting
  //     if (sortType === toggleType) {
  //       if (!active) {
  //         newSort[i].active = true
  //         newSort[i].direction = "desc"
  //       } else if (direction === 'desc') {
  //         newSort[i].direction = 'asc'
  //       } else if (direction === 'asc') {
  //         newSort[i].active = false
  //       }
  //     }
  //   })
  //   setSort(newSort)
  // }

  // const setFilter = (filterName: keyof Filters, value?: SubmitterFilters | ChannelFilters ) => {
  //   if (value) {
  //     setFilters({
  //       ...filters,
  //       [filterName]: value
  //     })
  //   } else {
  //     setFilters({
  //       ...filters,
  //       [filterName]: !filters[filterName]
  //     })
  //   }
  // }


  return (
    <ClipListContainer flexDirection={"column"}>
      <OptionsPanel locked={lockDisplay} toggleDisplayLock={toggleDisplayLock} channelName={channelName}/>
      {/* <Flex flexDirection={"row"}>
        
      </Flex> */}
      <ClipsContainer flexDirection={"column"}>
        { clips && clips.map((clip, idx) => <Clip key={clip+channelName+idx} clipSlug={clip} channelName={channelName}/>)}
        { clips && clips.length === 0 ? (
          <NoClips/>
        ) : (<></>)}
      </ClipsContainer>
    </ClipListContainer>
  )

}

export default ClipList