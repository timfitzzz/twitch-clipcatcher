import React from 'react'
import styled from 'styled-components'
import { OpenInNewOff } from '@styled-icons/material/OpenInNewOff'
import { useAppDispatch } from '../../hooks/reduxHooks'
import { playerPoppedIn } from '../../redux/settings'

const PlayerPopInIcon = styled(({className, onClick}: { className?: string, onClick?: () => void }) => {
  return <div className={className} onClick={onClick}>
    <OpenInNewOff/>
  </div>
})`
display: flex;
margin: unset auto;
  svg {
    height: 2rem;
    width: 2rem;
    color: ${p => p.theme.colors.primary.dark};
    cursor: pointer;
    z-index: 30;
    &:hover {
      color: ${p => p.theme.colors.primary.main};
    }
  }


`

const PlayerPaneUndertray = styled(({className}: { className?: string }) => {

  let dispatch = useAppDispatch()

  let handlePopIn = () => { dispatch(playerPoppedIn()) }

  return (
    <div className={className}>
      <PlayerPopInIcon onClick={handlePopIn}/>
      <span>pop player in</span>
    </div>
  )
})`
  height: 100%;
  width: 100%;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  span {
    margin: unset auto;
    height: fit-content;
    width: fit-content;
  }
  background-image: linear-gradient(black, 90%, ${p => p.theme.colors.primary.semilight});
  background-color: black;
  color: white;
`

export default PlayerPaneUndertray