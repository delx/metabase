import React, { Component, PropTypes } from "react";
import { Route, IndexRoute, IndexRedirect } from 'react-router';

import PermissionsApp from "./containers/PermissionsApp.jsx";
import GroupsListingApp from "./containers/GroupsListingApp.jsx";
import GroupDetailApp from "./containers/GroupDetailApp.jsx";
import DataApp from "./containers/DataApp.jsx";

export default (
    <Route path="permissions" component={PermissionsApp}>
        <IndexRedirect to="groups" />
        <Route path="groups">
            <IndexRoute component={GroupsListingApp} />
            <Route path=":groupId" component={GroupDetailApp} />
        </Route>
        <Route path="data" component={DataApp} />
    </Route>
);
