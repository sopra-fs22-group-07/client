import React, {useEffect, useState} from "react";
import BaseContainer from "../ui/BaseContainer";
import {Button} from "../ui/Button";
import {useHistory} from "react-router-dom";
import {api, handleError} from "../../helpers/api";
import 'styles/views/LoginRegistration.scss'
import Slider from "@mui/material/Slider";


/*
Edit User Preferences Page
 */
const EditUserPreferencePage = () =>{
    const id = localStorage.getItem("id")

    const history = useHistory();

    const [agePreference, setAgePreference] = useState([20, 37]) //TODO: set as current age preference
    const [user, setUser] = useState(null)
    const [genderPreference, setGenderPreference] = useState(null)

    useEffect(() => {
        async function getUser(){
            try{
                const response = await api.get('/users/'+id)
                setUser(response.data);
                setAgePreference([response.data.minAge, response.data.maxAge])
            } catch (error) {
                console.error("Details:", error);
                alert("Invalid Input:\n " + handleError(error));
            }
        }
        getUser()
    }, []);



    const handleChange = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (activeThumb === 0) {
            setAgePreference([Math.min(newValue[0], agePreference[1]), agePreference[1]]);
        } else {
            setAgePreference([agePreference[0], Math.max(newValue[1], agePreference[0])]);
        }
    };


    let editPreferences = (
        <div className="login form">
            <h2 className="login title"> Set Preferences </h2>
            <div className="login container-title">Edit Age Preferences:</div>
            <Slider
                value={agePreference}
                onChange={handleChange}
                valueLabelDisplay="auto"
                min={18}
                max={99}
                disableSwap
            />
            <div className="login container-title">Edit Gender Preferences:</div>

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
            let minAge = 30
            let maxAge = 52
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
            <BaseContainer>
                <div className="login container">
                    {editPreferences}
                </div>
            </BaseContainer>
        </React.Fragment>
    )
}

export default EditUserPreferencePage