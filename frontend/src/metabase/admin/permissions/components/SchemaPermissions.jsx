import React, { Component } from "react";
import { Link } from "react-router";

import _ from "underscore";

import AdminContentTable from "./AdminContentTable.jsx";
import DatabasesLeftNavPane from "./DatabasesLeftNavPane.jsx";
import DatabaseGroupSelector from "./DatabaseGroupSelector.jsx";
import Permissions from "./Permissions.jsx";

// ------------------------------------------------------------ Breadcrumbs ------------------------------------------------------------

function Breadcrumb({ database, groupID, schema }) {
    return (
        <div className="py4 h3 text-bold">
            <Link to={"/admin/permissions/databases/" + database.id + "/groups/" + groupID} className="link no-decoration">
                {database.name}
                <span className="mx2">
                    &gt;
                </span>
            </Link>
            {schema}
        </div>
    );
}


// ------------------------------------------------------------ Tables Table ------------------------------------------------------------

function TablesTableRow({ table }) {
    return (
        <tr>
            <td>
                {table.name}
            </td>
        </tr>
    );
}

function TablesTable({ tables }) {
    return (
        <AdminContentTable columnTitles={["Accessible tables"]}>
            {tables && tables.map((table, index) =>
                <TablesTableRow key={index} table={table} />
             )}
        </AdminContentTable>
    );
}


// ------------------------------------------------------------ Logic ------------------------------------------------------------

export default class SchemaPermssions extends Component {
    render() {
        let { location: { pathname }, params: { databaseID, groupID, schema}, databases, groups, databasePermissions } = this.props;

        if (databaseID) databaseID = Number.parseInt(databaseID);
        if (groupID)    groupID    = Number.parseInt(groupID);

        const database = _.findWhere(databases, {id: databaseID}) || {};

        console.log("databaseID:", databaseID); // NOCOMMIT
        console.log("databases:", databases); // NOCOMMIT
        console.log("database:", database); // NOCOMMIT

        const tables = [
            {name: "These", id: 1},
            {name: "Are", id: 2},
            {name: "Fake", id: 3}
        ];

        return (
            <Permissions leftNavPane={<DatabasesLeftNavPane databases={databases} currentPath={pathname} />}>
                <DatabaseGroupSelector groups={groups} selectedGroupID={groupID} databaseID={databaseID} />
                <Breadcrumb database={database} groupID={groupID} schema={schema} />
                <TablesTable tables={tables} />
            </Permissions>
        );
    }
}
