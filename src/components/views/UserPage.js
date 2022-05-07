import React, {useEffect, useState} from "react";
import Header from "./Header";
import {api, handleError} from 'helpers/api';
import BaseContainer from "../ui/BaseContainer";
import 'styles/views/UserPage.scss'
import 'styles/views/LoginRegistration.scss';
import {useHistory} from "react-router-dom";
import {Button} from "../ui/Button";


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


    let profile = (
        <div>
            <div className="userPage title"> Profile </div>
            <table className="userPage table">
                <tbody>
                <tr className="userPage player-info-container">
                    <td> Username: </td>
                    <td className="userPage td"> USERNAME </td>
                </tr>
                <tr className="userPage player-info-container">
                    <td> Name: </td>
                    <td className="userPage td"> NAME </td>
                </tr>
                <tr className="userPage player-info-container">
                    <td> Gender: </td>
                    <td className="userPage td"> GENDER </td>
                </tr>
                <tr className="userPage player-info-container">
                    <td> Birthday: </td>
                    <td className="userPage td"> BIRTHDAY </td>
                </tr>
                </tbody>
            </table>
            <div>
                <Button
                    className="invert"
                    width="100%"
                    onClick={() => goToEdit()}
                >
                    Edit Profile
                </Button>
            </div>
        </div>
    )


    if(user){
        profile  = (
            <div>
                <div className="userPage title"> Profile </div>
                <table className="userPage table">
                    <tbody>
                        <tr className="userPage player-info-container">
                            <td> Username: </td>
                            <td className="userPage td"> {user.username} </td>
                        </tr>
                        <tr className="userPage player-info-container">
                            <td> Name: </td>
                            <td className="userPage td"> {user.name} </td>
                        </tr>
                        <tr className="userPage player-info-container">
                            <td> Gender: </td>
                            <td className="userPage td"> {user.gender} </td>
                        </tr>
                        <tr className="userPage player-info-container">
                            <td> Birthday: </td>
                            <td className="userPage td"> {displayDate(user.birthday)} </td>
                        </tr>
                    </tbody>
                </table>
                <div>
                    <Button
                        className="invert"
                        width="100%"
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

    if(user){
        userPreferences = (
            <div>
                <div className="userPage title">Preferences</div>
                <table className="userPage table">
                    <tbody>
                    <tr className="userPage player-info-container">
                        <td> Age Preference:</td>
                        <td className="userPage td"> {user.minAge} Years - {user.maxAge} Years</td>
                    </tr>
                    <tr className="userPage player-info-container">
                        <td> Gender Preferences: </td>
                        <td className="userPage td"> {user.genderPreferences.join(', ')} </td>
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