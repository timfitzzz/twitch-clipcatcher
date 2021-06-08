import React from 'react';
import logo from './logo.svg';
import './App.css';
import TwitchContextProvider from './contexts/TwitchContext/twitchCtx';
import { BrowserRouter } from 'react-router-dom';
import { Routes } from './routes/Routes';
import { Provider } from 'rendition';
import CatcherTheme from './Theme';
import PlayerContextProvider from './contexts/PlayerContext/playerCtx';
import styled from 'styled-components';

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
        <TwitchContextProvider>
          <PlayerContextProvider>
            <BrowserRouter children={Routes} basename={"/"} />
          </PlayerContextProvider>
        </TwitchContextProvider>
      </CustomThemeProvider>
    </AppContainer>
  );
}

export default App;
