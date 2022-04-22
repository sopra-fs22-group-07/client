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
        <div className="userPage edit-field">
            <label className="userPage edit-label">
                {props.label}
            </label>
            <input
                className="userPage edit-input"
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
                alert(`Something went wrong during the check of the username: \n${handleError(error)}`);
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
                     label="Choose New Username"
                     username={user.username}
                     value={username.trim()}
                     onChange={un => setUsername(un)}
                 />
                 <div className={"errorMessage"}>
                     {err}
                 </div>
                 <p className="userPage player-info-container">
                     <div className="userPage player-info-container-title">
                         Current Gender: {user.gender}
                     </div>
                     <Select
                         /*className="react-select"
                         classNamePrefix="react-select"
                         theme={(theme) => ({
                             ...theme,
                             borderRadius: 0,
                             colors: {
                                 ...theme.colors,
                                 neutral10: 'black',
                                 text-colors: 'black',
                             },
                         })*/
                         options={genderOptions}
                         onChange={(genders)=>setGender(genders.value)}
                     />
                 </p>
                 <div className="userPage button-container">
                     <Button
                         className="userPage button"
                         onClick={() => doEdit()}
                     >
                         Save
                     </Button>
                 </div>
                 <div className="userPage button-container">
                     <Button
                         className="userPage button"
                         onClick={() => doCancel()}
                     >
                         Cancel
                     </Button>
                 </div>

                 <div className="userPage button-container">
                     <Button
                         className="userPage delete-button"
                        onClick={() => doDeleteAccount()}
                     >
                         Delete Account
                     </Button>
                 </div>
             </div>
        )
    }
    //Triggered When Delete account button is pressed.
    //Gives a PopUp to confirm if the account should be deleted. If cancel-> nothing happens
    //if OK -> Account gets deleted(not implemented yet) & and navigates to login screen
    const doDeleteAccount = async () => {
        if (window.confirm("Press OK to Delete your Account\nDeleting your Account is irreversible and will DELETE ALL MATCHES")){
            try {
                await api.delete(`/users/${localStorage.getItem('id')}`);
                console.log("Account Was Deleted!")
                localStorage.removeItem('token'); //Basically just logging out
                localStorage.removeItem('id');
                history.push('/login');
            } catch (error) {
                alert(`Something went wrong during the logout: \n${handleError(error)}`);
            }
        }
        else{
            console.log("Account was not Deleted!")
        }
    }

    const doEdit = async () => {
        try {
            const un = username.trim()
            // We don't want to pass null here
            const g = gender ? gender : user.gender

            // update user in server
            const requestBody = JSON.stringify({username: un, gender: g});
            await api.put(`/users/${id}`, requestBody);

            // Editing user successfully worked --> navigate to the route /userprofile in the router
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