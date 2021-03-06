import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";
import Sidebar from "components/ui/Sidebar";
import { isTokenUserOnline } from "helpers/isTokenUserOnline";

export const LoginGuard = props => {

    const isUserOnline = isTokenUserOnline();

    // if the user is not online, then render the login screen and registration screen
    if (!isUserOnline) {
        return (
        <Sidebar view="login">
            {props.children}
        </Sidebar>
        );
    } else {
        // if user is already logged in, redirects to the main /app
        return <Redirect to="/game"/>;
    }
};

LoginGuard.propTypes = {
    children: PropTypes.node
}