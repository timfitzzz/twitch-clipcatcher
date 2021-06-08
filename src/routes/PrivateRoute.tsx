import React, { ElementType } from 'react'
import { useContextSelector } from 'use-context-selector'
import { Route, RouteProps } from "react-router-dom"
import { Spinner } from 'rendition';
import { TwitchContext } from '../contexts/TwitchContext'

type PrivateRouteProps = {
  path: RouteProps['path'];
  component: React.ElementType;
};

export const PrivateRoute: React.FunctionComponent<PrivateRouteProps> = ({ component, ...rest }: { component: ElementType<any> }) => {

  const Component = component
  const isAuthenticated = useContextSelector(TwitchContext, (c) => c.isAuthenticated)
  const signinRedirect = useContextSelector(TwitchContext, (c) => c.signinRedirect)

  return <Route {...rest} render={(props: any) => 
      isAuthenticated && isAuthenticated() && Component ? <Component {...props} /> : (function () {signinRedirect!(); return <Spinner show/>}()) }/>
}