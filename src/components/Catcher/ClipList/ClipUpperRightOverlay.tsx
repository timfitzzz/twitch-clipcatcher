import React, { useMemo } from 'react'
import styled from 'styled-components'
import ViewCountBadge from '../../badges/ViewCountBadge'
import Delay from '../../badges/WhenAgoBadge'
import ClipDurationBadge from '../../badges/ClipDurationBadge';
import VoteCountBadge from '../../badges/VoteCountBadge';
import { useAppSelector } from '../../../hooks/reduxHooks'
import { SortTypes } from '../../../types'
import { selectChannelSort } from '../../../redux/selectors';

export const UpperRightOverlay = ({clipSlug, channelName, className}: { clipSlug: string, channelName: string, className?: string}) => {
  
  const currentSort = useAppSelector(state => selectChannelSort(state.channels[channelName]))

  let FrogCount = useMemo(() => <VoteCountBadge key={'frogs'+clipSlug+channelName} clipSlugs={[clipSlug]} channelName={channelName}/>, [clipSlug, channelName])
  let ViewCount = useMemo(() => <ViewCountBadge clipSlugs={[clipSlug]} key={'views'+clipSlug}/>, [clipSlug])
  let WhenAgo = useMemo(() => <Delay clipSlug={clipSlug} key={'when'+clipSlug}/>, [clipSlug])
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
    <div className={'ClipUpperRightOverlay ' + className}>
      { renderBadges() }
    </div>
  )


}

export default styled(UpperRightOverlay)`
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
`