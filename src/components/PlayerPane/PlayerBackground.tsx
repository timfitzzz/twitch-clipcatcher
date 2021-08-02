import React, { useMemo } from 'react'
import { Heading } from 'rendition/dist/components/Heading'
import styled from 'styled-components'
import { TimeAgoUtil } from '../../utilities/TimeAgo'
import { useAppSelector } from '../../hooks/reduxHooks'
import { selectClipTitle, selectCreatedAtEpoch, selectEpoch, selectStreamerName } from '../../redux/selectors'

const PlayerBackground = styled(({className, currentClipId}: { className?: string, currentClipId?: string }) => {

  let currentClipTitle = useAppSelector(state => currentClipId ? selectClipTitle(state.clips.clips[currentClipId]) : null)
  let currentClipBroadcasterName = useAppSelector(state => currentClipId ? selectStreamerName(state.clips.clips[currentClipId]) : null)
  let currentClipStartEpoch = useAppSelector(state => currentClipId ? selectEpoch(state.clips.clips[currentClipId]) : null)
  let currentClipCreatedAt = useAppSelector(state => currentClipId ? selectCreatedAtEpoch(state.clips.clips[currentClipId]) : null)
  let timeAgo = useMemo(() => {
    return TimeAgoUtil.instance.timeAgo
  }, [])

  const getDelayText = (epoch: number, createdAt: number): string => {
    return timeAgo 
    ? epoch === 0 
      ? 'clipped ' + timeAgo.format(createdAt)
      : 'happened ' + timeAgo.format(epoch)
    : ""
  }

    return (
      <div className={className}>
        {currentClipId ? (
          <div>
            <span>
              {currentClipTitle}
            </span>
            { /* eslint-disable-next-line react/jsx-pascal-case */}
            <Heading.h3>{currentClipBroadcasterName} · {getDelayText(currentClipStartEpoch || 0, currentClipCreatedAt || 0)} </Heading.h3>            
          </div>
        ) : (<></>)}

      </div>
    )


})`
  position: absolute;
  display: flex;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: -50;
  color: white;
  div {
    max-width: 75%;
    margin: auto;
    span {
      font-size: 48px;
      padding-left: 0px;
      line-height: 54px;
    }
    h3 {
      padding-top: 16px;
    }
  }

`

export default PlayerBackground