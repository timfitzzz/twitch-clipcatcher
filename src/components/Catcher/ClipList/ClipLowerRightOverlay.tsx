import React from 'react'
import styled from 'styled-components'
import TagsBadge from './TagsBadge'

const ClipLowerRightOverlay = ({clipSlug, channelName, className}: { clipSlug: string, channelName: string, className?: string}) => {


  return (
    <div className={className}>
      <TagsBadge clipSlugs={[clipSlug]} channelName={channelName} />
    </div>
  )

}

export default styled(ClipLowerRightOverlay)`
  display: flex;
  flex-direction: column;
  align-content: flex-end;
  flex-grow: 1;
  justify-content: flex-end;
  align-items: flex-end;
`