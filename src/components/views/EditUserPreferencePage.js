import React, {useEffect, useState} from "react";
import BaseContainer from "../ui/BaseContainer";
import {Button} from "../ui/Button";
import {useHistory} from "react-router-dom";
import {api, handleError} from "../../helpers/api";
import 'styles/views/LoginRegistration.scss'
import Slider from "@mui/material/Slider";
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';


/*
Edit User Preferences Page
 */
const EditUserPreferencePage = () =>{
    const id = localStorage.getItem("id")

    const history = useHistory();

    const [agePreference, setAgePreference] = useState([1,100])
    const [distance, setDistance] = useState([0,100])
    const [genderPreference, setGenderPreference] = React.useState({
        MALE: true,
        FEMALE: false,
        OTHER: false,
    });
    const { MALE, FEMALE, OTHER } = genderPreference;
    const noGenderSelectedError = [MALE, FEMALE, OTHER].filter((v) => v).length === 0;


    //Gets all the preferences of the user
    useEffect(() => {
        async function getPreferences(){
            try{
                const response = await api.get('/users/'+id)
                setGenderPreference({
                    MALE: response.data.genderPreferences.includes("MALE"),
                    FEMALE: response.data.genderPreferences.includes("FEMALE"),
                    OTHER: response.data.genderPreferences.includes("OTHER"),
                })
                setAgePreference([response.data.minAge, response.data.maxAge])
                //TODO: Add distance preferences for the user when GeoLocation API gets installed
            } catch (error) {
                console.error("Details:", error);
                alert("Invalid Input:\n " + handleError(error));
            }
        }
        getPreferences()
    }, []);


    //Method to change the age for ageRangeslider
    const handleChangeAge = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (activeThumb === 0) {
            setAgePreference([Math.min(newValue[0], agePreference[1]), agePreference[1]]);
            console.log(agePreference)
        } else {
            setAgePreference([agePreference[0], Math.max(newValue[1], agePreference[0])]);
            console.log(agePreference)
        }
    };

    //Method to changes distances for distance range slider
    const handleChangeDistance = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (activeThumb === 0) {
            setDistance([Math.min(newValue[0], distance[1]), distance[1]]);
            console.log(distance)
        } else {
            setDistance([distance[0], Math.max(newValue[1], distance[0])]);
            console.log(distance)
        }
    };

    //Method to handle changes for the checkboxes gender
    const handleChangeGender = (event) => {
        setGenderPreference({
            ...genderPreference,
            [event.target.name]: event.target.checked,
        });
    };


    let editPreferences = (
        <div className="login form">
            <h2 className="login title"> Set Preferences </h2>
            <div className="login container-title">Edit Age Preferences:</div>
            <Slider
                value={agePreference}
                onChange={handleChangeAge}
                valueLabelDisplay="auto"
                min={18}
                max={99}
                disableSwap
            />
                Mininum Age: {agePreference[0]} - Maximum Age: {agePreference[1]}
            <div className="login container-title">Edit Gender Preferences:</div>

            <FormControl
                required
                error={noGenderSelectedError}
            >
                <FormLabel component="legend">Pick at least 1</FormLabel>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox checked={MALE} onChange={handleChangeGender} name="MALE" />
                        }
                        label="Male"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox checked={FEMALE} onChange={handleChangeGender} name="FEMALE" />
                        }
                        label="Female"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox checked={OTHER} onChange={handleChangeGender} name="OTHER" />
                        }
                        label="Other"
                    />
                </FormGroup>
                <FormHelperText>Select at Least 1 Preference</FormHelperText>
            </FormControl>

            <div className="login container-title">Edit Distance</div>
            <Slider //TODO: Maybe add logarithmic scaling to the rangeslider
                value={distance}
                onChange={handleChangeDistance}
                valueLabelDisplay="auto"
                min={0}
                max={20000}
                disableSwap
            />
            {distance[0]} Km - {distance[1]} Km
            <div className= "userPage fixed-button-container">
                <div className= "userPage moving-button-container">
                    <Button
                        width="100%"
                        onClick={() => doEditPreferences()}
                        disabled={noGenderSelectedError}
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

    const createGenderPreferencesList = (gp) =>{
        let genderPreferenceList = []
        if(gp.MALE){genderPreferenceList.push("MALE")}
        if(gp.FEMALE){genderPreferenceList.push("FEMALE")}
        if(gp.OTHER){genderPreferenceList.push("OTHER")}
        return genderPreferenceList
    }

    const doEditPreferences = async () =>{
        try{
            const genderPreferences = createGenderPreferencesList(genderPreference)
            let minAge = agePreference[0]
            let maxAge = agePreference[1]
            const requestBody = JSON.stringify({minAge, maxAge, genderPreferences: genderPreferences})
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