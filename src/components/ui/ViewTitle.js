import PropTypes from "prop-types";
import React from "react";

const ViewTitle = props => (
    <div className={"centerTop"}>
        <h1>{props.children}</h1>
    </div>
);

ViewTitle.propTypes = {
    children: PropTypes.node,
};

export default ViewTitle;