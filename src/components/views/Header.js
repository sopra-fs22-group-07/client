import React from "react";
import PropTypes from "prop-types";
import "styles/views/Header.scss";
import {Button} from "../ui/Button";
import {api, handleError} from "../../helpers/api";
import {useHistory} from 'react-router-dom';
import {ProfilePageLogo} from "../ui/ProfilePageLogo";

/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://reactjs.org/docs/components-and-props.html
 * @FunctionalComponent
 */

function Header(props){
    const history = useHistory();

    const goToRegistration = async () => {
        // do Registration instead of login
        try{
            localStorage.removeItem('errorMessage');
            history.push('/registration')
        } catch (error){
            alert(`Failed to find Register Page: \n${handleError(error)}`);
        }
    };

    const goToLogin = async () => {
        // do log in instead of registration
        try{
            localStorage.removeItem('errorMessage');
            history.push('/login')
        } catch (error){
            alert(`Failed to find Login Page: \n${handleError(error)}`);
        }
    };

    const goToGameMenu = async () =>{
        try {
            history.push('/game')
        }catch (error) {
            alert(`Something went wrong while navigating to the game menu: \n${handleError(error)}`);
        }
    }

    async function logout() {
        try {
            const requestBody = ""

            await api.put(`/users/logout/${localStorage.getItem('id')}`,
                requestBody);

        } catch (error) {
            alert(`Something went wrong during the logout: \n${handleError(error)}`);
        }
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        history.push('/login');
    }

    function goToUserPage() {
        try {
            history.push(`/users/${localStorage.getItem("id")}`)
        }catch (error) {
            alert(`Something went wrong while trying to access your profile: \n${handleError(error)}`);
        }
    }

    if(!localStorage.getItem("token")){
        if(props.view==="login"){
            return     <div className="header container">
                <h1 className="header title">Date Against Humanity</h1>
                <div className="header button-container">
                    <Button
                            onClick={() => goToRegistration()}
                    >
                        Register Account
                    </Button>
                </div>
            </div>
        }
        if(props.view==="register"){
            return     <div className="header container">
                <h1 className="header title">Date Against Humanity</h1>
                <div className="header button-container">
                <Button
                    onClick={() => goToLogin()}
                >
                    Go to Login
                </Button>
                </div>
            </div>
        }
    }
    if(props.view==="userPage"){
        return <div className="header container">
            <h1 className="header title">Date Against Humanity</h1>
            <div className="header button-container">
                <Button
                    onClick={() => logout()}
                >
                    Logout
                </Button>
            </div>
            <div className="header button-container-gameMenu">
                <Button
                    onClick={() => goToGameMenu()}
                >
                    Menu
                </Button>
            </div>
        </div>
    }
    else{
        return <div className="header container">
            <h1 className="header title">Date Against Humanity</h1>
            <div className="header button-container">
                <Button
                    onClick={() => logout()}
                >
                    Logout
                </Button>
            </div>
            <div className="header button-container profile">
                <Button
                    onClick={() => goToUserPage()}
                    >
                    <ProfilePageLogo/>
                </Button>
            </div>
        </div>
    }
}

Header.propTypes = {
    view: PropTypes.string
};
/**
 * Don't forget to export your component!
 */
export default Header;
