import React, { useState } from 'react';
import { useMemo } from 'react';
import { Play } from '@styled-icons/feather/Play'
import { Circle } from '@styled-icons/feather/Circle'
import { RotateCcw } from '@styled-icons/feather/RotateCcw'
import { Shield } from '@styled-icons/feather/Shield'
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { UserTypes } from '../../../types';
import { useContextSelector } from 'use-context-selector';
import { PlayerContext } from '../../../contexts/PlayerContext/playerCtx';
import { selectWatchedInChannel } from '../../../redux/selectors';
import { clipPlayed } from '../../../redux/clips';

export enum PlayIconState {
  play,
  played,
  vetoed,
  vetoedPlay,
  vetoedPlayed
}

export const PlayIcon = styled(({className, state, onClick}: { className?: string, state: PlayIconState, onClick?: () => void}) => {
  return (
    <>
      {
        {
          0: <div className={className} onClick={onClick}><Circle className={'circle playCircle'}/><Play className={'play'}/></div>,
          1: <div className={className} onClick={onClick}><Circle className={'circle replayCircle'}/><RotateCcw className={'replay'}/></div>,
          2: <div className={className} onClick={onClick}><Circle className={'circle shieldCircle'}/><Shield className={'shield'}/><span>VETOED</span></div>,
          3: <div className={className} onClick={onClick}><Circle className={'circle shieldPlayCircle'}/><Shield className={'shieldPlay'}/><Play className={'play vetoedPlay'}/></div>,
          4: <div className={className} onClick={onClick}><Circle className={'circle shieldPlayCircle'}/><Shield className={'shieldPlay'}/><RotateCcw className={'replay vetoedReplay'}/></div>
        }[state]
      }
    </>
  )
})`
  display: flex;
  height: 72px;
  width: 72px;

  margin: auto;
  z-index: 30;
  cursor: pointer;

  span {
    position: relative;
    z-index: 31;
    margin: auto;
    opacity: 1;
    font-weight: bolder;
    color: ${({theme}) => theme.colors.danger.light};
  }

  svg {
    position: absolute;
    opacity: 0.7;
    stroke: none;
  }

  .circle {
    height: 72px;
    width: 72px;
    fill: ${({theme}) => theme.colors.gray.dark};
  }

  .shieldCircle {
    fill: ${({theme}) => theme.colors.danger.dark};
  }

  .shield {
    height: 48px;
    left: 50%;
    top: 50%;
    margin-left: -24px;
    margin-top: -24px;
    fill: ${({theme}) => theme.colors.danger.light};
  }

  .play {
    height: 48px;
    left: 50%;
    top: 50%;
    margin-top: -24px;
    margin-left: -20px;
    fill: ${({theme}) => theme.colors.gray.light};
  }

  .shieldPlayCircle {
    // fill: ${({theme}) => theme.colors.warning.main};
    fill: none;
  }

  .shieldPlay {
    height: 72px;

    fill: ${({theme}) => theme.colors.danger.dark};
    left: 50%;
    top: 50%;
    margin-top: -36px;
    margin-left: -36px;
  }
  
  .vetoedPlay {
    height: 44px;
    left: 50%;
    top: 50%;
    margin-top: -22px;
    margin-left: -19px;
    fill: ${({theme}) => theme.colors.warning.light};
  }

  .replay {
    height: 44px;
    left: 50%;
    top: 50%;
    margin-top: -22px;
    margin-left: -22px;
    stroke: ${({theme}) => theme.colors.gray.light};
  }

  .vetoedReplay {
    height: 40px;
    left: 50%;
    top: 50%;
    margin-top: -20px;
    margin-left: -20px;
    stroke: ${({theme}) => theme.colors.warning.light};
  }

  &:hover {

    svg {
      opacity: 1;
    }

    span {
      color: black;
    }
  }


`

const PlayButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
`

const PlayButton = ({
  clipSlug,
  channelName,
  className,
}: {
  clipSlug: string;
  channelName: string;
  className?: string;
}) => {
  let vetoedInChannelBy = useAppSelector((s) =>
    s.clips.clips[clipSlug].vetoedIn &&
    s.clips.clips[clipSlug].vetoedIn![channelName]
      ? s.clips.clips[clipSlug].vetoedIn![channelName].by
      : null
  );

  let vetoedInChannelByTypes = useAppSelector((s) =>
    vetoedInChannelBy
      ? vetoedInChannelBy.map(
          (userName) => s.users.users[userName].userTypes[channelName]
        )
      : null
  );

  let vetoedByTable = useMemo(
    () =>
      vetoedInChannelBy
        ? vetoedInChannelBy.reduce((table, userName, index) => {
            if (vetoedInChannelByTypes && vetoedInChannelByTypes[index]) {
              table[userName] = Math.max(...vetoedInChannelByTypes[index]);
            }
            return table;
          }, {} as { [userName: string]: UserTypes })
        : null,
    [vetoedInChannelBy, vetoedInChannelByTypes]
  );

  let vetoedByRanked = useMemo(
    () =>
      vetoedInChannelBy && vetoedByTable
        ? vetoedInChannelBy.sort(
            (userA, userB) => vetoedByTable![userA] - vetoedByTable![userB]
          )
        : null,
    [vetoedInChannelBy, vetoedByTable]
  );

  let vetoed = useMemo(() => vetoedByRanked ? true : false, [vetoedByRanked])
  let [vetoOverridden, setVetoOverridden] = useState<boolean>(false)
  let played = useAppSelector(state => selectWatchedInChannel([state.clips.clips[clipSlug], state.channels[channelName]]))
  let playClip = useContextSelector(PlayerContext, (c) => c.playClip)
  let stopPlaying = useContextSelector(PlayerContext, (c) => c.stopPlaying)

  let dispatch = useAppDispatch()

  const handlePlayClick = () => {
    if (vetoed && !vetoOverridden) {
      setVetoOverridden(true)
      setTimeout(() => {
        setVetoOverridden(false)
      }, 4000)
    } else {
      stopPlaying && stopPlaying()
      playClip && playClip(clipSlug)
      dispatch(clipPlayed({clipSlug, channelName}))
    }
  }

  return <div className={className}>
    <PlayButtonContainer>
        <PlayIcon onClick={handlePlayClick} state={played 
                                                    ? vetoed 
                                                      ? vetoOverridden 
                                                        ? PlayIconState['vetoedPlayed'] 
                                                        : PlayIconState['vetoed'] 
                                                      : PlayIconState['played']
                                                    : vetoed
                                                      ? vetoOverridden
                                                        ? PlayIconState['vetoedPlay']
                                                        : PlayIconState['vetoed']
                                                      : PlayIconState['play']} 
        />
    </PlayButtonContainer>
  </div>;
};

export default styled(PlayButton)`
  position: absolute;
  height: 100%;
  left: 0;
  right: 0;
`