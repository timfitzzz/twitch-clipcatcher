
import React from 'react'
import {HelpCircle} from '@styled-icons/feather/HelpCircle'
import { ButtonCard } from './ButtonCards'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import { selectHelpViewActive } from '../../redux/selectors'
import { helpViewActivated, helpViewDeactivated } from '../../redux/settings'

const HelpButtonCard = styled(ButtonCard)`
  border-color: transparent;
`

const HelpCircleIcon = styled(HelpCircle)`
  width: 45px;
`

const HelpIndicatorLayer = styled(({className, activated, onClick}: {className?: string, activated: boolean, onClick?: (e: React.MouseEvent) => void}) => {
  return (
    <div onClick={onClick} className={className}>
      <HelpCircleIcon/>
    </div>)
})`
  z-index: 900;
  position: absolute;
  width: 45px;
  height: 45px;
  box-sizing: border-box;
  border-radius: 3px;
  // left: -1px;
  // top: -1px;
  svg {
    background: linear-gradient(${p => p.theme.colors.info.light}, ${p => p.theme.colors.info.dark});   
    position: relative;
    width: 45px;
    // margin-top: 2px;
    // margin-left: 2px;
    border-radius: 2px;
    transition: margin-left 0.1s, margin-top 0.1s;
    border-radius: 50%;
  }
  border: 0px solid ${p => p.theme.colors.info.semilight};
  opacity: 0;
  &:hover {
    // border: 2px solid ${p => p.theme.colors.info.semilight};
    opacity: 1;
    border-radius: 4px;
    transition: opacity 0.1s, border-width 0.1s;

    svg {
      border-radius: 50%;
      stroke: white;
      margin-top: 0px;
      margin-left: 0px;
      transition: margin-left 0.1s, margin-top 0.1s, stroke 0.1s;
    }
  }
  ${p => p.activated && `
    // border: 2px solid ${p.theme.colors.info.semilight};
    opacity: 1;
    border-radius: 4px;
    transition: opacity 0.1s, border-width 0.1s;

    svg {
      border-radius: 50%;
      stroke: white;
      margin-top: 0px;
      margin-left: 0px;
      transition: margin-left 0.1s, margin-top 0.1s, stroke 0.1s;
    }
  `}
  transition: opacity 0.1s, border-width 0.1s;

`

const HelpButton = () => {
  let helpActive = useAppSelector(state => selectHelpViewActive(state.settings))
  let dispatch = useAppDispatch()

  const toggleHelpActive = (e: React.MouseEvent) => {
    e.preventDefault()
    if (helpActive) {
      dispatch(helpViewDeactivated())
    } else {
      dispatch(helpViewActivated())
    }
  }

  return (
    <HelpButtonCard>
      <HelpCircleIcon/>
      <HelpIndicatorLayer activated={helpActive} onClick={toggleHelpActive}/>
    </HelpButtonCard>
  )
}

export default styled(HelpButton)`

`