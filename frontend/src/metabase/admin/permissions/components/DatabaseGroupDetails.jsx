import React, { Component } from "react";
import { Link } from "react-router";

import cx from 'classnames';

import { AngularResourceProxy } from "metabase/lib/redux";

import CheckBox from 'metabase/components/CheckBox.jsx';

import AdminContentTable from "./AdminContentTable.jsx";
import DatabasesLeftNavPane from "./DatabasesLeftNavPane.jsx";
import DatabaseGroupSelector from "./DatabaseGroupSelector.jsx";
import Permissions from "./Permissions.jsx";

const PermissionsAPI = new AngularResourceProxy("Permissions", ["updateDatabasePermissions"]);


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
                                         selected={selectedOption === "unrestricted"} onClick={onClickOption.bind(null, "unrestricted")}
                />
                <PermissionsSliderChoice title="All schemas" description="But no SQL editor"
                                         selected={selectedOption === "all_schemas"} onClick={onClickOption.bind(null, "all_schemas")}
                />
                <PermissionsSliderChoice title="Some schemas" description="Only the ones you specify"
                                         selected={selectedOption === "some_schemas"} onClick={onClickOption.bind(null, "some_schemas")}
                />
                <PermissionsSliderChoice title="No access" description="No schemas for you!"
                                         selected={selectedOption === "no_access"} onClick={onClickOption.bind(null, "no_access")}
                />
            </div>
        </div>
    );
}


// ------------------------------------------------------------ Schemas Table ------------------------------------------------------------

function SchemasTableRow({ perms, schema, editable, onSchemaToggled }) {
    return (
        <tr>
            <td>
                {editable ? (
                     <CheckBox className="inline-block mr2" checked={schema.access_type !== "no_access"} onChange={onSchemaToggled.bind(null, schema)}/>
                 ) : null}
                {schema.name}
            </td>
            <td>
                {schema.access_type === "all_tables" ? "All tables" :
                 schema.access_type === "some_tables" ? "Some tables" : "No access"}
            </td>
            <td>
                {editable ? (
                     <Link to={"/admin/permissions/databases/" + perms.database_id + "/groups/" + perms.group_id + "/schema/" + schema.name}
                           className="link text-bold no-decoraction"
                     >
                         Edit
                     </Link>
                 ) : null}
            </td>
        </tr>
    );
}

function SchemasTable({ perms, schemas, editable, onSchemaToggled }) {
    console.log("schemas:", schemas); // NOCOMMIT
    console.log("editable:", editable); // NOCOMMIT
    return (
        <AdminContentTable columnTitles={["Accessible schemas", "Table permissions"]}>
            {schemas && schemas.map((schema, index) =>
                <SchemasTableRow perms={perms} key={index} schema={schema} editable={editable} onSchemaToggled={onSchemaToggled} />
             )}
        </AdminContentTable>
    );
}


// ------------------------------------------------------------ Logic ------------------------------------------------------------

export default class DatabaseGroupDetails extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            databasePermissions: null
        };
    }

    onClickOption(newOption) {
        console.log("onClickOption(", newOption, ")"); // NOCOMMIT

        const perms = this.props.databasePermissions;

        PermissionsAPI.updateDatabasePermissions({groupID: perms.group_id, databaseID: perms.database_id, access_type: newOption}).then((function(newPerms) {
            this.setState({
                databasePermissions: newPerms
            });
        }).bind(this), function(error) {
            console.error("Error updating database permissions:", error);
        });
    }

    onSchemaToggled(schema) {
        console.log("onSchemaToggled(", schema, ")"); // NOCOMMIT
    }

    render() {
        let { location: { pathname }, databases, databasePermissions, groups } = this.props;

        const perms = this.state.databasePermissions || databasePermissions || {};
        console.log("perms:", perms); // NOCOMMIT

        const nativeQueryPerms = perms.native_query_write_access;
        const unrestrictedSchemaPerms = perms.unrestricted_schema_access;

        return (
            <Permissions leftNavPane={<DatabasesLeftNavPane databases={databases} currentPath={pathname} />}>
                <DatabaseGroupSelector groups={groups} selectedGroupID={perms.group_id} databaseID={perms.database_id} />
                <PermissionsSlider selectedOption={perms.access_type} onClickOption={this.onClickOption.bind(this)} />
                <SchemasTable perms={perms} schemas={perms.schemas} editable={perms.access_type === "some_schemas"} onSchemaToggled={this.onSchemaToggled.bind(this)} />
            </Permissions>
        );
    }
}
