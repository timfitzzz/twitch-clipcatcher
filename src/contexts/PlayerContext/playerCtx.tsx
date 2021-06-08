import React, { ReactChild, ReactChildren, useState } from 'react';
import { createContext } from 'use-context-selector';
import { TwitchClipV5 } from '../../types';

export interface IPlayerContext {
  currentClip: TwitchClipV5 | null;
  playlist: TwitchClipV5[];
  playlistPosition: number;
  autoplay: boolean;
  playing: boolean;
  addClipToPlaylist: (clip: TwitchClipV5) => void;
  removeClipFromPlaylist: (clipNumber: number) => void;
  playClip: (clip: TwitchClipV5) => void
  toggleAutoplay: () => void;
  playPlaylist: (startingIndex: number) => void;
  playCurrentClip: () => void;
  stopPlaying: () => void;
}

export const defaultPlayerContext: Partial<IPlayerContext> = {
  currentClip: null,
  playlist: [],
  playlistPosition: 0,
  autoplay: false,
};

export const PlayerContext = createContext(defaultPlayerContext);

const PlayerContextProvider = ({
  children,
}: {
  children?: ReactChild | ReactChildren;
}) => {
  const [currentClip, setCurrentClip] = useState<TwitchClipV5 | null>(null);
  const [playing, setPlaying] = useState<boolean>();
  const [playlist, setPlaylist] = useState<TwitchClipV5[]>([]);
  const [playlistPosition, setPlaylistPosition] = useState<number>(0);
  const [autoplay, setAutoplay] = useState<boolean>(false);

  function addClipToPlaylist(clip: TwitchClipV5) {
    setPlaylist([...playlist, clip]);
  }

  function removeClipFromPlaylist(clipNumber: number) {
    setPlaylist(playlist.splice(clipNumber, 1));
  }

  function toggleAutoplay() {
    setAutoplay(!autoplay);
  }

  function playPlaylist(startingIndex: number) {
    if (playlist[startingIndex]) {
      setCurrentClip(playlist[startingIndex]);
      setPlaying(true);
    }
  }

  function playCurrentClip() {
    if (!playing) {
      setPlaying(true);
    }
  }

  function stopPlaying() {
    if (playing) {
      setPlaying(false);
    }
  }

  function playClip(clip: TwitchClipV5) {
    setCurrentClip(clip)
    setPlaying(true)
  }

  return (
    <PlayerContext.Provider
      value={{
        currentClip,
        playlist,
        playlistPosition,
        autoplay,
        playing,
        playClip,
        addClipToPlaylist,
        removeClipFromPlaylist,
        toggleAutoplay,
        playPlaylist,
        playCurrentClip,
        stopPlaying,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider
