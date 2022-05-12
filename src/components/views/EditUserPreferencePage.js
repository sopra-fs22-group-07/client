import React from "react";
import Header from "./Header";
import BaseContainer from "../ui/BaseContainer";
import {Button} from "../ui/Button";
import {useHistory} from "react-router-dom";
import {api, handleError} from "../../helpers/api";




/*
Edit User Preferences Page
 */
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

    const doEditPreferences = async () =>{
        try{
            let minAge = 18
            let maxAge = 2143
            let genderPreferences = ["OTHER"]
            const requestBody = JSON.stringify({minAge, maxAge, genderPreferences})
            await api.put(`/users/${id}/preferences`, requestBody);

            // Editing users preferences successfully worked --> navigate to the route /userprofile in the router
            history.push(`/users/${id}`);
        } catch (error) {
            alert(`Something went wrong while changing the User Preferences: \n${handleError(error)}`);
        }
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