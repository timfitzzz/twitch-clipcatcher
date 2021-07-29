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

const ValidationErrorBox = styled.div`
  font-size: 10px;
  background-color: ${({theme}) => theme.colors.warning.light};
  color: ${({theme}) => theme.colors.warning.dark};
  padding: 4px;
  margin-left: 4px;
  border-radius: 4px;
`

const CharacterRegExp: RegExp = /[^A-Za-z0-9_]+/g

const AddChannelForm = ({className}: {className?: string}) => {

  let [ formText, setFormText ] = useState<string>("")
  let [ validationError, setValidationError ] = useState<string | null>(null)
  let dispatch = useAppDispatch()

  const handleFormTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // name can't begin with an underscore
    if (formText.length === 0 && e.currentTarget.value === "_") {
      setFormText(formText)
      setValidationError("Channel name cannot begin with an underscore.")
    } else if (formText.length === 0 && e.currentTarget.value === "#") {
      setFormText(formText)
      setValidationError("Please enter the name without a # prefix.")
    } else if (e.currentTarget.value[e.currentTarget.value.length - 1] === " ") {
      setFormText(formText)
      setValidationError("Channel name cannot contain a space.")
    } else if (e.currentTarget.value.length > 25) {
      setFormText(formText)
      setValidationError("Channel name cannot exceed 25 characters in length.")
    } else if (CharacterRegExp.exec(e.currentTarget.value)) {
      setFormText(formText)
      setValidationError("Allowed: letters, numbers, underscores")
    } else {
      setFormText(e.currentTarget.value.replace(" ", ""))
      setValidationError(null)
    }

    CharacterRegExp.lastIndex=0
  }

  const handleAddChannel = () => {
    if (formText && formText.length > 0) {
      let validatedText = formText.replace("#","")
      console.log(validatedText)
      dispatch(channelAdded(validatedText))
    }
  }

  return (
    <Flex flexDirection={'column'} className={'AddButton ' + className}>
      <AddChannelInputContainer>
        <h5>add channel</h5>
        <AddChannelInput value={formText} onChange={handleFormTextChange} placeholder={'Channel name'}/>
        <AddChannelButton disabled={!!validationError} onClick={validationError ? () => {} : handleAddChannel}>+</AddChannelButton>
        {validationError ? (<ValidationErrorBox>{validationError}</ValidationErrorBox>) : <></>}
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