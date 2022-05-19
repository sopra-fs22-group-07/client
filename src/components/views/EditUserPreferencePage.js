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
    const [distance, setDistance] = useState(1)
    const [maxRange, setMaxRange] = useState(1)
    const [genderPreference, setGenderPreference] = React.useState({
        MALE: false,
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
                setMaxRange(response.data.maxRange)
                setDistance(convertMaxRangeToDistance(response.data.maxRange))
            } catch (error) {
                console.error("Details:", error);
                alert("Invalid Input:\n " + handleError(error));
            }
        }
        getPreferences()
    }, []);


    //Method to change the age for ageRangeslider
    const handleChangeAge = (_event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (activeThumb === 0) {
            setAgePreference([Math.min(newValue[0], agePreference[1]), agePreference[1]]);
        } else {
            setAgePreference([agePreference[0], Math.max(newValue[1], agePreference[0])]);
        }
    };

    //Method to changes distances for distance range slider
    const handleChangeDistance = (_event, newValue) => {
        setDistance(newValue);
        if(scale(newValue)>1000){setMaxRange(Math.floor(scale(newValue)/1000)*1000)}
        else{setMaxRange(scale(newValue))}
    };

    const convertMaxRangeToDistance = (maxRange) =>{
        if(maxRange <= 10){
            return maxRange
        }
        if(maxRange <= 100){
            return ((maxRange-10)/9) + 9
        }
        if(maxRange <= 1000){
            return ((maxRange-100)/90) + 18
        }
        else{
            return ((maxRange-1000)/2210) + 27
        }
    }

    const distanceMarks = [
        {
            value: 0,
            scaledValue: 1,
            label: "1km"
        },
        {
            value: 9,
            scaledValue: 10,
            label: "10km"
        },
        {
            value: 18,
            scaledValue: 100,
            label: "100km"
        },
        {
            value: 27,
            scaledValue: 1000,
            label: "1000km"
        },
        {
            value: 36,
            scaledValue: 20008,
            label: "20000Km"
        }
    ];

    const scale = (distance) => {
        const previousMarkIndex = Math.floor(distance / 9);
        const previousMark = distanceMarks[previousMarkIndex];
        const remainder = distance % 9;
        if (remainder === 0) {
            return previousMark.scaledValue;
        }
        const nextMark = distanceMarks[previousMarkIndex + 1];
        const increment = (nextMark.scaledValue - previousMark.scaledValue) /9;
        return remainder * increment + previousMark.scaledValue;
    };

    function numFormatter(num) {
        if(num > 1000){
            return Math.floor((num/1000))*1000 + "km"
        }
        return num.toFixed(0) + "km"; // if value < 1000, nothing to do

    }

    //Method to handle changes for the checkboxes gender
    const handleChangeGender = (event) => {
        setGenderPreference({
            ...genderPreference,
            [event.target.name]: event.target.checked,
        });
    };


    let editPreferences = (
        <div className="login form">
            <h2 className="userPage title"> Set Preferences </h2>
            <div className="userPage container-title">Edit Age Preferences:
            <Slider
                value={agePreference}
                onChange={handleChangeAge}
                valueLabelDisplay="auto"
                min={18}
                max={110}
                disableSwap
            />
                <p className="userPage container-text">Mininum Age: {agePreference[0]} - Maximum Age: {agePreference[1]}</p></div>
            <div className="userPage container-title">Edit Gender Preferences:

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
            </FormControl></div>

            <div className="userPage container-title">Edit Distance</div>
            <Slider
                style={{ maxWidth: 500 }}
                value={distance}
                min={0}
                step={1}
                max={36}
                valueLabelFormat={numFormatter}
                marks={distanceMarks}
                scale={scale}
                onChange={handleChangeDistance}
                valueLabelDisplay="auto"
                aria-labelledby="non-linear-slider"
            />
            Maximum Range: {numFormatter(maxRange)}
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
            const requestBody = JSON.stringify({minAge, maxAge, genderPreferences: genderPreferences, maxRange})
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