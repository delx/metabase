import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

import cx from 'classnames';

const LeftNavPaneItem = ({ name, path, currentPath }) =>
    <li>
        <Link
            to={path}
            className={cx("AdminList-item flex align-center justify-between no-decoration", {
                selected: currentPath.startsWith(path)
            })}
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

const PermissionsTitle = () =>
    <div className="MetadataEditor-header clearfix relative flex-no-shrink">
        <div className="MetadataEditor-headerSection float-left h2 text-grey-4">
            Permissions
        </div>
    </div>

const Permissions = ({ location: { pathname }, groups, showGroupDetail, children }) =>
    <div className="flex flex-full p4">
        <div className="MetadataEditor flex-column full-height">
            <PermissionsTitle />
            <LeftNavPane>
                <LeftNavPaneItem name="Groups" path="/admin/permissions/groups" currentPath={pathname} />
                <LeftNavPaneItem name="Data" path="/admin/permissions/data" currentPath={pathname} />
            </LeftNavPane>
        </div>
        <div className="flex-column m4">
            {children}
        </div>
    </div>

export default Permissions;
