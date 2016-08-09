import React from "react";
import { Link } from "react-router";

import Icon from "metabase/components/Icon.jsx";
import Input from "metabase/components/Input.jsx";

import AdminContentTable from "./AdminContentTable.jsx";
import Permissions from "./Permissions.jsx";
import { LeftNavPane, LeftNavPaneItem, LeftNavPaneItemBack } from "./LeftNavPane.jsx";

// todo - make title + button properties of Permissions since several pages use it
function Title({ group }) {
    return (
        <section className="PageHeader clearfix">
            <Link to={"/admin/permissions/groups/" + group.id + "?addMember=true"}
                  className="Button Button--primary float-right">
                Add members
            </Link>
            <h2 className="PageTitle">
                {group.name}
            </h2>
        </section>
    );
}


function NavPane({ groups, currentPath }) {
    return (
        <LeftNavPane>
            <LeftNavPaneItemBack path="/admin/permissions/groups" />
            {groups && groups.map((group) => {
                 const path = "/admin/permissions/groups/" + group.id;
                 return (
                     <LeftNavPaneItem key={group.id} name={group.name} path={path} selected={currentPath.startsWith(path)} />
                 );
             })}
        </LeftNavPane>
    );
}

function AddMemberRow({ group }) {
    return (
        <tr className="bordered border-brand rounded">
            <td colSpan={2}>
                <Input className="AdminInput h3" type="text" placeholder="Julie McMemberson" />
            </td>
            <td className="text-right">
                <Link to={"/admin/permissions/groups/" + group.id}
                      className="link no-decoration cursor-pointer">
                    Cancel
                </Link>
                <span className="Button text-grey-2 ml2">
                      Done
                </span>
            </td>
        </tr>
    );
}


function MemberRow({ member }) {
    return (
        <tr>
            <td>{member.first_name + " " + member.last_name}</td>
            <td>{member.email}</td>
            <td className="text-right cursor-pointer" onClick={alert.bind(null, 'TODO: remove user!')}>
                <Icon name="close" className="text-grey-1" size={16} />
            </td>
        </tr>
    );
}

function MembersTable({ members, group, showAddMemberRow }) {
    return (
        <AdminContentTable columnTitles={["Members", "Email"]}>
            {showAddMemberRow ? (
                 <AddMemberRow group={group} />
             ) : null}
            {members && members.map((member, index) =>
                <MemberRow key={index} member={member} />
             )}
        </AdminContentTable>
    );
}


function DatabasesListItemTablesListItem({ table }) {
    return (
        <li className="my1">
            <Icon name="table2" size={16} className="mr1 text-grey-1" /> {table.name}
        </li>
    );
}

function DatabasesListItemTablesList({ tables }) {
    return (
        <ul>
            {tables && tables.map((table, index) =>
                <DatabasesListItemTablesListItem key={index} table={table} />
             )}
        </ul>
    );
}

function DatabasesListItem({ database, group }) {
    return (
        <div className="my4 py1">
            <Icon className="Icon text-grey-1" name="database" size={16} />
            <span className="mx2">
                {database.name ? database.name.toUpperCase() : null}
            </span>
            <div className="mt3 ml4">
                <div className="text-bold">
                    {database.unrestricted ? "Unrestricted" : "Some tables"}
                    <Link to={"/admin/permissions/databases/" + database.database_id + "/groups/" + group.id}
                          className="no-decoration mx2 link">
                        Change Settings
                    </Link>
                </div>
                <DatabasesListItemTablesList tables={database.tables} />
            </div>
        </div>
    );
}

function DatabasesList({ group, databases }) {
    return (
        <div className="mt4">
            <h2>
                What {group.name} Can See
            </h2>
            {databases && databases.map((database, index) =>
                <DatabasesListItem key={index} database={database} group={group} />
             )}
        </div>
    );
}


function GroupDetail({ location: { pathname, query }, group, groups }) {
    group = group || {};
    groups = groups || [];

    if (group && group.databases && group.databases.length) {
        group.databases[0].tables = [
            {name: "These", id: 1},
            {name: "Are", id: 2},
            {name: "Fake", id: 3}
        ];
    }

    return (
        <Permissions leftNavPane={<NavPane groups={groups} currentPath={pathname} />}>
            <Title group={group} />
            <MembersTable members={group.members} group={group} showAddMemberRow={query.addMember === "true"}/>
            <DatabasesList group={group} databases={group.databases} />
        </Permissions>
    );
}


export default GroupDetail;
