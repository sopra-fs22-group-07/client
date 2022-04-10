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
                placeholder={props.username}
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
    const id = localStorage.getItem("id")

    const history = useHistory();
    const [user, setUser] = useState(null)
    const [gender, setGender] = useState(null)
    const [username, setUsername] = useState("")
    const [err, setErr] = useState("")

    // This little function asks the server if the typed in username is available and sets an error message accordingly
    useEffect(() => {
        async function checkAvailability(){
            try{
                const requestBody = JSON.stringify({username})
                const response = await api.post('/users/usernames', requestBody)
                // We don't want to show an error if the user retypes his old username, only if it is different and taken
                if(response.data.available === true || username === user.username) {
                    setErr("")
                }
                else {
                    setErr("username already taken")
                }
            } catch (error) {
                alert(`Something went wrong during the registration: \n${handleError(error)}`);
            }
        }
        checkAvailability()
    }, [username]) // the function gets called whenever the username changes

    useEffect(() => {
        //get the User (yourself) to display current name + gender
        async function getUser(){
            const response = await api.get('/users/'+id)
            setUser(response.data)
        }
        getUser()
    },[]);


    //If the getUser is too slow, placeholder
    //Shouldn't get displayed, but otherwise <EditPlayerProfile> tries to render before user gets received
    let editProfile =  (
        <div>
            No Content
        </div>
    )

    function doCancel() {
        history.push(`/users/${id}`)
    }

    //As soon as User(almost instantly) render correct EditPlayerProfile View
    if(user){
         editProfile  = (
             <div className="userPage container">

                 <FormField
                     label="Username"
                     username={user.username}
                     value={username}
                     onChange={un => setUsername(un)}
                 />
                 <div className={"errorMessage"}>
                     {err}
                 </div>
                 <ul className="userPage player-info-container">Gender: {user.gender} </ul>
                 <ul className="userPage player-info-container">
                     <Select className="selector"
                         options={genderOptions}
                         onChange={(genders)=>setGender(genders.value)}
                     />
                 </ul>
                 <div className="UserPage button-container">
                     <Button
                         width="100%"
                         onClick={() => doEdit()}
                     >
                         Save
                     </Button>
                 </div>
                 <div className="UserPage button-container">
                     <Button
                         width="100%"
                         onClick={() => doCancel()}
                     >
                         Cancel
                     </Button>
                 </div>
             </div>
        )
    }

    const doEdit = async () => {
        try {
            const un = username.trim()
            // We don't want to pass null here
            const g = gender ? gender : user.gender

            // update user in server
            const requestBody = JSON.stringify({username: un, gender: g});
            await api.put(`/users/${id}`, requestBody);

            // Registration successfully worked --> navigate to the route /game in the GameRouter
            history.push(`/users/${id}`);

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