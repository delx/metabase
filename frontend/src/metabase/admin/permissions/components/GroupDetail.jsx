import React, { Component } from "react";
import { Link } from "react-router";

import _ from "underscore";
import cx from "classnames";

import Icon from "metabase/components/Icon.jsx";
import Input from "metabase/components/Input.jsx";
import Popover from "metabase/components/Popover.jsx";
import UserAvatar from "metabase/components/UserAvatar.jsx";

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

function addMember(groupID, user) {
    alert('TODO: add user ' + user.id + ' to group ' + groupID);
}

function AddMemberAutocompleteSuggestions({ groupID, users, selectedUserID }) {
    const COLORS = ['bg-error', 'bg-purple', 'bg-brand', 'bg-gold', 'bg-green'];
    console.log('users:', users);
    return (
        <Popover className="bordered" hasArrow={false} targetOffsetX={-100} targetOffsetY={2}>
            {users && users.map((user, index) => {
                 const color =  COLORS[(index % COLORS.length)];
                 return (
                     <div key={index} className="m2 cursor-pointer" onClick={() => addMember(groupID, user)}>
                         <span className="inline-block text-white mr2">
                             <UserAvatar background={color} user={user} />
                         </span>
                         <span className="h3">
                             {user.common_name}
                         </span>
                     </div>
                 );
             })}
        </Popover>
    );
}

function filterUsers(users, text) {
    console.log('filterUsers(', users, text, ')');

    if (!text || !text.length) return users;

    text = text.toLowerCase();
    return _.filter(users, (user) => user.common_name && user.common_name.toLowerCase().includes(text));
}

class AddMemberRow extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            text: "",
            suggestions: [],
            selectedUserID: null
        }
    }

    updateText(newText) {
        console.log('updateText!', newText);
        // TODO - autocomplete suggestions
        this.setState({
            text: newText
        });
    }

    render() {
        const validUserSelected = !!this.state.selectedUserID;
        const filteredUsers = filterUsers(this.props.users, this.state.text);
        return (
            <tr className="bordered border-brand rounded">
                <td>
                    <AddMemberAutocompleteSuggestions users={filteredUsers} groupID={this.props.group.id} />
                    <Input className="AdminInput h3" type="text" placeholder="Julie McMemberson" value={this.state.text}
                           onChange={(e) => this.updateText(e.target.value)} />
                </td>
                <td />
                <td className="text-right">
                    <Link to={"/admin/permissions/groups/" + this.props.group.id}
                          className="link no-decoration cursor-pointer">
                        Cancel
                    </Link>
                    <button className={cx("Button ml2", {"Button--primary": validUserSelected})} disabled={!validUserSelected}
                            onClick={() => addMember(this.props.group.id, this.state.text)}>
                        Done
                    </button>
                </td>
            </tr>
        );
    }
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

function MembersTable({ members, group, showAddMemberRow, users }) {
    return (
        <AdminContentTable columnTitles={["Members", "Email"]}>
            {showAddMemberRow ? (
                 <AddMemberRow group={group} users={users} />
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


function GroupDetail({ location: { pathname, query }, group, groups, users }) {
    group = group || {};
    groups = groups || [];
    users = users || [];

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
            <MembersTable members={group.members} group={group} showAddMemberRow={query.addMember === "true"} users={users} />
            <DatabasesList group={group} databases={group.databases} />
        </Permissions>
    );
}


export default GroupDetail;
