import React from 'react'
import styled from 'styled-components'
import ScannerWithCount from './ScannerWithCount'
import ClipsCount from './ClipsCount'
import SourceStream from './SourceStream'
import DurationBadge from './DurationBadge'
import FrogCount from './FrogCount'
import ViewCount from './ViewCount'
import Trusted from './TrustedBadges'

export const CatcherBadge = ({type, value, animate = false, className, link}: {type: string, value: string | number, animate?: boolean, className?: string, link?: string}) => {

  const renderBadge = () => (
    <>
    {
      { 
        // eslint-disable-next-line
        streamer: <SourceStream value={value}/>,
        clips: <ClipsCount value={value}/>,
        duration: <DurationBadge value={value}/>,
        frogCount: <FrogCount value={value}/>,
        viewCount: <ViewCount value={value}/>,
        trusted: <Trusted value={value.toString()}/>
      }[type]
    }
    </>
  )

  return (
    <>
    {className ? (
      <div className={className}>
        {renderBadge()}
      </div>
    ) : (
      <>
        {renderBadge()}
      </>
    )}
    
    </>
  )
}

export default styled(CatcherBadge)`
  margin-right: 4px;
`