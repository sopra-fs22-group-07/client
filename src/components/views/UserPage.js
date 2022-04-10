import React, {useEffect, useState} from "react";
import Header from "./Header";
import {api, handleError} from 'helpers/api';
import BaseContainer from "../ui/BaseContainer";
import 'styles/views/UserPage.scss'
import CardButton from "../ui/CardButton";
import {useHistory} from "react-router-dom";


const PlayerProfile = ({user}) =>(
    <div className="userPage container">
        <ul className="userPage player-info-container">Username: {user.username}</ul>
        <ul className="userPage player-info-container">Name: {user.name}</ul>
        <ul className="userPage player-info-container">Gender: {user.gender}</ul>
        <ul className="userPage player-info-container">Birthday: {displayDate(user.birthday)}</ul>
    </div>
)
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
                const response = await api.get(`/games/${id}/blackCard`)
                setBlackCard(response.data)
            } catch (error) {
                console.error("Details:", error);
            }
        }
        getBlackCard()
    }, [])

    let profile = (
        <div className="userPage container">
            <ul className="userPage player-info-container">Username: username</ul>
            <ul className="userPage player-info-container">Name: name</ul>
            <ul className="userPage player-info-container">Gender: gender</ul>
            <ul className="userPage player-info-container">Birthday: birthday</ul>
        </div>
    )

    if(user){
        profile  = (
            <PlayerProfile user={user}/>
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
        card = <CardButton className={"card blackCard"}
                           disabled={true}
                           >
            {blackCard.text}
        </CardButton>
    }

    return(
        <React.Fragment>
            <Header view="userPage"/>
            <BaseContainer className="userPage">
                <div className="userPage card-container">
                    {card}
                </div>
                <div className="userPage main-container">
                    {profile}
                    <div className="userPage button-container">
                        <Button
                            onClick={() => edit()}
                        >
                            Edit
                        </Button>
                    </div>
                </div>
            </BaseContainer>
        </React.Fragment>
    )

}

export default UserPage