import React from 'react'
import styled from 'styled-components'
import { OpenInNew } from '@styled-icons/material/OpenInNew'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import { selectPlayerPoppedout } from '../../redux/selectors'
import { playerPoppedOut } from '../../redux/settings'

const PlayerPaneOverlayContainer = styled.div<{draggingDivider: boolean}>`
  height: 100%;
  width: 100%;
  display: flex;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  ${p => p.draggingDivider ? `
    z-index: 100;
    pointer-events: all;
  ` : `
    z-index: 0;
    pointer-events: none;
  `}
`

const PlayerPaneOverlayUpperSection = styled.div<{showButtons: boolean}>`
  margin-top: 0px;
  margin-right: 0px;
  margin-left: auto;
  margin-bottom: auto;
  height: 4rem;
  padding: 20px;
  ${p => p.showButtons ? `
    opacity: 1;
  `:`
    opacity: 0;
  `}

  transition: 0.1s linear opacity;
`

const PlayerPaneOverlayBottomSection = styled.div`

`

const PlayerPaneOverlayButton = styled.div`
  svg {
    width: 2rem;
    height: 2rem;
  }
  z-index: 50;
  cursor: pointer;
  pointer-events: bounding-box;
  color: white;
  &:hover {
    color: ${p => p.theme.colors.primary.main};
  }
`

export const PlayerPaneOverlay = styled(({className, mouseIsOver = false, draggingDivider}: { mouseIsOver: boolean, draggingDivider: boolean, className?: string }) => {


  let playerPopped = useAppSelector(state => selectPlayerPoppedout({settings: state.settings}))
  let dispatch = useAppDispatch()

  let handlePopOut = () => { console.log('popping player out'); dispatch(playerPoppedOut()) }


  return (
    <PlayerPaneOverlayContainer draggingDivider={draggingDivider}>
      <PlayerPaneOverlayUpperSection showButtons={mouseIsOver}>
        { !playerPopped && (
          <PlayerPaneOverlayButton onClick={handlePopOut}>
            <OpenInNew/>
          </PlayerPaneOverlayButton>
        )}
        { playerPopped && (
          <PlayerPaneOverlayButton>
            {`Full screen: F11`}
          </PlayerPaneOverlayButton>
        )}
      </PlayerPaneOverlayUpperSection>
      <PlayerPaneOverlayBottomSection>

      </PlayerPaneOverlayBottomSection>
    </PlayerPaneOverlayContainer>
  )


})`

`

export default PlayerPaneOverlay