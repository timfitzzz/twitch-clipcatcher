import React from 'react'
import styled from 'styled-components'
import { Flex } from 'rendition'
import { useAppSelector } from '../../hooks/reduxHooks'
// import { useContextSelector } from 'use-context-selector'
// import { ChannelActions, ChannelsContext } from '../../contexts/ChannelsContext'
import ChannelSelector from './ChannelSelector/ChannelSelector'
import AddChannelForm from './ChannelSelector/AddChannel';
import Channel from './Channel/Channel';
import { shallowEqual } from 'react-redux'


const ChannelContainer = styled(Flex).attrs(p => ({
  ...p,
  flexDirection: 'column'
}))<{borders: boolean}>`
  flex-grow: 1;

  ${ p => p.borders && `
    border-left: 1px solid ${p.theme.colors.primary.light};
    border-right: 1px solid ${p.theme.colors.primary.light};
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  `}
`


const Catcher = styled(({  className }: { className?: string}) => {

  const channelNames = useAppSelector(state => Object.getOwnPropertyNames(state.channels), shallowEqual)
  const currentChannel = useAppSelector(state => state.settings.currentChannel)
  // const displayOrder = useMemo(() => {
  //   if (currentChannel && typeof currentChannel === 'string') {
  //     let newOrder = channelNames.filter(name => name !== currentChannel)
  //     newOrder.push(currentChannel)
  //     return newOrder
  //   } else {
  //     return channelNames
  //   }
  // }, [channelNames, currentChannel])

  return (
    <div className={className}>
      <ChannelSelector channelNames={channelNames}/>
      <ChannelContainer borders={currentChannel !== -1}>
        {channelNames.length > 0 &&
          channelNames.map((channelName) => (
            <Channel
              channelName={channelName}
              key={'channel' + channelName}
              hidden={!(currentChannel === channelName)}
            />
          ))}
        { currentChannel === -1 ? (
          <AddChannelForm />
        ) : (
          <></>
        )}
      </ChannelContainer>
    </div>
  )
})`
  margin-left: 4px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-right: 4px;
`

export default Catcher