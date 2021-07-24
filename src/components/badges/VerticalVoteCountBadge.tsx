import React, { useRef, useState, useMemo } from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../../hooks/reduxHooks';
import { UserTypes, SpecialState } from '../../types';
import { DifferentiatedUserPip } from './UserPip';
import VoteStats from '../popovers/VoteStats'
import debounce from 'lodash/debounce';
import { abbreviateNumber } from 'js-abbreviation-number'
import { selectVotersByClipIds } from '../../redux/clips';
import { SpecialIcon } from './SpecialBadge';
import { selectStackModerationReport } from '../../redux/selectors';
import { Shield } from '@styled-icons/feather/Shield';

const VetoIcon = styled(({className}: { className?: string }) => (
  <div className={className}>
    <Shield className={'shield'}/>
  </div>
))`
  display: flex;
  background-color: black;
  svg {
    margin: auto;
    fill: ${({theme}) => theme.colors.danger.dark};
  }
`


const VerticalVoteCount = styled.div<{charCount: number}>`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-left: auto;
  margin-right: auto;
  height: unset;

  box-shadow: none;

  span {
    color: white;
    font-weight: bold;
    font-size: ${p => {

      switch (p.charCount) {
        case 1:
          return 28
        case 2: 
          return 22
        case 3:
          return 16
        case 4:
          return 12
        case 5:
          return 10
        case 6:
          return 8
        default:
          return 6
      }
    }}px;
    line-height: 18px;
    margin-top: 0px;
    margin-bottom: auto;
    padding-bottom: 0px;
    margin-left: 0px;
  }
`

const AdditionalPipBadge = styled(({className, count}: { className?: string, count: number }) => {

  return (
    <div className={className}>
      <span>+{count}</span>
    </div>
  )

})`
  height: 20px;
  width: 20px;
  font-size: 14px;
  margin-bottom: 2px;
  color: white;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  box-sizing: border-box;
  span {
    margin: auto;
    line-height: 14px;
    padding-right: 2px;
  }

`

const renderPips = (metaState: SpecialState, dramaState: SpecialState, vetoState: SpecialState, types: UserTypes[]) => {
  let pips: React.ReactElement[] = []
  let pipCount = types.length
  let typesCopy = [...types]
  typesCopy.reverse()

  if (vetoState !== SpecialState['no']) {
    pipCount++;
    pips.push(<VetoIcon/>)
  }

  if (dramaState !== SpecialState['no']) {
    pipCount++
    pips.push(<SpecialIcon type={'drama'} specialState={dramaState} />)
  }

  if (metaState !== SpecialState['no']) { 
    pipCount++; 
    pips.push(<SpecialIcon type={'meta'} specialState={metaState}/>) 
  }

  let moderationPipCount = pips.length
  let renderAdditional = pipCount - moderationPipCount
  let currentUserType = 0
  if (renderAdditional) {
    while (pips.length <= 3 && renderAdditional > 0) {
      pips.push(<DifferentiatedUserPip key={Math.random()} userType={types[currentUserType]}/>)
      currentUserType++
      renderAdditional--
    }
  }

  if (renderAdditional) {
    pips.push(<AdditionalPipBadge count={renderAdditional}/>)
  }

  return pips
}

const VerticalVoteCountBadgeContainer = styled.div<{specialState: SpecialState}>`
  display: flex;
  flex-direction: column;
  margin-bottom: 0px!important;
  margin-top: 0px!important;
  width: 32px;
  border-radius: inherit;
  background-color: ${({specialState, theme}) => {

    switch(specialState) {
      case SpecialState['no']:
        return `#138b27`;
      case SpecialState['maybe']:
        return theme.colors.warning.main
      case SpecialState['yes']:
        return theme.colors.danger.dark
    }

  }}; // ${({theme}) => theme.colors.success.dark}; // #82DF0A; // #294800; // #519000; // #7FE000; //  #63B000;
  border-radius: 4px;
  padding-top: 12px;
  padding-bottom: 4px;
  box-sizing: border-box;
  height: 142px;

  .types {
    display: flex;
    flex-direction: column;
    flex-wrap: no-wrap;
    margin-top: auto;
    padding-top: 0px;
    margin-bottom: auto;
    margin-left: auto;
    margin-right: auto;
    justify-content: flex-start;
    justify-self: flex-end;
    height: ${22*4}px;

    > div {
      width: 20px;
      height: 20px;
      margin-top: 2px!important;
      margin-left: auto;
      margin-right: auto;
      border-radius: 4px;
      border: 1px white;
      svg {
        height: 20px;
        width: 20px;
        margin-bottom: 2px;    
      }
    }
    
  }


  .votecount {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    padding: 0px 4px 0px 4px;
    margin-left: auto;
    margin-right: auto;
    height: unset;
    justify-self: flex-start;
    color: white;

    box-shadow: none;

    span {
      font-weight: bold;
      font-size: 28px;
      line-height: 21px;
      margin-top: 0px;
      margin-bottom: auto;
      padding-bottom: 1px;
      margin-left: 0px;
    }

  }

    
  .plusorminus {
    margin-left: auto;
    margin-right: auto;
    height: 16px;
    width: 16px;
    margin-bottom: auto;
    fill: ${({theme}) => theme.colors.text.main};
  }
`


const VerticalVoteCountBadge = ({ clipSlugs, channelName, className}: { clipSlugs: string[], channelName: string, className?: string}) => {

  const { upVoters, downVoters, upvoterTypes: typesUpvotedBy } = useAppSelector(state => 
      selectVotersByClipIds({ state, clipSlugs, channelName })
    )

  const { sortedMetas, sortedDramas, vetos } = useAppSelector(state => 
      selectStackModerationReport({state, clipSlugs, channel: state.channels[channelName]})
    )

  const metaState = useMemo(() => sortedMetas[0].length > 0 
                                  ? SpecialState['yes']
                                  : sortedMetas[1].length > 0
                                    ? SpecialState['maybe']
                                    : SpecialState['no'] 
                            , [sortedMetas])
                        
  const dramaState = useMemo(() => sortedDramas[0].length > 0
                                    ? SpecialState['yes']
                                      : sortedDramas[1].length > 0
                                      ? SpecialState['maybe']
                                      : SpecialState['no']
                              , [sortedDramas])

  const vetoState = useMemo(() => vetos.length > 0 ? SpecialState['yes'] : SpecialState['no'], [vetos])

  const specialState = useMemo(() => Math.max(metaState, dramaState, vetoState) as SpecialState, [metaState, dramaState, vetoState])

  let popoverTarget = useRef<HTMLDivElement>(null)
  let [showPopover, setShowPopover] = useState<any>(false)

  const handlePopover = debounce(() => setShowPopover(true), 100)

  const handleMouseExit = () => {
    handlePopover.cancel()
    setShowPopover(false)
  }

  const voteTotalText = useMemo(() => 
    ((upVoters.length - downVoters.length) > 0 ? '+' : '') + 
    abbreviateNumber(upVoters.length - downVoters.length), 
  [upVoters, downVoters])

  return (
    <VerticalVoteCountBadgeContainer className={className} specialState={specialState} ref={popoverTarget} onMouseLeave={handleMouseExit} onMouseOver={handlePopover}>
      { showPopover
        && !!(popoverTarget.current)
        && <VoteStats target={popoverTarget.current} clipSlugs={clipSlugs} channelName={channelName} />
      }
      <VerticalVoteCount charCount={voteTotalText.length}>
        <span>{voteTotalText}</span>
      </VerticalVoteCount>
      <div className={'types'}>
        { renderPips(metaState, dramaState, vetoState, typesUpvotedBy) }
      </div>
    </VerticalVoteCountBadgeContainer>
  )

}


export default styled(VerticalVoteCountBadge)`

`
