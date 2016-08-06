import React, { Component, PropTypes } from "react";

import Data from "../components/Data.jsx";

export default class DataApp extends Component {
    render() {
        return (
            <Data {...this.props} />
        );
    }
}
