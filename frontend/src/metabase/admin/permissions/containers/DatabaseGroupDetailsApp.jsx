import React, { Component } from "react";
import { connect } from "react-redux";

import { getDatabases, getDatabaseGroupDetails } from "../selectors";
import { fetchDatabases, fetchDatabaseGroupDetails } from "../permissions";

import DatabaseGroupDetails from "../components/DatabaseGroupDetails.jsx";


function mapStateToProps(state, props) {
    return {
        databases: getDatabases(state, props),
        databaseGroup: getDatabaseGroupDetails(state, props)
    };
}

const mapDispatchToProps = {
    fetchDatabases,
    fetchDatabaseGroupDetails
};


@connect(mapStateToProps, mapDispatchToProps)
export default class DatabaseGroupDetailsApp extends Component {
    async componentWillMount() {
        await this.props.fetchDatabases();
        await this.props.fetchDatabaseGroupDetails(this.props.routeParams.databaseID, this.props.routeParams.groupID);
    }

    render () {
        return (
            <DatabaseGroupDetails {...this.props} />
        );
    }
}
