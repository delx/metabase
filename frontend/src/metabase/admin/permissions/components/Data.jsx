import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

import Permissions from "./Permissions.jsx";
import TopLevelLeftNavPane from "./TopLevelLeftNavPane.jsx";

function Title() {
    return (
        <section className="PageHeader clearfix">
            <h2 className="PageTitle">
                Databases
            </h2>
        </section>
    );
}

function DatabaseListItem( { database }) {
    return (
        <li>
            <Link to={"/admin/permissions/databases/" + database.id} className="link no-decoration">
                <h3>
                    {database.name}
                </h3>
            </Link>
        </li>
    );
}

function Data ({ location: { pathname }, databases }) {
    console.log('databases:', databases); // NOCOMMIT
    return (
        <Permissions leftNavPane={<TopLevelLeftNavPane currentPath={pathname} />}>
            <Title />
            <ul>
                {databases && databases.map((database, index) => (
                     <DatabaseListItem key={index} database={database} />
                 ))}
            </ul>
        </Permissions>
    );
}

export default Data;
