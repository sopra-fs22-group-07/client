import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";
import Sidebar from "components/views/Sidebar";

export const UserGuard = props => {
    let token = localStorage.getItem("token");
    if (token && token !== 'undefined' && token != null && token !== '') {
        return (
            <Sidebar view="user">
            {props.children}
            </Sidebar>
        )
    }
    return <Redirect to="/login"/>;
};

UserGuard.propTypes = {
    children: PropTypes.node
};