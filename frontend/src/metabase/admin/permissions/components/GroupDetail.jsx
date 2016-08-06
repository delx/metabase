import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

import AdminContentTable from "./AdminContentTable.jsx";
import Permissions from "./Permissions.jsx";
import { LeftNavPane, LeftNavPaneItem, LeftNavPaneItemBack } from "./LeftNavPane.jsx";

// todo - make title + button properties of Permissions since several pages use it
function Title() {
    return (
        <section className="PageHeader clearfix">
            <Link to="/admin/permissions/groups" className="Button Button--primary float-right">Add someone to this group</Link>
            <h2 className="PageTitle">
                Marketing
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


function MembersItem({member}) {
    return (
        <tr>
            <td>{member.name}</td>
            <td>{member.email}</td>
        </tr>
    );
}

function MembersList({members}) {
    return (
        <AdminContentTable columnTitles={["Members", "Email"]}>
            {members && members.map((member, index) =>
                <MembersItem key={index} member={member} />
             )}
        </AdminContentTable>
    );
}


function DatabaseItemTableItem({table}) {
    return (
        <li className="my2">
            {table.name}
        </li>
    );
}

function DatabaseItemTablesList({tables}) {
    return (
        <ul>
            {tables && tables.map((table, index) =>
                <DatabaseItemTableItem key={index} table={table} />
             )}
        </ul>
    );
}

function DatabaseItem({database}) {
    return (
        <div className="my4 py1">
            <h4 className="my2">
                {database.name ? database.name.toUpperCase() : null}
            </h4>
            <div className="ml4">
                <div className="text-bold">
                    {database.unrestricted ? "Unrestricted" : "Some tables"}
                    <Link to={"/admin/permissions/groups/1/database/1"} className="no-decoration mx2 link">
                        Change Settings
                    </Link>
                </div>
                <DatabaseItemTablesList tables={database.tables} />
            </div>
        </div>
    );
}

function DatabasesList({databases}) {
    return (
        <div className="mt4">
            <h2>
                What Marketing Can See
            </h2>
            {databases && databases.map((database, index) =>
                <DatabaseItem key={index} database={database} />
             )}
        </div>
    );
}


function GroupDetail({ location: { pathname }, params }) {
    const members = [
        {name: "Cynthia Williams", email: "thamilton@topicblan.edu"},
        {name: "Tyler Burton", email: "spowell@photospace.biz"},
        {name: "Hannah Kelley", email: "tmatthews@cogibox.net"}
    ];

    const groups = [
        {name: "Admins", id: 1},
        {name: "Default Group", id: 2},
        {name: "Enterprise", id: 3},
        {name: "Execs", id: 4}
    ];

    const databases = [
        {name: "Sample Dataset", id: 1, unrestricted: true},
        {name: "Production DB", id: 2, unrestricted: false, tables: [
            {name: "Events", id: 1},
            {name: "Games", id: 2},
            {name: "Users", id: 3}
        ]}
    ];

    return (
        <Permissions leftNavPane={<NavPane groups={groups} currentPath={pathname} />}>
            <Title />
            <MembersList members={members} />
            <DatabasesList databases={databases} />
        </Permissions>
    );
}


export default GroupDetail;
