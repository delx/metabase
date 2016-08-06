import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

import UserAvatar from "metabase/components/UserAvatar.jsx";

import AdminContentTable from "./AdminContentTable.jsx";
import Permissions from "./Permissions.jsx";
import TopLevelLeftNavPane from "./TopLevelLeftNavPane.jsx";

const Group = ({ group, index, showGroupDetail }) => {
    console.log('renderGroup(', group, ",", index, ')'); // NOCOMMIT

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
                3
            </td>
            <td>
                ...
            </td>
        </tr>
    );
}

function GroupsListing({ location: { pathname }, groups }) {
    return (
        <Permissions leftNavPane={<TopLevelLeftNavPane currentPath={pathname} />}>
            <AdminContentTable columnTitles={["Group name", "Members"]} >
                {groups && groups.map((group, index) =>
                    <Group key={group.id} group={group} index={index} />
                 )}
            </AdminContentTable>
        </Permissions>
    );
}

export default GroupsListing;
