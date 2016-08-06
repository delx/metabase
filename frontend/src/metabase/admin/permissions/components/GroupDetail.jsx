import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

import Permissions from "./Permissions.jsx";
import { LeftNavPaneItem, LeftNavPane } from "./LeftNavPane.jsx";

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

function MembersRow({member}) {
    return (
        <tr>
            <td>{member.name}</td>
            <td>{member.email}</td>
        </tr>
    );
}

const MembersList = ({members}) => {
    console.log('members:', members); // NOCOMMIT
    return (
        <table className="ContentTable">
            <thead>
                <tr>
                    <th>Members</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody>
                {members && members.map((member, index) =>
                    <MembersRow key={index} member={member} />
                 )}
            </tbody>
        </table>
    );
}

function NavPane({ groups, currentPath }) {
    console.log('currentPath', currentPath);
    return (
        <LeftNavPane>
            {groups && groups.map((group) => {
                 const path = "/admin/permissions/groups/" + group.id;
                 console.log('path', path);
                 return (
                     <LeftNavPaneItem key={group.id} name={group.name} path={path} selected={currentPath.startsWith(path)} />
                 );
             })}
        </LeftNavPane>
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

    return (
        <Permissions leftNavPane={<NavPane groups={groups} currentPath={pathname} />}>
            <Title />
            <MembersList members={members} />
        </Permissions>
    );
}


export default GroupDetail;
