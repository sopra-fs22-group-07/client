import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";
import Sidebar from "components/views/Sidebar";
import { isTokenUserOnline } from "helpers/isTokenUserOnline";

/**
 * routeProtectors interfaces can tell the router whether or not it should allow navigation to a requested route.
 * They are functional components. Based on the props passed, a route gets rendered.
 * In this case, if the user is authenticated (i.e., a token is stored in the local storage)
 * {props.children} are rendered --> The content inside the <GameGuard> in the App.js file, i.e. the user is able to access the main app.
 * If the user isn't authenticated, the components redirects to the /login screen
 * @Guard
 * @param props
 */
export const GameGuard = props => {

    // if the user is online, render all game routes
    const isUserOnline = isTokenUserOnline();
    console.log("isUserOnline: " + isUserOnline);

    if (isUserOnline) {
        return (
        <Sidebar view="game">
            {props.children}
        </Sidebar>
        );
    } else {
        // else, redirect to the login screen and remove the token and id from the local storage
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        return <Redirect to="/login"/>;
    }
};

GameGuard.propTypes = {
    children: PropTypes.node
};