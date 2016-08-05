import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";

import AdminPermissions from "../components/AdminPermissions.jsx";

import { getGroups } from "../selectors";
import { fetchGroups } from "../permissions";

const mapStateToProps = function(state, props) {
    return {
        groups: getGroups(state, props),
        activeSection: props.params.section
    };
}

const mapDispatchToProps = {
    fetchGroups
};

@connect(mapStateToProps, mapDispatchToProps)
export default class AdminPermissionsApp extends Component {

    componentWillMount() {
        this._fetchData(this.props.activeSection);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.activeSection !== this.props.activeSection) {
            this._fetchData(newProps.activeSection);
        }
    }

    async _fetchData(activeSection) {
        console.log("fetch", activeSection)
        if (activeSection === "groups") {
            try {
                await this.props.fetchGroups();
            } catch (error) {
                console.error('Error loading groups:', error);
            }
        }
    }

    render() {
        return <AdminPermissions {...this.props} />;
    }
}
