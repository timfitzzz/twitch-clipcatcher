import React, { ReactComponentElement, ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Flex, Box } from 'rendition'
import { CatcherBadge } from '../../badges/CatcherBadge'
import { RecordingIcon } from '../../badges/RecordingIcon'
import { Scanner } from '../../badges/ScannerWithCount'
import { useAppSelector } from '../../../hooks/reduxHooks'

const TabTitleText = styled.h5`
  padding-top: 0px;
  padding-bottom: 0px;
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 4px;
  margin-right: 4px;
`

const TabIconBox = styled.div`
  padding-top: 0px;
  padding-bottom: 0px;
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 4px;
  margin-right: 4px;
`


const TabBox = styled(Box)<{ current: boolean, buttonOnly?: boolean}>`

  padding: 4px;
  margin-left: 2px;
  margin-right: 2px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;

  &:last-of-type {
    display: inline-block;
    right: 0;
    bottom: 0;
  }

  ${p => p.current ? `
    border-top: 1px solid ${p.theme.colors.primary.light};
    border-left: 1px solid ${p.theme.colors.primary.light};
    border-right: 1px solid ${p.theme.colors.primary.light};
    border-bottom: 1px solid ${p.theme.colors.primary.semilight};
    background-color: ${p.theme.colors.primary.semilight};
    h5 {
      color: black;
    }
  ` : `
    border: 1px solid ${p.theme.colors.primary.light};
    background-color: ${p.theme.colors.quartenary.light};
    color: ${p.theme.colors.gray.dark};
  `}

  ${p => !p.current && !p.buttonOnly ? `
    border-bottom: 1px solid ${p.theme.colors.gray.light};
  ` : ``} 

  ${p => p.buttonOnly && !p.current ? `
    margin-bottom: 4px;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  `: ``}

  ${p => p.current && p.buttonOnly ? `

  ` : ``}

  ${p => p.buttonOnly ? `
    > div {
      height: 20px;
    }
  ` : ``}

`

const SteadyRecordingIcon = styled(RecordingIcon)<{fade?: boolean}>`
    ${p => !p.fade ? `opacity: 1;` : `opacity: 0.5;`}
`

const Tab = ({title, hidden, onClick, icon, current, className}: {title?: string, icon?: React.FC, hidden?: boolean, clipsCount?: number, scanning?: boolean, onClick: () => void, newClips?: boolean, current: boolean, className?: string}) => {

  const [lastAcknowledgedCount, setLastAcknowledgedCount ] = useState<number>(0)

  const clipsCount = useAppSelector(state => icon || !title ? undefined : state.channels[title].clips.length)
  const scanning = useAppSelector(state => icon || !title ? undefined: state.channels[title].scanning)

  const Icon = icon ? icon : null

  useEffect(() => {
    if (current) {
      setLastAcknowledgedCount(clipsCount || 0)
    }
  }, [current])

  return (
    <TabBox hidden={hidden} className={className} current={current} onClick={onClick} buttonOnly={icon ? true : false }>
      <Flex flexDirection={"row"}>
        { Icon ? (
          <Icon/>
        ) : (
          <TabTitleText>{title}</TabTitleText>
        )}
        { typeof scanning !== 'undefined' ? (
          <SteadyRecordingIcon fade={!current} scanning={false}/>
        ) : (<></>)}
        { typeof clipsCount !== 'undefined' ? (
          <CatcherBadge type={'clips'} value={clipsCount || 0}/>
        ) : (<></>)}
      </Flex>
    </TabBox>
  )


}

export default styled(Tab)`

`