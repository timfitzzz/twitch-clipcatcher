import React from 'react';
import './App.css';
import AuthContextProvider from './contexts/AuthContext/twitchCtx';
import { BrowserRouter } from 'react-router-dom';
import { Routes } from './routes/Routes';
import { Provider } from 'rendition';
import CatcherTheme from './Theme';
import PlayerContextProvider from './contexts/PlayerContext/playerCtx';
import styled from 'styled-components';
import { SingletonHooksContainer } from 'react-singleton-hook';
import { Provider as ReduxProvider } from 'react-redux';
import { persistor, store } from './redux/store';
import SingletonLoader from './singleton-hooks/SingletonLoader';
import { PersistGate } from 'redux-persist/integration/react'

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
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <CustomThemeProvider theme={CatcherTheme}>
            <AuthContextProvider>
              <SingletonHooksContainer/>
              <SingletonLoader/>
              <PlayerContextProvider>
                <BrowserRouter children={Routes} basename={"/"} />
              </PlayerContextProvider>
            </AuthContextProvider>
          </CustomThemeProvider>
        </PersistGate>
      </ReduxProvider>
    </AppContainer>
  );
}

export default App;
