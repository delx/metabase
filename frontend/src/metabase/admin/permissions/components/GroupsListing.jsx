import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

import Permissions from "../components/Permissions.jsx";
import TopLevelLeftNavPane from "../components/TopLevelLeftNavPane.jsx";
import UserAvatar from "metabase/components/UserAvatar.jsx";

const Group = ({ group, index, showGroupDetail }) => {
    console.log('renderGroup(', group, ",", index, ')'); // NOCOMMIT

    const COLORS = ['bg-error', 'bg-purple', 'bg-brand', 'bg-gold', 'bg-green'],
          color  = COLORS[(index % COLORS.length)]

    return (
        <Link to={"/admin/permissions/groups/" + group.id} className="block my4 no-decoration">
            <span className="text-white inline-block">
                <UserAvatar background={color} user={{first_name: group.name}} />
            </span>
            <span className="ml2 text-bold">
                {group.name}
            </span>
         </Link>
    );
}

function GroupsListing({ location: { pathname }, groups }) {
    const nav = (
        <TopLevelLeftNavPane currentPath={pathname} />
    );
    console.log('nav = ', nav);

    const x = (
        <div>
            HERE!
        </div>
    );
    console.log('x = ', x);

    return (
        <Permissions leftNavPane={nav}>
            <ul>
                {groups && groups.map((group, index) =>
                    <Group key={group.id} group={group} index={index} />
                 )}
            </ul>
        </Permissions>
    );
}

export default GroupsListing;
