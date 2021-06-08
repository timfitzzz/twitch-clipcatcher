import React, { ReactNode } from 'react'
import { Radar } from '@styled-icons/material'
import { Badge, Flex } from 'rendition'
import styled from 'styled-components'
import ScannerWithCount from './ScannerWithCount'
import ClipsCount from './ClipsCount'
import SourceStream from './SourceStream'
import DurationBadge from './DurationBadge'

export const CatcherBadge = ({type, value, animate = false, className, link}: {type: string, value: string | number, animate?: boolean, className?: string, link?: string}) => {

  const renderBadge = () => (
    <>
    {
      { 
        // eslint-disable-next-line
        streamer: <SourceStream value={value}/>,
        scanned: <ScannerWithCount value={value} spin={animate}/>,
        clips: <ClipsCount value={value}/>,
        duration: <DurationBadge value={value}/>
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