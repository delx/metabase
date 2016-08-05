import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";

import Permissions from "../components/Permissions.jsx";

const mapStateToProps = function(state, props) {
    return {
    };
}

const mapDispatchToProps = {
};

@connect(mapStateToProps, mapDispatchToProps)
export default class PermissionsApp extends Component {
    render() {
        return <Permissions {...this.props} />;
    }
}
