import { Twitch } from '@styled-icons/feather/Twitch'
import React from 'react'
import { Flex } from 'rendition'
import styled from 'styled-components'
import { useAppSelector } from '../../hooks/reduxHooks'
import { selectStreamerName } from '../../redux/selectors'

const StreamerBadgeContainer = styled(Flex)<{charCount: number}>`
  padding-left: 8px;
  padding-right: 8px;
  margin-left: 4px;
  margin-right: 4px;
  line-height: 24px;
  background-color: rgb(100,65,164);
  color: white;
  border-radius: 8px;
  font-size: 16px;
  padding: 0px 4px 4px 4px;
  width: fit-content;
  margin-top: 4px;
  margin-bottom: auto;

  svg {
    margin-top: auto;
    margin-bottom: auto;
    margin-right: 4px;
    height: 18px;
    stroke-width: 2px;
    padding-top: 3px;
  }

  span {
    padding-top: 2px;
    margin-top: -2px;
    font-weight: bold;
  }

  ${p => {
    if (p.charCount > 15) {
      if (p.charCount <= 20) {
        return `
          font-size: 15px;
        `
      } else {
        return `
          font-size: 14px;
        `
      }

    }
  }}
  

`

const StreamerBadge = ({clipSlug, className}: {clipSlug: string, className?: string}) => {

  let name = useAppSelector(s => selectStreamerName(s.clips.clips[clipSlug]))

  return ( 
    <StreamerBadgeContainer flexDirection={"row"} className={className} charCount={name.length}>
      <Twitch viewBox={'0 0 24 24'}/><span>{name}</span>
    </StreamerBadgeContainer>
  )

}
    

export default styled(StreamerBadge)`
  margin-top: 4px;
  margin-left: 4px;
  margin-right: auto;
`