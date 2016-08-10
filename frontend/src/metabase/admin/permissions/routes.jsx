import React, { Component, PropTypes } from "react";
import { Route, IndexRoute, IndexRedirect } from 'react-router';

import GroupsListingApp from "./containers/GroupsListingApp.jsx";
import GroupDetailApp from "./containers/GroupDetailApp.jsx";
import DataApp from "./containers/DataApp.jsx";
import DatabaseDetailsApp from "./containers/DatabaseDetailsApp.jsx";
import DatabaseGroupDetailsApp from "./containers/DatabaseGroupDetailsApp.jsx";
import SchemaPermissionsApp from "./containers/SchemaPermissionsApp.jsx";

export default (
    <Route path="permissions">
        <IndexRedirect to="groups" />
        <Route path="groups">
            <IndexRoute component={GroupsListingApp} />
            <Route path=":groupID" component={GroupDetailApp} />
        </Route>
        <Route path="data" component={DataApp} />
        <Route path="databases">
            <Route path=":databaseID" component={DatabaseDetailsApp} />
            <Route path=":databaseID/groups/:groupID" component={DatabaseGroupDetailsApp} />
            <Route path=":databaseID/groups/:groupID/schema/:schema" component={SchemaPermissionsApp} />
        </Route>
    </Route>
);
