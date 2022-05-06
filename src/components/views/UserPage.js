import React, {useEffect, useState} from "react";
import Header from "./Header";
import {api, handleError} from 'helpers/api';
import BaseContainer from "../ui/BaseContainer";
import 'styles/views/UserPage.scss'
import CardButton from "../ui/CardButton";
import {useHistory} from "react-router-dom";
import {Button} from "../ui/Button";

/**
const PlayerProfile = ({user}) =>(
    <div>
    <div className="userPage container">
        <ul className="userPage player-info-container">Username: {user.username}</ul>l
        <ul className="userPage player-info-container">Name: {user.name}</ul>
        <ul className="userPage player-info-container">Gender: {user.gender}</ul>
        <ul className="userPage player-info-container">Birthday: {displayDate(user.birthday)}</ul>
    </div>
    <div className="userPage button-container">
        <Button className="userPage button"
                onClick={() => goToEdit()}
        >
            Edit Profile
        </Button>
    </div>
    </div>
)*/

const displayDate = (date) => {

    if(date){
        const dt = new Date(date);
        const day = dt.getDate(); //gets day of the month
        const month = dt.getMonth()+1; //month starts with jan = 0, so month + 1
        const year = dt.getFullYear();
        return day+"-"+month+"-"+year;
    }
    else{
        return "No Birthday Found";
    }
}

const UserPage = () =>{
    const id = localStorage.getItem("id")
    const history = useHistory()

    const[user, setUser] = useState(null);
    const[preferences, setPreferences] = useState(null);

    useEffect(() => {

        async function getUser(){
            try{
                const response = await api.get('/users/'+id)
                setUser(response.data);
                // console.log(response)
            } catch (error) {
                console.error("Details:", error);
                alert("Invalid Input:\n " + handleError(error));
            }
        }
        getUser()

    }, []);

    useEffect(() => {
        async function getPreferences(){
            try{
                const response = await api.get(`/users/${id}/preferences`)
                setPreferences(response.data)
                console.log(response.data)
                console.log(response.data.minAge)
                console.log(response.data.maxAge)
                console.log(response.data.genderPreferences.includes("MALE"))
            }catch (error){
                console.error("Details:", error);
                alert("Couldn't get user preferences" + handleError(error))
            }
        }
        getPreferences()

    }, [])

    let profile = (
        <div className="userPage container">
        <div>
            <ul className="userPage player-info-container">Username: </ul>
            <ul className="userPage player-info-container">Name: </ul>
            <ul className="userPage player-info-container">Gender: </ul>
            <ul className="userPage player-info-container">Birthday: </ul>
        </div>
            <div className="userPage button-container">
                <Button className="userPage button"
                        onClick={() => goToEdit()}
                >
                    Edit Profile
                </Button>
            </div>
        </div>
    )


    if(user){
        profile  = (
            <div className="userPage container" >
                    <ul className="userPage player-info-container">Username: {user.username}</ul>
                    <ul className="userPage player-info-container">Name: {user.name}</ul>
                    <ul className="userPage player-info-container">Gender: {user.gender}</ul>
                    <ul className="userPage player-info-container">Birthday: {displayDate(user.birthday)}</ul>
                <div className="userPage button-container">
                    <Button className="userPage button"
                            onClick={() => goToEdit()}
                    >
                        Edit Profile
                    </Button>
                </div>
            </div>
        )
    }

    let userPreferences = (
        <div>
            <div className="userPage title">Preferences</div>
            <table className="userPage table">
                <tbody>
                    <tr className="userPage player-info-container">
                        <td> Age Preference:</td>
                        <td className="userPage td"> minAge-maxAge </td>
                    </tr>
                    <tr className="userPage player-info-container">
                        <td> Gender Preferences: </td>
                        <td className="userPage td"> Preferred Gender(s) </td>
                    </tr>
                    <tr>
                        <td colSpan="2">
                            <Button
                                className="invert"
                                width="100%"
                                onClick={() => goToEdit()}
                            >
                                Edit Profile
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )

    if(preferences){
        userPreferences = (
            <div>
                <div className="userPage title">Preferences</div>
                <table className="userPage table">
                    <tbody>
                    <tr className="userPage player-info-container">
                        <td> Age Preference:</td>
                        <td className="userPage td"> {preferences.minAge} Years - {preferences.maxAge} Years</td>
                    </tr>
                    <tr className="userPage player-info-container">
                        <td> Gender Preferences: </td>
                        <td className="userPage td"> {preferences.genderPreferences.join(', ')} </td>
                    </tr>
                    </tbody>
                </table>
                <div>
                    <Button
                        className="invert"
                        width="100%"
                        onClick={() => goToEditPreferences()}
                    >
                        Edit Preferences
                    </Button>
                </div>
            </div>
        )
    }


    /** TODO: DELETE IF SURE WE DONT NEED THIS ANYMORE
    function goToChooseBlackCard() {
        // also push the state ( does not add functionality )
        history.push(`/game/select/blackCard`,
            {
                token: localStorage.getItem("token"),
                id: localStorage.getItem("id")
            })
    }

    let card = <CardButton className={"card whiteCard"}
                           onClick={() => goToChooseBlackCard()}
                           >
        You haven't selected a black Card yet, click here to choose one.
    </CardButton>*/

    const goToEdit = async () =>{
        try {
            history.push(`/users/${id}/edit/userinfo`)
        }catch (error) {
            alert(`Something went wrong while navigating to the game menu: \n${handleError(error)}`);
        }
    }

    const goToEditPreferences = async () =>{
        try {
            history.push(`/users/${id}/edit/preferences`)
        }catch (error) {
            alert(`Something went wrong while navigating to the game menu: \n${handleError(error)}`);
        }
    }

    let title = <div className="userPage title"> Please Choose a Black Card for the day</div>

    if(blackCard){
        title = <div className="userPage title"> Your Black Card:</div>
    }

    return(
        <React.Fragment>
            <Header view="somePage"/>
            <BaseContainer className="userPage main-container">

                <div className="userPage main-container">
                    {profile}
                </div>
                <div className="userPage main-container">
                    {userPreferences}
                </div>
            </BaseContainer>
        </React.Fragment>
    )

}

export default UserPage