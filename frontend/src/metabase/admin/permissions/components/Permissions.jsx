import React from "react";

function PermissionsTitle() {
    return (
        <div className="MetadataEditor-header clearfix relative flex-no-shrink">
            <div className="MetadataEditor-headerSection float-left h2 text-grey-4">
                Permissions
            </div>
        </div>
    );
}

function Permissions({ leftNavPane, children }) {
    console.log('leftNavPane:', leftNavPane); // NOCOMMIT
    return (
        <div className="flex p4">
            <div className="MetadataEditor flex-column full-height">
                <PermissionsTitle />
                {leftNavPane}
            </div>
            <div className="flex-column flex-full m4">
                {children}
            </div>
        </div>
    );
}

export default Permissions;
