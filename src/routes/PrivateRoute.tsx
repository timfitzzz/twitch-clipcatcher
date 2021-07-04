import React, { ElementType } from 'react'
import { useContextSelector } from 'use-context-selector'
import { Route, RouteProps } from "react-router-dom"
import { Spinner } from 'rendition';
import { AuthContext } from '../contexts/AuthContext'

type PrivateRouteProps = {
  path: RouteProps['path'];
  component: React.ElementType;
};

export const PrivateRoute: React.FunctionComponent<PrivateRouteProps> = ({ component, ...rest }: { component: ElementType<any> }) => {

  const Component = component
  const isAuthenticated = useContextSelector(AuthContext, (c) => c.isAuthenticated ? c.isAuthenticated() : false)
  const signinRedirect = useContextSelector(AuthContext, (c) => c.signinRedirect)

  return <Route {...rest} render={(props: any) => 
      isAuthenticated && Component ? <Component {...props} /> : (function () {signinRedirect!(); return <Spinner show/>}()) }/>
}