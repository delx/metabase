import React from "react";

import cx from 'classnames';

import AdminContentTable from "./AdminContentTable.jsx";
import DatabasesLeftNavPane from "./DatabasesLeftNavPane.jsx";
import Permissions from "./Permissions.jsx";

function PermissionsSliderChoice({ title, description, selected }) {
    return (
        <div className={cx("p2 text-centered cursor-pointer", { "Button--primary": selected })}
             onClick={alert.bind(null, "TODO - Set DB permissions!")}>
            <h3>
                {title}
            </h3>
            <div className="my1 text-grey-2">
                {description}
            </div>
        </div>
    );
}

function PermissionsSlider({ group }) {
    return (
        <div className="my4">
            <h3 className="text-bold pb2">
                Permissions for this database
            </h3>
            <div className="flex flex-full full-width">
                <PermissionsSliderChoice title="Unrestricted" description="All schemas and SQL editor" selected={true}/>
                <PermissionsSliderChoice title="All schemas" description="But no SQL editor" />
                <PermissionsSliderChoice title="Some schemas" description="Only the ones you specify" />
                <PermissionsSliderChoice title="No access" description="No schemas for you!" />
            </div>
        </div>
    );
}

function SchemasTableRow({ schema }) {
    return (
        <tr>
            <td>
                {schema.name}
            </td>
            <td>
                {schema.access}
            </td>
        </tr>
    );
}

function SchemasTable({ schemas }) {
    return (
        <AdminContentTable columnTitles={["Accessible schemas", "Table permissions"]}>
            {schemas && schemas.map((schema, index) =>
                <SchemasTableRow key={index} schema={schema} />
             )}
        </AdminContentTable>
    );
}


export default function DatabaseGroupDetails({ location: { pathname }, databases, databaseGroup }) {
    databaseGroup = databaseGroup || {};
    console.log('databaseGroup:', databaseGroup); // NOCOMMIT

    return (
        <Permissions leftNavPane={<DatabasesLeftNavPane databases={databases} currentPath={pathname} />}>
            <PermissionsSlider group={databaseGroup} />
            <SchemasTable schemas={databaseGroup.schemas} />
        </Permissions>
    );
}
