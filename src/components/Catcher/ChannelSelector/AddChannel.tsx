import React, { useState } from 'react'
import { Button, Flex, Input } from 'rendition'
import styled from 'styled-components'
import { useAppDispatch } from '../../../hooks/reduxHooks'
import { channelAdded } from '../../../redux/channels'

const AddChannelForm = ({className}: {className?: string}) => {

  let [ formText, setFormText ] = useState<string | null>(null)
  let dispatch = useAppDispatch()

  const handleFormTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormText(e.currentTarget.value)
  }

  const handleAddChannel = () => {
    if (formText) {
      dispatch(channelAdded(formText))
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