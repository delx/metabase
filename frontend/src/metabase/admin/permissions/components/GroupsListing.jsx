import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

import Icon from "metabase/components/Icon.jsx";
import PopoverWithTrigger from "metabase/components/PopoverWithTrigger.jsx";
import UserAvatar from "metabase/components/UserAvatar.jsx";

import AdminContentTable from "./AdminContentTable.jsx";
import Permissions from "./Permissions.jsx";
import TopLevelLeftNavPane from "./TopLevelLeftNavPane.jsx";

function editGroup(group) {
    alert('TODO: edit group: ' + group.id);
}

function removeGroup(group) {
    alert('TODO: remove group: ' + group.id);
}

function ActionsPopover({ group }) {
    return (
        <PopoverWithTrigger className="block"
                            triggerElement={<span className="text-grey-1"><Icon name={'ellipsis'}></Icon></span>}>
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

function Group({ group, index, showGroupDetail }) {
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

function GroupsListing({ location: { pathname }, groups }) {
    return (
        <Permissions leftNavPane={<TopLevelLeftNavPane currentPath={pathname} />}
                     rightTitleButtonTitle="Create a group"
                     rightTitleButtonLink="/admin/permissions/groups/create">
            <AdminContentTable columnTitles={["Group name", "Members"]} >
                {groups && groups.map((group, index) =>
                    <Group key={group.id} group={group} index={index} />
                 )}
            </AdminContentTable>
        </Permissions>
    );
}

export default GroupsListing;
