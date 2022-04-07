import React, {useEffect, useState} from "react";
import Header from "./Header";
import {api, handleError} from 'helpers/api';
import BaseContainer from "../ui/BaseContainer";
import 'styles/views/UserPage.scss'
import User from "../../models/User";


const PlayerProfile = ({user}) =>(

    <div className="userPage container">
        <ul className="userPage player-info-container">Username: {user.username}</ul>
        <ul className="userPage player-info-container">Name: {user.name}</ul>
        <ul className="userPage player-info-container">Gender: {user.gender}</ul>
        <ul className="userPage player-info-container">Birthday: {user.birthday}</ul>

    </div>
)

const UserPage = () =>{
    const[user, setUser] = useState(null);

    useEffect(() => {

        async function getUser(){
            const id = localStorage.getItem("id")
            const response = await api.get('/users/'+id)
            const user = new User(response.data);
            console.log(response)
        }
        getUser()

    }, []);
    return(
        <React.Fragment>
            <Header view="userPage"/>
            <BaseContainer>
                <div className="userPage main-container">
                    <PlayerProfile user ={user}/>
                </div>
            </BaseContainer>
        </React.Fragment>
    )

}

export default UserPage