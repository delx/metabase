import React from "react";
import { Link } from "react-router";

function PermissionsTitle({ buttonTitle, buttonLink }) {
    return (
        <div className="MetadataEditor-header clearfix flex-no-shrink">
            <div className="MetadataEditor-headerSection float-left h2 text-grey-4">
                Permissions
            </div>
            {buttonTitle && buttonLink ? (
                 <Link to={buttonLink} className="Button Button--primary float-right">
                     {buttonTitle}
                 </Link>
            ) : null}
        </div>
    );
}

function Permissions({ leftNavPane, children, rightTitleButtonTitle, rightTitleButtonLink }) {
    return (
        <div className="flex p4">
            <div className="MetadataEditor flex-column full-height">
                <PermissionsTitle buttonTitle={rightTitleButtonTitle} buttonLink={rightTitleButtonLink} />
                {leftNavPane}
            </div>
            <div className="flex-column flex-full m4">
                {children}
            </div>
        </div>
    );
}

export default Permissions;
