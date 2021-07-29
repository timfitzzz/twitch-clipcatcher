import { AccessTimeFilled } from '@styled-icons/material/AccessTimeFilled'
import { Refresh } from '@styled-icons/material/Refresh'
import { TimeAgoUtil } from '../../utilities/TimeAgo'
import React, { useState } from 'react'
import { useMemo } from 'react'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import useApiClient from '../../singleton-hooks/useApiClient'
import { clipEpochRetry } from '../../redux/actions'

const DelayBadge = styled.div<{hideIcon: boolean}>`

  display: flex;
  flex-direction: row;
  cursor: default;

  padding-left: 4px;
  padding-right: 4px;

  margin: 4px 4px 4px auto;
  line-height: 16px;
  color: white;
  border-radius: 4px;
  font-size: 16px;
  line-height: 21px;
  padding-top: 0px;
  padding-bottom: 0px;
  background-color: ${p => p.theme.colors.tertiary.dark};
  width: fit-content;
  font-weight: bold;
  text-wrap: none;

  span {
    // margin-left: 2px;
    // margin-top: auto;
    // margin-bottom: auto;
    // padding-bottom: 1px;
    margin-right: ${p => typeof p.hideIcon === 'boolean' && p.hideIcon === false ? '2px' : '0px'};
    font-size: 14px;
    font-weight: 700;
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
    // padding-top: 2px;
    margin-top: auto;
    margin-bottom: auto;
    margin-right: 2px;
    height: 16px;
    z-index: 10;
  }
`

const Delay = ({className, clipSlug, hideIcon = true, zIndex}: { hideIcon?: boolean, className?: string, zIndex?: number, clipSlug: string }) => {
  
  let timeAgo = useMemo(() => {
    return TimeAgoUtil.instance.timeAgo
  }, [])

  const apiClient = useApiClient()
  const dispatch = useAppDispatch()
  const startEpoch = useAppSelector(state => state.clips.clips[clipSlug].startEpoch)
  const createdAt = useAppSelector(state => new Date(state.clips.clips[clipSlug].created_at).getTime())
  const delayText = timeAgo 
                    ? startEpoch === 0 
                      ? timeAgo.format(createdAt, 'mini')
                      : timeAgo.format(startEpoch, 'mini')
                    : ""

  const retryDelay = useMemo(() => () => {
    if (startEpoch === 0 && apiClient) {
      dispatch(clipEpochRetry({ clipSlug, apiClient }))
    }
  }, [clipSlug, apiClient, startEpoch, dispatch])

  return (
    <DelayBadge hideIcon={hideIcon} className={className}>
      <span>{startEpoch > 0 ? delayText : `(${delayText})`}</span>
      {(!hideIcon || startEpoch === 0) && <DelaySometimesButton activate={startEpoch === 0} clickHandler={retryDelay}/> }
    </DelayBadge>
)}

export default styled(Delay)`  
  ${p => p.zIndex && `
  z-index: ${p.zIndex};
  `}
`