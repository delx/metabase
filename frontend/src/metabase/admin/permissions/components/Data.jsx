import React, { Component, PropTypes } from "react";

import Permissions from "./Permissions.jsx";
import TopLevelLeftNavPane from "./TopLevelLeftNavPane.jsx";

function Data ({ location: { pathname } }) {
    return (
        <Permissions leftNavPane={<TopLevelLeftNavPane currentPath={pathname} />}>
            Data goes here!  😬
        </Permissions>
    );
}

export default Data;
