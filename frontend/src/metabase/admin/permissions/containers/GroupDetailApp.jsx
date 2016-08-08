import React, { Component } from "react";
import { connect } from "react-redux";

import { getGroup, getGroups } from "../selectors";
import { fetchGroups, fetchGroupDetails } from "../permissions";

import GroupDetail from "../components/GroupDetail.jsx";

function mapStateToProps(state, props) {
    return {
        group: getGroup(state, props),
        groups: getGroups(state, props)
    };
}

const mapDispatchToProps = {
    fetchGroups,
    fetchGroupDetails
};

@connect(mapStateToProps, mapDispatchToProps)
export default class GroupDetailApp extends Component {
    async componentWillMount() {
        await this.props.fetchGroups();
        await this.props.fetchGroupDetails(this.props.routeParams.groupID);
    }

    render() {
        return <GroupDetail {...this.props} />;
    }
}
