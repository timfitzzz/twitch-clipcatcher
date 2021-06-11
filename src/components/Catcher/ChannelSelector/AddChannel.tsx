import React, { useState } from 'react'
import { useContextSelector } from 'use-context-selector'
import { Button, Flex, Input } from 'rendition'
import styled from 'styled-components'
import { ChannelsContext } from '../../../contexts/ChannelsContext'

const AddChannelForm = ({className}: {className?: string}) => {

  let [ formText, setFormText ] = useState<string | null>(null)
  let addChannel = useContextSelector(ChannelsContext, (c) => c.addChannel)

  const handleFormTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormText(e.currentTarget.value)
  }

  const handleAddChannel = () => {
    if (formText && addChannel) {
      addChannel(formText.toLowerCase())
    }
  }

  return (
    <Flex flexDirection={'column'} className={className}>
      <h3>Add new channel</h3>
      <Flex flexDirection={'row'}>
        <Input onChange={handleFormTextChange} placeholder={'Channel name'}/>
        <Button onClick={handleAddChannel}>Catch</Button>
      </Flex>
    </Flex>
    
  )

}

export default styled(AddChannelForm)`
  margin-top: 10px;
  margin-left: auto;
  margin-right: auto;
`