import React, {useEffect, useState} from "react";
import Header from "./Header";
import {api, handleError} from 'helpers/api';
import BaseContainer from "../ui/BaseContainer";
import 'styles/views/UserPage.scss'
import 'styles/views/LoginRegistration.scss';
import CardButton from "../ui/CardButton";
import {useHistory} from "react-router-dom";
import {Button} from "../ui/Button";

/**
const PlayerProfile = ({user}) =>(
    <div>
    <div className="userPage container">
        <ul className="userPage player-info-container">Username: {user.username}</ul>
        <ul className="userPage player-info-container">Name: {user.name}</ul>
        <ul className="userPage player-info-container">Gender: {user.gender}</ul>
        <ul className="userPage player-info-container">Birthday: {displayDate(user.birthday)}</ul>
    </div>
    <div className="userPage moving-button-container">
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
    const [blackCard, setBlackCard] = useState(null)

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

    // fetch black card of the user
    useEffect(() => {
        async function getBlackCard() {
            try {
                // if user has no black card yet, server should return null or something.
                const response = await api.get(`/users/${id}/games/blackCards/current`)
                setBlackCard(response.data)
            } catch (error) {
                console.error("Details:", error);
            }
        }
        getBlackCard()
    }, [])

    let profile = (
        <table className="userPage table">
            <div className="userPage player-info-container">Username: </div>
            <div className="userPage player-info-container">Name: </div>
            <div className="userPage player-info-container">Gender: </div>
            <div className="userPage player-info-container">Birthday: </div>
        </table>
    )

    if(user){
        profile  = (
            <div>
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
                        <tr>
                            <td colspan="2">
                                <Button
                                    className="invert"
                                    width="100%"
                                    onClick={() => goToEdit()}
                                >
                                    Edit Profile
                                </Button>
                            </td>
                        </tr>
                        <tr>
                            <td>&nbsp;</td>
                        </tr>
                        <tr className="userPage player-info-container">
                            <td colSpan="2">Do same for preferences</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }

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
    </CardButton>

    if(blackCard) {
        card =
                <CardButton className={"card blackCard"}
                   disabled={true}
                   >
                   {blackCard.text}
                </CardButton>
    }

    const goToEdit = async () =>{
        try {
            history.push(`/users/${id}/edit`)
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
            <Header view="userPage"/>
            <BaseContainer className="userPage main-container">
                <div className="userPage main-container">
                    <div className="userPage title"> Profile </div>
                    {profile}
                </div>
            </BaseContainer>
        </React.Fragment>
    )

}

export default UserPage