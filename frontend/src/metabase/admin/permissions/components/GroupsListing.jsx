import React, { Component } from "react";
import { Link, browserHistory } from "react-router";
import { push } from "react-router-redux";

import cx from "classnames";

import { AngularResourceProxy } from "metabase/lib/redux";
import { getStore } from 'metabase/store'

import Icon from "metabase/components/Icon.jsx";
import Input from "metabase/components/Input.jsx";
import PopoverWithTrigger from "metabase/components/PopoverWithTrigger.jsx";
import UserAvatar from "metabase/components/UserAvatar.jsx";

import AdminContentTable from "./AdminContentTable.jsx";
import Permissions from "./Permissions.jsx";
import TopLevelLeftNavPane from "./TopLevelLeftNavPane.jsx";


const PermissionsAPI = new AngularResourceProxy("Permissions", ["createGroup"]);

function editGroup(group) {
    alert('TODO: edit group: ' + group.id);
}

function removeGroup(group) {
    alert('TODO: remove group: ' + group.id);
}

function ActionsPopover({ group }) {
    return (
        <PopoverWithTrigger className="block" triggerElement={<Icon className="text-grey-1" name="ellipsis" />}>
            <ul className="UserActionsSelect">
                <li className="pt1 pb2 px2 bg-brand-hover text-white-hover cursor-pointer" onClick={editGroup.bind(null, group)}>
                    Edit Name
                </li>
                <li className="pt1 pb2 px2 bg-brand-hover text-white-hover cursor-pointer text-error" onClick={removeGroup.bind(null, group)}>
                    Remove Group
                </li>
            </ul>
        </PopoverWithTrigger>
    )
}

function createGroup(groupName) {
    PermissionsAPI.createGroup({name: groupName}).then(function() {
        const store = getStore(browserHistory);
        store.dispatch(push("/admin/permissions/groups"));
    }, function(error) {
        console.error('Error creating group:', error);
    });
}

class AddGroupRow extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            text: ""
        }
    }

    updateText(newText) {
        console.log('updateText!', newText); // NOCOMMIT
        this.setState({
            text: newText
        });
    }

    render() {
        const textIsValid = this.state.text && this.state.text.length;
        return (
            <tr className="bordered border-brand rounded">
                <td>
                    <Input className="AdminInput h3" type="text" placeholder="Justice League" onChange={(e) => this.updateText(e.target.value)} value={this.state.text} />
                </td>
                <td />
                <td className="text-right">
                    <Link to="/admin/permissions/groups/" className="link no-decoration cursor-pointer">
                        Cancel
                    </Link>
                    <button className={cx("Button ml2", {"Button--primary": textIsValid})} disabled={!textIsValid} onClick={() => createGroup(this.state.text)}>
                        Create
                    </button>
                </td>
            </tr>
        );
    }
}

function GroupRow({ group, index, showGroupDetail, showAddGroupRow }) {
    const COLORS = ['bg-error', 'bg-purple', 'bg-brand', 'bg-gold', 'bg-green'],
          color  = COLORS[(index % COLORS.length)];

    return (
        <tr>
            <td>
                <Link to={"/admin/permissions/groups/" + group.id} className="link no-decoration">
                    <span className="text-white inline-block">
                        <UserAvatar background={color} user={{first_name: group.name}} />
                    </span>
                    <span className="ml2 text-bold">
                        {group.name}
                    </span>
                </Link>
            </td>
            <td>
                {group.members}
            </td>
            <td className="text-right">
                <ActionsPopover group={group} />
            </td>
        </tr>
    );
}

function GroupsTable({ groups, showAddGroupRow }) {
    return (
        <AdminContentTable columnTitles={["Group name", "Members"]}>
            {showAddGroupRow ? (
                 <AddGroupRow />
             ) : null}
            {groups && groups.map((group, index) =>
                <GroupRow key={group.id} group={group} index={index} />
             )}
        </AdminContentTable>
    );
}

export default function GroupsListing({ location: { pathname, query }, groups }) {
    return (
        <Permissions leftNavPane={<TopLevelLeftNavPane currentPath={pathname} />}
                     rightTitleButtonTitle="Create a group"
                     rightTitleButtonLink="/admin/permissions/groups?addGroup=true">
            <GroupsTable groups={groups} showAddGroupRow={query.addGroup === "true" }/>
        </Permissions>
    );
}
