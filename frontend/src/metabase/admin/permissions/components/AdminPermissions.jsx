import React, { Component, PropTypes } from "react";

import cx from 'classnames';

import UserAvatar from "metabase/components/UserAvatar.jsx";

import { fetchGroups } from "../actions";

export default class AdminPermissions extends Component {

    constructor(props, context) {
        super(props, context);

        console.log('props:', props);

        this.state = {
            activeSection: props.activeSection || "Groups"
        };
    }

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        groups: PropTypes.array
    };

    async componentDidMount() {
        if (this.state.activeSection === "Groups") {
            try {
                await this.props.dispatch(fetchGroups());
            } catch (error) {
                console.error('Error loading groups:', error);
            }
        }
    }

    renderTitle() {
        return (
            <div className="MetadataEditor-header clearfix relative flex-no-shrink">
                <div className="MetadataEditor-headerSection float-left h2 text-grey-4">
                    Permissions
                </div>
            </div>
        );
    }

    renderLeftNavPaneItem(name) {
        return (
            <li key={name}>
                <a href={"/admin/permissions?section=" + name}
                   className={cx("AdminList-item flex align-center justify-between no-decoration", {selected: this.state && this.state.activeSection === name})}>
                    {name}
                </a>
            </li>
        );
    }

    renderLeftNavPane() {
        return (
            <div className="MetadataEditor-main flex flex-row flex-full mt2">
                <div className="MetadataEditor-table-list AdminList flex-no-shrink">
                    <ul className="AdminList-items pt1">
                        {this.renderLeftNavPaneItem("Groups")}
                        {this.renderLeftNavPaneItem("Data")}
                    </ul>
                </div>
            </div>
        );
    }

    renderData() {
        return (
            <h1>Data Goes Here!</h1>
        );
    }

    renderGroup(group, index) {
        console.log('renderGroup(', group, ",", index, ')'); // NOCOMMIT

        const COLORS = ['bg-error', 'bg-purple', 'bg-brand', 'bg-gold', 'bg-green'],
              color  = COLORS[(index % COLORS.length)]

        function showGroupDetail() {
            console.log('Show group detail:', group.id);
        }

        return (
            <div key={group.id} className="my4 cursor-pointer" onClick={showGroupDetail}>
                <span className="text-white inline-block">
                    <UserAvatar background={color} user={{first_name: group.name}} />
                </span>
                <span className="ml2 text-bold">
                    {group.name}
                </span>
             </div>
        );
    }

    renderGroups() {
        console.log('renderGroups', this.props); // NOCOMMIT
        if (!this.props.groups) return null;

        return this.props.groups.map(this.renderGroup);
    }

    renderBody() {
        switch (this.state.activeSection) {
            case "Groups": return this.renderGroups();
            case "Data":   return this.renderData();
        }
    }

    render() {
        return (
            <div className="flex flex-full p4">
                <div className="MetadataEditor flex-column full-height">
                    {this.renderTitle()}
                    {this.renderLeftNavPane()}
                </div>
                <div className="flex-column m4">
                    {this.renderBody()}
                </div>
            </div>
        );
    }
}
