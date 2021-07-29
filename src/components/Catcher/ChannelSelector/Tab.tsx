import React from 'react'
import styled from 'styled-components'
import { Flex } from 'rendition'
import ClipsCount from '../../badges/ClipsCount'
import { RecordingIcon } from '../../badges/RecordingIcon'
import { useAppSelector } from '../../../hooks/reduxHooks'
import { selectChannelDisplayName } from '../../../redux/selectors'

const ChannelButtonTitleText = styled.h5`
display: flex;
  padding-top: 0px;
  padding-bottom: 0px;
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 4px;
  margin-right: 4px;
`

const ChannelButtonBox = styled.div<{ current: boolean, buttonOnly?: boolean}>`
  display: flex;
  flex-direction: row;
  padding: 0px 4px;
  margin-top: 4px;
  margin-left: 2px;
  margin-right: 2px;
  border-radius: 4px;
  height: 31px;
  > div {

  }

   

  &:first-of-type {

  }

  
  &:last-of-type {

  }

  ${p => p.current ? `
    border-top: 1px solid ${p.theme.colors.primary.light};
    border-left: 1px solid ${p.theme.colors.primary.light};
    border-right: 1px solid ${p.theme.colors.primary.light};
    border-bottom: 1px solid ${p.theme.colors.primary.light};
    background-color: ${p.theme.colors.primary.semilight};
    h5 {
      color: black;
    }
  ` : `

    border: 1px solid ${p.theme.colors.primary.semilight}; ${p.theme.colors.primary.light};
    background-color: ${p.theme.colors.quartenary.light};
    color: unset;
  `}

  ${p => p.buttonOnly && !p.current ? `
    height: 31px;
    border: 1px solid transparent;
    padding-left: 6px;
    background: unset;
    background-color: unset;
    fill: none;
    color: unset;
    cursor: pointer;
    svg {
      &:hover {
        fill: ${p.theme.colors.success.dark};
      }
    }

  `: ``}

  ${p => !p.buttonOnly && !p.current ? `
    &:hover {
      border-top: 1px solid ${p.theme.colors.primary.light};
      border-left: 1px solid ${p.theme.colors.primary.light};
      border-right: 1px solid ${p.theme.colors.primary.light};
      border-bottom: 1px solid ${p.theme.colors.primary.light};
      cursor: pointer;
    }
  `: ``}

  ${p => p.current && p.buttonOnly ? `
    margin-bottom: -4px;
    border-bottom: 1px solid ${p.theme.colors.primary.semilight};
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    z-index: 1;
    padding-left: 6px;
    svg {
      margin-top: -4px;
      fill: ${p.theme.colors.primary.dark};
    }
    height: 35px;

  ` : ``}

  ${p => p.buttonOnly ? `
    margin-top: 4px;
    padding-left: 4px;
    padding-right: 4px;

  ` : ``}

`

const SteadyRecordingIcon = styled(RecordingIcon)<{fade?: boolean}>`
    ${p => !p.fade ? `opacity: 1;` : `opacity: 0.5;`}
`

const ChannelButton = ({title, hidden, onClick, icon, current, className}: {title?: string, icon?: React.FC, hidden?: boolean, clipsCount?: number, scanning?: boolean, onClick: () => void, newClips?: boolean, current: boolean, className?: string}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const scanning = useAppSelector(state => icon || !title ? undefined: state.channels[title].scanning)
  const channelDisplayName = useAppSelector(state => icon || !title ? null : selectChannelDisplayName(state.channels[title]))
  const Icon = icon ? icon : null

  return (
    <ChannelButtonBox hidden={hidden} className={className} current={current} onClick={onClick} buttonOnly={icon ? true : false }>
      <Flex flexDirection={"row"}>
        { Icon ? (
          <Icon/>
        ) : (
          <ChannelButtonTitleText>{channelDisplayName}</ChannelButtonTitleText>
        )}
        { typeof scanning !== 'undefined' && scanning !== false ? (
          <SteadyRecordingIcon fade={!current} scanning={false} noHoverChange={true}/>
        ) : (<></>)}
        { typeof title !== 'undefined' && (
          <ClipsCount channelName={title} inverted={current}/>
        )}
      </Flex>
    </ChannelButtonBox>
  )


}

export default styled(ChannelButton)`

  > div {
    margin-top: auto;
    margin-bottom: auto;
  }

`