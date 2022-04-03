import React from "react";
import {ReactLogo} from "components/ui/ReactLogo";
import PropTypes from "prop-types";
import "styles/views/Header.scss";
import {Button} from "../ui/Button";
import {handleError} from "../../helpers/api";
import {useHistory} from 'react-router-dom';

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
            history.push('/registration')
        } catch (error){
            alert(`Failed to find Register Page: \n${handleError(error)}`);
        }
    };

    const goToLogin = async => {
        // do login instead of registration
        try{
            history.push('/login')
        } catch (error){
            alert(`Failed to find Login Page: \n${handleError(error)}`);
        }
    };

    if(!localStorage.getItem("token")){
        if(props.view=="login"){
            return     <div className="header container" style={{height:"100"}}>
                <h1 className="header title">Group 07 in SoPra FS22 rocks with React!</h1>
                <ReactLogo width="60px" height="60px"/>
                <div className="header button-container">
                    <Button
                            onClick={() => goToRegistration()}
                    >
                        Register Account
                    </Button>
                </div>
            </div>
        }
        if(props.view=="register"){
            return     <div className="header container" style={{height: "100"}}>
                <h1 className="header title">Group 07 in SoPra FS22 rocks with React!</h1>
                <ReactLogo width="60px" height="60px"/>
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
    else{
        return <div className="header container" style={{height:"100"}}>
            <h1 className="header title">Date Against Humanity</h1>
            {/* <ReactLogo width="60px" height="60px"/> */}
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
