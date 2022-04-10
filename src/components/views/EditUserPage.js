import React, {useEffect, useState} from "react";
import Header from "./Header";
import {api, handleError} from 'helpers/api';
import BaseContainer from "../ui/BaseContainer";
import 'styles/views/UserPage.scss'
import 'styles/views/Registration.scss'
import {Button} from "../ui/Button";
import {useHistory} from "react-router-dom";
import Select from "react-select";

/*
Edit User Info Page
 */

//To get input for the new username
const FormField = props => {
    return (
        <div className="registration field">
            <label>
                {props.label}
            </label>
            <input
                placeholder="New Username"
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
                type={props.type}
            />
        </div>
    );
};

//For the gender Picker
const genderOptions = [
    {value: 'MALE', label: 'Male'},
    {value:  'FEMALE', label: 'Female'},
    {value: 'OTHER', label: 'Other'}
]


const EditUserPage = () =>{
    const history = useHistory();
    const[user, setUser] = useState(null)
    const [gender, setGender] = useState(null)
    const [username, setUsername] = useState(null)

    useEffect(() => {
        //get the User (yourself) to display current name + gender
        async function getUser(){
            const id = localStorage.getItem("id")
            const response = await api.get('/users/'+id)
            setUser(response.data)
            setGender(user.gender)
            setUsername(user.gender)
            console.log(response)
        }
        getUser()
    },[]);


    //If the getUser is too slow, placeholder
    //Shouldn't get displayed, but otherwise <EditPlayerProfile> tries to render before user gets received
    let editProfile =  (
        <div>
            EditProfile: Please wait for USER
        </div>
    )
    //As soon as User(almost instantly) render correct EditPlayerProfile View
    if(user){
         editProfile  = (
             <div className="userPage container">
                 <ul className="userPage player-info-container">Current Username: {user.username}</ul>
                 <FormField
                     label="New Username"
                     value={username}
                     onChange={un => setUsername(un)}
                 />
                 <ul className="userPage player-info-container">Current Gender:{user.gender} </ul>
                 <ul className="userPage player-info-container">
                     <Select
                         options={genderOptions}
                         onChange={(genders)=>setGender(genders.value)}
                     />
                 </ul>
                 <div className="UserPage button-container">
                     <Button
                         width="100%"
                         onClick={() => doEdit()}
                     >
                         Accept Changes
                     </Button>
                 </div>
             </div>
        )
    }

    const doEdit = async () => {
        try {
            localStorage.removeItem('errorMessage');

            // put the new username and/or Gender to the server

            const requestBody = JSON.stringify({username, gender});
            await api.put('/users/'+localStorage.getItem("id"), requestBody);

            // Registration successfully worked --> navigate to the route /game in the GameRouter
            history.push(`/users/${localStorage.getItem("id")}`);

        } catch (error) {
            alert(`Something went wrong while changing the User Data: \n${handleError(error)}`);
        }
    };


    return(
        <React.Fragment>
            <Header view="userPage"/>
            <BaseContainer>
                <div className="userPage main-container">
                    {editProfile}

                </div>
            </BaseContainer>
        </React.Fragment>
    )

}

export default EditUserPage