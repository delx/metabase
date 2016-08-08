import React, { Component } from "react";
import { connect } from "react-redux";

import { getDatabases } from "../selectors";
import { fetchDatabases } from "../permissions";

import DatabaseDetails from "../components/DatabaseDetails.jsx";

function mapStateToProps(state, props) {
    return {
        databases: getDatabases(state, props)
    };
}

const mapDispatchToProps = {
    fetchDatabases
};

@connect(mapStateToProps, mapDispatchToProps)
export default class DatabaseDetailsApp extends Component {
    async componentWillMount() {
        await this.props.fetchDatabases();
    }

    render() {
        return (
            <DatabaseDetails {...this.props} />
        );
    }
}
