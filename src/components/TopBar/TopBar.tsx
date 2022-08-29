import React from 'react'
import styled from 'styled-components'
import { AuthButton, YouCanGetHelpIfYouNeed } from './TopBarButtons'
import { TitleLogo } from './TitleLogo'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import { selectHelpViewActive } from '../../redux/selectors'
import { helpViewActivated, helpViewDeactivated } from '../../redux/settings'

export const TopBar = styled(({className}: {className?: string}) => {

  let helpActive = useAppSelector(state => selectHelpViewActive(state.settings))
  let dispatch = useAppDispatch()

  const toggleHelpActive = (e?: React.MouseEvent) => {
    e?.preventDefault()
    if (helpActive) {
      dispatch(helpViewDeactivated())
    } else {
      dispatch(helpViewActivated())
    }
  }

  return (
    <div className={className}>
      <TitleLogo />
      <YouCanGetHelpIfYouNeed toggledOn={helpActive} onClick={toggleHelpActive} />
      <AuthButton />
    </div>
  )

})`

  display: flex;
  flex-direction: row;
  padding: 8px;

`

export default TopBar