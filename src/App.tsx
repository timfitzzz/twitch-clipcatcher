import React from 'react';
import './App.css';
import AuthContextProvider from './contexts/AuthContext/twitchCtx';
import ChannelsContextProvider from './contexts/ChannelsContext/channelsCtx';
import { BrowserRouter } from 'react-router-dom';
import { Routes } from './routes/Routes';
import { Provider } from 'rendition';
import CatcherTheme from './Theme';
import PlayerContextProvider from './contexts/PlayerContext/playerCtx';
import styled from 'styled-components';
import { SingletonHooksContainer } from 'react-singleton-hook';

const AppContainer = styled.div`
  height: 100%;
  width: 100%;
`

const CustomThemeProvider = styled(Provider)`
  height: 100%;
`

function App() {
  return (
    <AppContainer>
      <CustomThemeProvider theme={CatcherTheme}>
        <AuthContextProvider>
          <SingletonHooksContainer/>
          <ChannelsContextProvider>

              <PlayerContextProvider>
                <BrowserRouter children={Routes} basename={"/"} />
              </PlayerContextProvider>

          </ChannelsContextProvider>
        </AuthContextProvider>
      </CustomThemeProvider>
    </AppContainer>
  );
}

export default App;
