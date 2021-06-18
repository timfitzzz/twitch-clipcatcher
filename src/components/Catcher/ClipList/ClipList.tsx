import React, { useState } from 'react'
import { Flex } from 'rendition'
import styled from 'styled-components'
import { CaughtClip, SubmitterFilters, ChannelFilters, defaultFilters, Filters, SortTypes } from '../../../types'
import Clip from './Clip'
import {OptionsPanel} from '../OptionsPanel'



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

const ClipList = ({clips, channelName, scanning}: {clips: CaughtClip[], channelName: string, scanning: boolean}) => {

  // console.log('rendering cliplist') 

  const [sort, setSort] = useState<[sort: SortTypes, direction: "asc" | "desc"]>([SortTypes.none, "asc"])
  const [filters, setFilters] = useState<Filters>(defaultFilters)

  const updateSort = (sort: SortTypes, direction: "asc" | "desc") => {
    setSort([sort, direction])
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
      <OptionsPanel channelName={channelName} clipCount={clips.length} scanning={scanning} currentSort={sort} setSort={updateSort} filters={filters} setFilter={setFilter}/>
      {/* <Flex flexDirection={"row"}>
        
      </Flex> */}
      <ClipsContainer flexDirection={"column"}>
        { clips && clips.map((clip, idx) => <Clip key={clip.tracking_id + idx} clip={clip}/>)}
      </ClipsContainer>
    </ClipListContainer>
  )

}

export default ClipList