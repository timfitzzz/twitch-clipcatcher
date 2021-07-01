import { AccessTimeFilled } from '@styled-icons/material/AccessTimeFilled'
import { Refresh } from '@styled-icons/material/Refresh'
import { TimeAgoUtil } from '../../utilities/TimeAgo'
import React, { useState } from 'react'
import { useMemo } from 'react'
import { Flex } from 'rendition'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import useApiClient from '../../singleton-hooks/useApiClient'
import { clipEpochsRetry } from '../../redux/actions'
import { useEffect } from 'react'

const DelayBadge = styled(Flex)`
  padding-left: 4px;
  padding-right: 4px;
  margin-left: auto;
  margin-right: 4px;
  line-height: 16px;
  color: ${p => p.theme.colors.gray.light};
  border-radius: 4px;
  font-size: 14px;
  padding-top: 0px;
  padding-bottom: 2px;
  margin-top: auto;
  margin-bottom: 4px;
  background-color: ${p => p.theme.colors.tertiary.dark};
  width: fit-content;
  font-weight: bold;
  text-wrap: none;
  height: 18px;


  span {
    padding-top: 0.5px;
    margin-top: auto;
    margin-bottom: auto;
  }
  

`

const DelaySometimesButton = styled(({activate, clickHandler, className}: {activate: boolean, clickHandler: () => void, className?: string}) => {

  const [hoverActive, setHoverActive] = useState<boolean>(false)

  const handleMouseEnter = (e: React.MouseEvent) => {
    setHoverActive(true)
  }
  
  const handleMouseLeave = (e: React.MouseEvent) => {
    setHoverActive(false)
  }

  const handleOnClick = (e: React.MouseEvent) => {
    clickHandler()
  }

  return (
    <div className={className} onClick={handleOnClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {hoverActive && activate ? <Refresh/> : <AccessTimeFilled/>}
    </div>
  )

})`

  display: contents;
  svg {
    padding-top: 2px;
    margin-top: auto;
    margin-bottom: auto;
    margin-left: 4px;
    height: 14px;
    z-index: 10;
  }
`

const Delay = ({className, clipSlug}: { className?: string, clipSlug: string }) => {
  
  let timeAgo = useMemo(() => {
    return TimeAgoUtil.instance.timeAgo
  }, [])

  const [redrawInterval, setRedrawInterval] = useState<number | null>(null)
  const apiClient = useApiClient()
  const dispatch = useAppDispatch()
  const startEpoch = useAppSelector(state => state.clips.clips[clipSlug].startEpoch)
  const createdAt = useAppSelector(state => new Date(state.clips.clips[clipSlug].created_at).getTime())
  const delayText = useMemo(() => (timeAgo 
                                    ? startEpoch === 0 
                                      ? timeAgo.format(createdAt, 'mini')
                                      : timeAgo.format(startEpoch, 'mini')
                                    : ""), [startEpoch, createdAt, timeAgo])

  const retryDelay = useMemo(() => () => {
    if (startEpoch === 0 && apiClient) {
      dispatch(clipEpochsRetry({ clipSlugs: [clipSlug], apiClient }))
    }
  }, [clipSlug, apiClient, startEpoch, dispatch])

  useEffect(() => {

    let interval: number = window.setTimeout(() => setRedrawInterval(interval), 60000)
    
    return (() => {
      window.clearTimeout(interval)
    })

  }, [redrawInterval])

  return (
    <DelayBadge flexDirection={"row"} className={className}>
      <span>{startEpoch > 0 ? delayText : `? (${delayText})`}</span>
      <DelaySometimesButton activate={startEpoch === 0} clickHandler={retryDelay}/>
    </DelayBadge>
)}

export default Delay