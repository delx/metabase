import React, { Component } from "react";
import { connect } from "react-redux";

import { getDatabases, getDatabaseDetails } from "../selectors";
import { fetchDatabases, fetchDatabaseDetails } from "../permissions";

import DatabaseDetails from "../components/DatabaseDetails.jsx";


function mapStateToProps(state, props) {
    return {
        databases: getDatabases(state, props),
        database: getDatabaseDetails(state, props)
    };
}

const mapDispatchToProps = {
    fetchDatabases,
    fetchDatabaseDetails
};

@connect(mapStateToProps, mapDispatchToProps)
export default class DatabaseDetailsApp extends Component {
    async componentWillMount() {
        await this.props.fetchDatabases();
        await this.props.fetchDatabaseDetails(this.props.routeParams.databaseID);
    }

    render() {
        return (
            <DatabaseDetails {...this.props} />
        );
    }
}
