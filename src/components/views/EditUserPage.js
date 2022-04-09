import React, {useEffect, useState} from "react";
import Header from "./Header";
import {api, handleError} from 'helpers/api';
import BaseContainer from "../ui/BaseContainer";
import 'styles/views/UserPage.scss'
import {Button} from "../ui/Button";
import {useHistory} from "react-router-dom";


const PlayerProfile = ({user}) =>(
    <div className="userPage container">
        <ul className="userPage player-info-container">Set New Username</ul>
        <ul className="userPage player-info-container">Gender:Gender</ul>
    </div>
)


const EditUserPage = () =>{
    const history = useHistory();
    const[user, setUser] = useState(null)
    const [gender, setGender] = useState(null)
    const [username, setUsername] = useState(null)

    useEffect(() => {

        async function editUser(){
            const id = localStorage.getItem("id")
            const response = await api.get('/users/'+id)
            setGender(response.data.gender)
            setUsername(response.data.gender)
            console.log(response)
        }
        editUser()
    },[]);


    let editprofile  = (
            <PlayerProfile user={user}/>
        )

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
                    {editprofile}
                    {/*
                    <div className="userPage button-container">
                        <Button
                            onClick={() => edit()}
                        >
                            Edit
                        </Button>
                    </div>*/}
                </div>

            </BaseContainer>
        </React.Fragment>
    )

}

export default EditUserPage