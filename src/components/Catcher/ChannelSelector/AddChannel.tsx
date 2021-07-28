import React, { useState } from 'react'
import { Button, Flex, Input } from 'rendition'
import styled from 'styled-components'
import { useAppDispatch } from '../../../hooks/reduxHooks'
import { channelAdded } from '../../../redux/channels'

const AddChannelInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-top: 1px solid ${({theme}) => theme.colors.primary.light};
  border-left: 1px solid ${({theme}) => theme.colors.primary.light};
  border-right: 1px solid ${({theme}) => theme.colors.primary.light};
  border-bottom: 1px solid ${({theme}) => theme.colors.primary.light};
  background-color: ${({theme}) => theme.colors.primary.semilight};

  > div {
    width: 144px;
    height: 28px;
    margin-right: 8px;
    margin-top: 4px;
    margin-bottom: 4px;
    padding: 0px;
  }

  h5 {
    margin-top: auto;
    margin-bottom: auto;
    color: black;
    margin-left: 8px;
  }
`

const AddChannelInput = styled(Input)`
  margin-left: 8px;
  margin-right: 8px;
  margin-top: auto;
  margin-bottom: auto;
  padding-left: 8px;
  padding-right: 8px;
  height: 28px;
  background-color: white;
`

const AddChannelButton = styled(Button)`
  margin-left: 8px;
  margin-top: auto;
  margin-bottom: auto;
  padding-left: 7px;
  padding-right: 8px;
  height: 24px;
  width: 24px;
  border-radius: 50%;
  background-color: white;
`

const AddChannelForm = ({className}: {className?: string}) => {

  let [ formText, setFormText ] = useState<string | null>(null)
  let dispatch = useAppDispatch()

  const handleFormTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormText(e.currentTarget.value)
  }

  const handleAddChannel = () => {
    if (formText) {
      let validatedText = formText
      if (validatedText[0] === "#") {
        validatedText.replace("#","")
      }
      dispatch(channelAdded(validatedText))
    }
  }

  return (
    <Flex flexDirection={'column'} className={'AddButton ' + className}>
      <AddChannelInputContainer>
        <h5>add channel</h5>
        <AddChannelInput onChange={handleFormTextChange} placeholder={'Channel name'}/>
        <AddChannelButton onClick={handleAddChannel}>+</AddChannelButton>
      </AddChannelInputContainer>
    </Flex>
    
  )

}

export default styled(AddChannelForm)`
  margin-top: 0px;
  margin-left: auto;
  box-sizing: border-box;
  width: 100%;


`