import React, {useEffect, useState} from "react";
import Header from "./Header";
import {api, handleError} from 'helpers/api';
import BaseContainer from "../ui/BaseContainer";
import 'styles/views/UserPage.scss'
import {Button} from "../ui/Button";
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
    const history = useHistory();
    const[user, setUser] = useState(null);

    useEffect(() => {
        async function getUser(){
            console.log("Token in Userpage:"+localStorage.getItem("token"))
            const id = localStorage.getItem("id")
            const response = await api.get('/users/'+id)
            setUser(response.data);
            console.log(response)
        }
        getUser()
    },);
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

    const edit = async () =>{
        try {
            history.push('/users/id/edit')
        }catch (error) {
            alert(`Something went wrong while navigating to the game menu: \n${handleError(error)}`);
        }
    }

    return(
        <React.Fragment>
            <Header view="userPage"/>
            <BaseContainer>
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