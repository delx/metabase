import React, { Component } from "react";

import cx from 'classnames';

import AdminContentTable from "./AdminContentTable.jsx";
import DatabasesLeftNavPane from "./DatabasesLeftNavPane.jsx";
import DatabaseGroupSelector from "./DatabaseGroupSelector.jsx";
import Permissions from "./Permissions.jsx";


const OPTION = {
    UNRESTRICTED: "UNRESTRICTED",
    ALL_SCHEMAS: "ALL_SCHEMAS",
    SOME_SCHEMAS: "SOME_SCHEMAS",
    NO_ACCESS: "NO_ACCESS"
};

// ------------------------------------------------------------ Permissions Slider ------------------------------------------------------------

function PermissionsSliderChoice({ title, description, selected, onClick }) {
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

function PermissionsSlider({ selectedOption, onClickOption }) {
    return (
        <div className="my4">
            <h3 className="text-bold pb2">
                Permissions for this database
            </h3>
            <div className="flex flex-full full-width">
                <PermissionsSliderChoice title="Unrestricted" description="All schemas and SQL editor"
                                         selected={selectedOption === OPTION.UNRESTRICTED} onClick={onClickOption.bind(null, OPTION.UNRESTRICTED)}
                />
                <PermissionsSliderChoice title="All schemas" description="But no SQL editor"
                                         selected={selectedOption === OPTION.ALL_SCHEMAS} onClick={onClickOption.bind(null, OPTION.ALL_SCHEMAS)}
                />
                <PermissionsSliderChoice title="Some schemas" description="Only the ones you specify"
                                         selected={selectedOption === OPTION.SOME_SCHEMAS} onClick={onClickOption.bind(null, OPTION.SOME_SCHEMAS)}
                />
                <PermissionsSliderChoice title="No access" description="No schemas for you!"
                                         selected={selectedOption === OPTION.NO_ACCESS} onClick={onClickOption.bind(null, OPTION.NO_ACCESS)}
                />
            </div>
        </div>
    );
}


// ------------------------------------------------------------ Schemas Table ------------------------------------------------------------

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
    console.log("schemas:", schemas); // NOCOMMIT
    return (
        <AdminContentTable columnTitles={["Accessible schemas", "Table permissions"]}>
            {schemas && schemas.map((schema, index) =>
                <SchemasTableRow key={index} schema={schema} />
             )}
        </AdminContentTable>
    );
}


// ------------------------------------------------------------ Logic ------------------------------------------------------------

export default class DatabaseGroupDetails extends Component {

    onClickOption(newOption) {
        console.log("onClickOption(", newOption, ")"); // NOCOMMIT
    }

    render() {
        let { location: { pathname }, databases, databasePermissions, groups } = this.props;

        const perms = databasePermissions || {};
        console.log("perms:", perms); // NOCOMMIT

        const nativeQueryPerms = perms.native_query_write_access;
        const unrestrictedSchemaPerms = perms.unrestricted_schema_access;

        const permsOption = (nativeQueryPerms && unrestrictedSchemaPerms) ? OPTION.UNRESTRICTED :
                            unrestrictedSchemaPerms                       ? OPTION.ALL_SCHEMAS  :
                            (perms.schemas && perms.schemas.length)       ? OPTION.SOME_SCHEMAS :
                                                                            OPTION.NO_ACCESS;     // TODO - only count schemas where schema.access !== null

        return (
            <Permissions leftNavPane={<DatabasesLeftNavPane databases={databases} currentPath={pathname} />}>
                <DatabaseGroupSelector groups={groups} selectedGroupID={perms.group_id} databaseID={perms.database_id} />
                <PermissionsSlider selectedOption={permsOption} onClickOption={this.onClickOption.bind(this)} />
                <SchemasTable schemas={perms.schemas} />
            </Permissions>
        );
    }
}
