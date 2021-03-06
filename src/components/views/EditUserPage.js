import React, {useEffect, useState} from "react";
import {api, handleError} from 'helpers/api';
import BaseContainer from "../ui/BaseContainer";
import 'styles/views/UserPage.scss'
import 'styles/views/LoginRegistration.scss'
import {Button} from "../ui/Button";
import {useHistory} from "react-router-dom";
import {GenderPicker} from "../ui/GenderPicker";
/*
Edit User Info Page
 */

//To get input for the new username
const FormField = props => {

    return (
        <div className="login field">
            <label className="login label">
                {props.label}
            </label>
            <input
                className="login input"
                placeholder={props.username}
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
                type={props.type}
            />
        </div>
    );
};

const EditUserPage = () =>{
    const id = localStorage.getItem("id")

    const history = useHistory();
    const [user, setUser] = useState(null)
    const [gender, setGender] = useState(null)
    const [username, setUsername] = useState("")
    const [err, setErr] = useState("")

    // This little function asks the server if the typed in username is available and sets an error message accordingly
    useEffect(() => {
        api.get(`users/usernames?username=${username}`)
            .then(response => {
            if(response.data.available === true || username === user.username) {
                setErr("")
            }
            else {
                setErr("username already taken")
            }
            })
            .catch(error => alert(`Something went wrong during the check of the username: \n${handleError(error)}`))

    }, [username]) // the function gets called whenever the username changes

    useEffect(() => {
        //get the User (yourself) to display current name + gender
        api.get('/users/'+id)
            .then(r => setUser(r.data))
            .catch(error => alert(`Something went wrong during the fetch of the user: \n${handleError(error)}`))
    },[]);


    // If the getUser is too slow, placeholder
    // Shouldn't get displayed, but otherwise <EditPlayerProfile> tries to render before user gets received
    let editProfile =  (
        <div>
            No Content
        </div>
    )

    function doCancel() {
        history.push(`/users/${id}`)
    }


    // As soon as User is fetched, render correct EditPlayerProfile View
    if(user){
         editProfile  = (
             <div className="login form">
                 <h2 className="login title"> Edit Profile </h2>
                 <FormField
                     label="Choose New Username"
                     username={user.username}
                     value={username.trim()}
                     onChange={un => setUsername(un)}
                 />
                 <div className={"errorMessage"}>
                     {err}
                 </div>
                 <div>
                     <div className="userPage gender">
                         Current Gender: {user.gender.toLowerCase()}
                     </div>
                     <GenderPicker
                         onChange={(genders)=>setGender(genders.value)}
                     />
                 </div>
                 <div className= "userPage fixed-button-container">
                     <div className= "userPage moving-button-container">
                         <Button
                             width="100%"
                             onClick={() => doEdit()}
                         >
                             Save
                         </Button>
                     </div>
                     <div className= "userPage moving-button-container">
                         <Button
                             width="100%"
                             onClick={() => doCancel()}
                         >
                             Cancel
                         </Button>
                     </div>
                     <div className= "userPage moving-button-container">
                         <Button
                             className = "delete"
                             width="100%"
                             onClick={() => doDeleteAccount()}
                         >
                             Delete Account
                         </Button>
                     </div>
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
            <BaseContainer>
                <div className="login container">
                    {editProfile}
                </div>
            </BaseContainer>
        </React.Fragment>
    )
}

export default EditUserPage