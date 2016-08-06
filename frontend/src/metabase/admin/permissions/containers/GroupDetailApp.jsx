import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";

import { } from "../selectors";
import { } from "../permissions";

import GroupDetail from "../components/GroupDetail.jsx";

const mapStateToProps = function(state, props) {
    return {
    };
}

const mapDispatchToProps = {
};

@connect(mapStateToProps, mapDispatchToProps)
export default class GroupDetailApp extends Component {
    render() {
        return <GroupDetail {...this.props} />;
    }
}
