import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";

export const UserGuard = props => {
    let token = localStorage.getItem("token");
    if (token && token !== 'undefined' && token != null && token !== '') {
        return props.children;
    }
    return <Redirect to="/login"/>;
};

UserGuard.propTypes = {
    children: PropTypes.node
};