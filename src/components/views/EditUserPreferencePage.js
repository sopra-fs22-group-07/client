
/*
Edit User Preferences Page
 */


import React from "react";
import Header from "./Header";
import BaseContainer from "../ui/BaseContainer";
import {Button} from "../ui/Button";
import {useHistory} from "react-router-dom";

const EditUserPreferencePage = () =>{
    const id = localStorage.getItem("id")

    const history = useHistory();



    let editPreferences = (
        <div className="login form">
            <h2 className="login title"> Set Preferences </h2>
            {/*TODO: Insert Prefences here*/}
            <div className= "userPage fixed-button-container">
                <div className= "userPage moving-button-container">
                    <Button
                        width="100%"
                        onClick={() => doEditPreferences()}
                    >
                        Save
                    </Button>
                </div>
                <div className= "userPage moving-button-container">
                    <Button
                        width="100%"
                        onClick={() => doCancel()}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    )

    function doEditPreferences(){
    }

    function doCancel() {
        history.push(`/users/${id}`)
    }


    return(
        <React.Fragment>
            <Header view="userPage"/>
            <BaseContainer>
                <div className="login container">
                    {editPreferences}
                </div>
            </BaseContainer>
        </React.Fragment>
    )
}

export default EditUserPreferencePage