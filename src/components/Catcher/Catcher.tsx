import React from 'react'
import styled from 'styled-components'
import { Flex } from 'rendition'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
// import { useContextSelector } from 'use-context-selector'
// import { ChannelActions, ChannelsContext } from '../../contexts/ChannelsContext'
import ChannelSelector from './ChannelSelector/ChannelSelector'
import AddChannelForm from './ChannelSelector/AddChannel';
import Channel from './Channel/Channel';
import { useEffect } from 'react'
import { updateClipEpochs, updateClipViews } from '../../redux/actions'
import useApiClient from '../../singleton-hooks/useApiClient'
import { selectChannelNames, selectCurrentChannel } from '../../redux/selectors'


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

  const channelNames = useAppSelector(state => selectChannelNames(state.channels))
  const currentChannel = useAppSelector(state => selectCurrentChannel(state.settings))

  const dispatch = useAppDispatch()
  const apiClient = useApiClient()

  useEffect(() => {
    let interval: any;
    if (apiClient) {
      interval = setInterval(() => {
        dispatch(updateClipViews({apiClient}))
        dispatch(updateClipEpochs({apiClient}))
      }, 60000)
    }

    return (() => {
      if (interval) {
        clearInterval(interval)
      }
    })

  })

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