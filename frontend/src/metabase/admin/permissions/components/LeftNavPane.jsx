import React from "react";
import { Link } from "react-router";

import cx from 'classnames';

function LeftNavPaneItem({ name, path, selected }) {
    return (
        <li>
            <Link to={path}
                  className={cx("AdminList-item flex align-center justify-between no-decoration", { selected: selected })} >
                {name}
            </Link>
        </li>
    );
}

function LeftNavPane({ children }) {
    return (
        <div className="MetadataEditor-main flex flex-row flex-full mt2">
            <div className="MetadataEditor-table-list AdminList flex-no-shrink">
                <ul className="AdminList-items pt1">
                    {children}
                </ul>
            </div>
        </div>
    );
}

export default LeftNavPaneItem;
export default LeftNavPane;
