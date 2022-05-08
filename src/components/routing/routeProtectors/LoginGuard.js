import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";
import Sidebar from "components/views/Sidebar";
import {api} from 'helpers/api';

export const LoginGuard = props => {

    // check if the token and the id match a user in the data base that is currently logged in
    async function isTokenUserOnline() {
        let token = localStorage.getItem("token");
        let id = localStorage.getItem("id");
        if (id && token && token !== 'undefined' && token != null && token !== '') {
            // call api to check if the token and id match a user in the database and logged in
            const response = await api.get(`/users/${id}`)
            console.log("checkToken response: ", response)
            console.log(response.data)
            if (response.data.token === token && response.data.status === "ONLINE") {
                return true;
            }
        }
        return false;
    }


    if (!isTokenUserOnline()) {
        return (
        <Sidebar view="login">
            {props.children}
        </Sidebar>
        );
    }
    // if user is already logged in, redirects to the main /app
    return <Redirect to="/game"/>;
};

LoginGuard.propTypes = {
    children: PropTypes.node
}