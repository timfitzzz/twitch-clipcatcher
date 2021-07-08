import React, { ReactChild, ReactChildren, useState } from 'react';
import { createContext } from 'use-context-selector';

export interface IPlayerContext {
  currentClip: { currentClipId: string } | null;
  playlist: string[];
  playlistPosition: number;
  autoplay: boolean;
  playing: boolean;
  addClipToPlaylist: (clipId: string) => void;
  removeClipFromPlaylist: (clipNumber: number) => void;
  playClip: (clipId: string) => void
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
  const [currentClip, setCurrentClip] = useState<{ currentClipId: string } | null>(null);
  const [playing, setPlaying] = useState<boolean>();
  const [playlist, setPlaylist] = useState<string[]>([]);
  const [playlistPosition /*, _setPlaylistPosition*/] = useState<number>(0);
  const [autoplay, setAutoplay] = useState<boolean>(false);

  function addClipToPlaylist(clip: string) {
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
      setCurrentClip({currentClipId: playlist[startingIndex]});
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

  function playClip(clipId: string) {
    setCurrentClip({ currentClipId: clipId })
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
