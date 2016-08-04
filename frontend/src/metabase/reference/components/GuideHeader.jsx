import React, { Component, PropTypes } from "react";
import pure from "recompose/pure";

import S from "./GuideHeader.css";

const GuideHeader = ({
    startEditing
}) =>
    <div className={S.guideHeader}>
        <span className={S.guideHeaderTitle}>Understanding our data</span>
    </div>;
GuideHeader.propTypes = {
    startEditing: PropTypes.func.isRequired
};

export default pure(GuideHeader);
