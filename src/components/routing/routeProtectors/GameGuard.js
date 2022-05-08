import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";
import Sidebar from "components/views/Sidebar";
import {api} from 'helpers/api';

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


    // check if the token and the id match a user in the data base that is currently logged in
    async function isTokenUserOnline() {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("id");
        if (id && token && token !== 'undefined' && token != null && token !== '') {
            // call api to check if the token and id match a user in the database and logged in
            try {
                const response = await api.get(`/users/${id}`).then(res => {
                    console.log("response:")
                    console.log(response.data);
                    if ((response.data.token === token) && (response.data.status === "ONLINE")) {
                        console.log("user is online");
                        return true;
                    }
                });
            } catch (error) {
                console.log("user is not online");
                console.log(error);
                return false;
            }
        }
        return false;
    }

    if (isTokenUserOnline()) {
        console.log("a")
        return (
        <Sidebar view="game">
            {props.children}
        </Sidebar>
        );
    }
    console.log("b")
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    return <Redirect to="/login"/>;
};

GameGuard.propTypes = {
    children: PropTypes.node
};