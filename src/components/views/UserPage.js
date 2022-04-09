import React, {useEffect, useState} from "react";
import Header from "./Header";
import {api} from 'helpers/api';
import BaseContainer from "../ui/BaseContainer";
import 'styles/views/UserPage.scss'


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
    const[user, setUser] = useState(null);

    useEffect(() => {

        async function getUser(){
            const id = localStorage.getItem("id")
            const response = await api.get('/users/'+id,
                {
                    headers: {
                        authorization: localStorage.getItem("token")
                    }
                })
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

    return(
        <React.Fragment>
            <Header view="userPage"/>
            <BaseContainer>
                <div className="userPage main-container">
                    {profile}
                </div>
            </BaseContainer>
        </React.Fragment>
    )

}

export default UserPage