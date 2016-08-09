import React from "react";

import cx from 'classnames';

import AdminContentTable from "./AdminContentTable.jsx";
import DatabasesLeftNavPane from "./DatabasesLeftNavPane.jsx";
import DatabaseGroupSelector from "./DatabaseGroupSelector.jsx";
import Permissions from "./Permissions.jsx";

function PermissionsSliderChoice({ title, description, selected , onClick }) {
    return (
        <div className={cx("p2 text-centered cursor-pointer", { "Button--primary": selected })}
             onClick={selected ? null : onClick}>
            <h3>
                {title}
            </h3>
            <div className="my1 text-grey-2">
                {description}
            </div>
        </div>
    );
}

function setUnrestrictedAccess(databasePermissionsID) {
    alert('TODO: setUnrestrictedAccess', databasePermissionsID);
}

function setAllSchemasAccess(databasePermissionsID) {
    alert('TODO: setAllSchemasAccess', databasePermissionsID);
}

function PermissionsSlider({ perms }) {
    return (
        <div className="my4">
            <h3 className="text-bold pb2">
                Permissions for this database
            </h3>
            <div className="flex flex-full full-width">
                <PermissionsSliderChoice title="Unrestricted" description="All schemas and SQL editor"
                                         selected={perms.native_query_write_access && perms.unrestricted_schema_access}
                                         onClick={setUnrestrictedAccess.bind(null, perms.id)} />
                <PermissionsSliderChoice title="All schemas" description="But no SQL editor"
                                         selected={!perms.native_query_write_access && perms.unrestricted_schema_access}
                                         onClick={setAllSchemasAccess.bind(null, perms.id)} />
                <PermissionsSliderChoice title="Some schemas" description="Only the ones you specify"
                                         selected={!perms.native_query_write_access && !perms.unrestricted_schema_access} />
                <PermissionsSliderChoice title="No access" description="No schemas for you!"
                                         selected={false} />
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


export default function DatabaseGroupDetails({ location: { pathname }, databases, databasePermissions, groups }) {
    databasePermissions = databasePermissions || {};
    console.log('perms:', databasePermissions); // NOCOMMIT

    return (
        <Permissions leftNavPane={<DatabasesLeftNavPane databases={databases} currentPath={pathname} />}>
            <DatabaseGroupSelector groups={groups} selectedGroupID={databasePermissions.group_id} databaseID={databasePermissions.database_id} />
            <PermissionsSlider perms={databasePermissions} />
            <SchemasTable schemas={databasePermissions.schemas} />
        </Permissions>
    );
}
