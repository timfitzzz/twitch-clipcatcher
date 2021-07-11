import React, { useMemo } from 'react'
import styled from 'styled-components'
import ViewCountBadge from '../../badges/ViewCountBadge'
import VoteCount from '../../badges/VoteCount'
import Delay from '../../badges/WhenAgoBadge'
import ClipDurationBadge from '../../badges/ClipDurationBadge';
import { useAppSelector } from '../../../hooks/reduxHooks'
import { SortTypes } from '../../../types'

const ClipOverlayFrogCountBadge = styled(VoteCount)`
  margin-right: 4px;
  margin-left: auto;
  margin-top: 4px;
  margin-bottom: 4px;
`
const ClipOverlayWhenAgoBadge = styled(Delay)`
  margin-top: 4px;
  margin-bottom: 4px;
`


export const LowerRightOverlay = ({clipSlug, channelName, className}: { clipSlug: string, channelName: string, className?: string}) => {
  
  const currentSort = useAppSelector(state => state.channels[channelName].sort)

  let FrogCount = useMemo(() => <ClipOverlayFrogCountBadge key={'frogs'+clipSlug+channelName} clipSlug={clipSlug} channelName={channelName}/>, [clipSlug, channelName])
  let ViewCount = useMemo(() => <ViewCountBadge clipSlug={clipSlug} key={'views'+clipSlug}/>, [clipSlug])
  let WhenAgo = useMemo(() => <ClipOverlayWhenAgoBadge clipSlug={clipSlug} key={'when'+clipSlug}/>, [clipSlug])
  let Duration = useMemo(() => <ClipDurationBadge clipSlug={clipSlug} key={'duration'+clipSlug}/>, [clipSlug])

  function renderBadges() {
    let activeresult: JSX.Element[] = []
    let inactiveresult: JSX.Element[] = []

    currentSort.forEach(sort => {

      let component: JSX.Element | null;

      switch (sort.type) {
        case SortTypes.frogscount:
          component = FrogCount
          break;
        case SortTypes.views:
          component = ViewCount
          break;
        case SortTypes.date:
          component = WhenAgo
          break;
        case SortTypes.length:
          component = Duration
          break;
        default:
          component = null
          break;
      }

      if (sort.active && component) {
        activeresult.push(component)
      } else if (component) {
        inactiveresult.push(component)
      }
    })

    return activeresult.concat(inactiveresult)

  }

  return (
    <div className={className}>
      { renderBadges() }
    </div>
  )


}

export default styled(LowerRightOverlay)`
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
`