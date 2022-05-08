import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";
import Sidebar from "components/views/Sidebar";
import {api} from 'helpers/api';

export const UserGuard = props => {


    // check if the token and the id match a user in the data base that is currently logged in
    async function isTokenUserOnline() {
        let token = localStorage.getItem("token");
        let id = localStorage.getItem("id");
        if (id && token && token !== 'undefined' && token != null && token !== '') {
            // call api to check if the token and id match a user in the database and logged in
            const response = await api.get(`/users/${id}`)
            if (response.data.token === token && response.data.status === "ONLINE") {
                return true;
            }
        }
        return false;
    }

    if (isTokenUserOnline()) {
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