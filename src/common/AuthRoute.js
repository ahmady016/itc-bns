import React from 'react'
import { Route, Redirect } from "react-router-dom";
import { isAuth } from './helpers';

export default function AuthRoute(props) {
  const { route: { path, auth: authRoute, component: Component }, rootAuthPath, loginPath, ...rest } = props;
  return (
    <Route
      path={path}
      render={_props => {
        if (!isAuth() && authRoute)
          return <Redirect to={loginPath} />;
        if (isAuth() && !authRoute)
          return <Redirect to={rootAuthPath} />;
        return <Component {..._props} />;
      }}
      {...rest}
    />
  )
}