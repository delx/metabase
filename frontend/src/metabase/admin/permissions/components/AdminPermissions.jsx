import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

import cx from 'classnames';

import UserAvatar from "metabase/components/UserAvatar.jsx";

const LeftNavPaneItem = ({ name, section, activeSection }) =>
    <li>
        <Link
            to={"/admin/permissions/" + section}
            className={cx("AdminList-item flex align-center justify-between no-decoration", {selected: section === activeSection})}
        >
            {name}
        </Link>
    </li>

const LeftNavPane = ({ children }) =>
    <div className="MetadataEditor-main flex flex-row flex-full mt2">
        <div className="MetadataEditor-table-list AdminList flex-no-shrink">
            <ul className="AdminList-items pt1">
                {children}
            </ul>
        </div>
    </div>

const Groups = ({ groups }) =>
    <ul>
        {groups && groups.map((group, index) =>
            <Group key={group.id} group={group} index={index} />
        )}
    </ul>

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

const Data = () =>
    <h1>Data Goes Here!</h1>

const PermissionsTitle = () =>
    <div className="MetadataEditor-header clearfix relative flex-no-shrink">
        <div className="MetadataEditor-headerSection float-left h2 text-grey-4">
            Permissions
        </div>
    </div>

const AdminPermissions = ({ activeSection, groups, showGroupDetail }) =>
    <div className="flex flex-full p4">
        <div className="MetadataEditor flex-column full-height">
            <PermissionsTitle />
            <LeftNavPane>
                <LeftNavPaneItem name="Groups" section="groups" activeSection={activeSection} />
                <LeftNavPaneItem name="Data" section="data" activeSection={activeSection} />
            </LeftNavPane>
        </div>
        <div className="flex-column m4">
            { activeSection === "groups" ?
                <Groups groups={groups} showGroupDetail={showGroupDetail} />
            : activeSection === "data" ?
                <Data />
            : null }
        </div>
    </div>

export default AdminPermissions;
