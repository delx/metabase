import React from "react";

import Permissions from "./Permissions.jsx";
import { LeftNavPane, LeftNavPaneItem, LeftNavPaneItemBack } from "./LeftNavPane.jsx";

function NavPane({ currentPath, databases }) {
    return (
        <LeftNavPane>
            <LeftNavPaneItemBack path="/admin/permissions/data" />
            {databases && databases.map((database) => {
                 const path = "/admin/permissions/databases/" + database.id;
                 return (
                     <LeftNavPaneItem key={database.id} name={database.name} path={path} selected={currentPath.startsWith(path)} />
                 );
             })}
        </LeftNavPane>
    );
}

function DatabaseDetails({ location: { pathname }, databases }) {
    console.log('databases:', databases); // NOCOMMIT
    return (
        <Permissions leftNavPane={<NavPane databases={databases} currentPath={pathname} />}>
            Database Details go Here!
        </Permissions>
    );
}

export default DatabaseDetails;
