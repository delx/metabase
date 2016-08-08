import React from "react";
import { Link } from "react-router";

import Tooltip from "metabase/components/Tooltip.jsx";
import UserAvatar from "metabase/components/UserAvatar.jsx";

import AdminContentTable from "./AdminContentTable.jsx";
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

function SchemaItemGroupItem({ databaseID, group, database, color }) {
    console.log('group:', group); // NOCOMMIT
    if (!group.access) return null;
    return (
        <Tooltip tooltip={group.name + " — " + group.access}>
            <Link to={"/admin/permissions/databases/" + database.id + "/groups/" + group.id}>
                <span className="text-white inline-block mx1">
                    <UserAvatar background={color} user={{first_name: group.name}} />
                </span>
            </Link>
        </Tooltip>
    );
}

function SchemaItemGroups({ groups, database }) {
    const COLORS = ['bg-error', 'bg-purple', 'bg-brand', 'bg-gold', 'bg-green'];
    return (
        <div>
            {groups && groups.map((group, index) =>
                <SchemaItemGroupItem key={index} group={group} database={database} color={COLORS[(index % COLORS.length)]} />
             )}
        </div>
    );
}

function SchemaItem({ schema, database }) {
    return (
        <tr>
            <td>{schema.name}</td>
            <td><SchemaItemGroups groups={schema.groups} database={database} /></td>
        </tr>
    );
}

function SchemasTable({ schemas, database }) {
    return (
        <AdminContentTable columnTitles={["Schemas", "Groups that can view"]}>
            {schemas && schemas.map((schema, index) =>
                <SchemaItem key={index} schema={schema} database={database} />
             )}
        </AdminContentTable>
    );
}

function DatabaseDetails({ location: { pathname }, database, databases }) {
    database = database || {};
    databases = databases || [];

    console.log('database:', database); // NOCOMMIT
    console.log('databases:', databases); // NOCOMMIT

    return (
        <Permissions leftNavPane={<NavPane databases={databases} currentPath={pathname} />}>
            <SchemasTable schemas={database.schemas} database={database} />
        </Permissions>
    );
}

export default DatabaseDetails;
