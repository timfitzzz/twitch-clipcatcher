import React, { useMemo } from 'react'
import { Heading } from 'rendition/dist/components/Heading'
import styled from 'styled-components'
import { TimeAgoUtil } from '../../utilities/TimeAgo'
import { CaughtClipV2 } from '../../redux/clips'

const PlayerBackground = styled(({className, currentClip}: { className?: string, currentClip: CaughtClipV2 | null }) => {

  let timeAgo = useMemo(() => {
    return TimeAgoUtil.instance.timeAgo
  }, [])

  const getDelayText = (epoch: number, createdAt: string): string => {
    return timeAgo 
    ? epoch === 0 
      ? 'clipped ' + timeAgo.format((new Date(createdAt).getTime()))
      : 'happened ' + timeAgo.format(epoch)
    : ""
  }

    return (
      <div className={className}>
        {currentClip ? (
          <div>
            <span>
              {currentClip.title}
            </span>
            { /* eslint-disable-next-line react/jsx-pascal-case */}
            <Heading.h3>{currentClip.broadcasterName} · {getDelayText(currentClip.startEpoch, currentClip.created_at)} </Heading.h3>            
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