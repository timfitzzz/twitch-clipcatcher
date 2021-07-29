import React, { useMemo, useState } from 'react'
import { Button, Flex, Input } from 'rendition'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks'
import { channelAdded } from '../../../redux/channels'
import { selectAppUser } from '../../../redux/selectors'

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
    width: 200px;
    height: 28px;
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
const AddChannelInputFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 8px;
  margin-right: 4px;
  position: relative;
`
const AddChannelInput = styled(Input)`
  margin-top: auto;
  margin-bottom: auto;
  padding-left: 8px;
  padding-right: 8px;
  height: 28px;
  background-color: transparent;
`

const AddChannelInputBackground = styled.div`
  position: absolute;
  left: 0px;
  border-radius: 4px;
  height: 28px;
  width: 200px;
  background-color: white;
`

const AddChannelSuggestedText = styled.div`
  position: absolute;
  left: 9px;
  top: 4px;
  color: ${({theme}) => theme.colors.gray.dark};
`

const AddChannelButton = styled(Button)`
  margin-left: 0px;
  margin-top: auto;
  margin-bottom: auto;
  padding-left: 8px;
  padding-right: 8px;
  height: 24px;
  width: 24px;
  border-radius: 50%;
  background-color: white;
`

const ValidationErrorBox = styled.div`
  font-size: 12px;
  line-height: 14px;
  background-color: ${({theme}) => theme.colors.warning.light};
  color: ${({theme}) => theme.colors.warning.dark};
  padding: 8px 8px!important;
  margin-left: 2px;
  margin-right: 2px;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
  box-sizing: border-box;
`

const CharacterRegExp: RegExp = /[^A-Za-z0-9_]+/g

const AddChannelForm = ({className}: {className?: string}) => {

  let [ formText, setFormText ] = useState<string>("")
  let [ validationError, setValidationError ] = useState<string | null>(null)
  let dispatch = useAppDispatch()
  let { userName, follows } = useAppSelector(selectAppUser) || { userName: null, follows: [] }

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

  const getPlaceholderText = () => {
    if (formText.length === 0 && userName) {
      return 'Channel name'
    } else {
      let matches = [...follows, userName].filter(name => formText.substr(0, formText.length).toLocaleLowerCase() === name?.substr(0, formText.length).toLocaleLowerCase())
      return matches.length > 0 ? matches[0] : ''
    }
  }

  const handleKeydown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && !e.shiftKey) {
      let placeholderText = getPlaceholderText()
      if (placeholderText && placeholderText !== 'Channel name' && placeholderText.length > 0) {
        setFormText(placeholderText)
      }
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const placeholderText = useMemo(() => getPlaceholderText(), [getPlaceholderText, formText, userName, follows])

  return (
    <Flex flexDirection={'column'} className={'AddButton ' + className}>
      <AddChannelInputContainer>
        <h5>add channel</h5>
        <AddChannelInputFieldContainer>
          <AddChannelInputBackground/>
          <AddChannelSuggestedText>{placeholderText}</AddChannelSuggestedText>
          <AddChannelInput onKeyDown={handleKeydown} value={placeholderText && placeholderText.length > 0 ? placeholderText.substr(0, formText.length) : formText} onChange={handleFormTextChange}/>
          {validationError ? (<ValidationErrorBox>{validationError}</ValidationErrorBox>) : <></>}
        </AddChannelInputFieldContainer>
        <AddChannelButton onClick={validationError ? () => {} : handleAddChannel}>+</AddChannelButton>
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