import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Registration.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import Header from "./Header";
import DatePicker from "react-date-picker"
import "styles/ui/DatePicker.scss"
import Select from "react-select";

/*
Registration Page
 */
const FormField = props => {
  return (
    <div className="registration field">
      <label className="registration label">
        {props.label}
      </label>
      <input
        className="registration input"
        placeholder="enter here.."
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
        type={props.type}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};

const genderOptions = [
    {value: 'MALE', label: 'Male'},
    {value:  'FEMALE', label: 'Female'},
    {value: 'OTHER', label: 'Other'}
]


const Registration = () => {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [birthday, setBirthday] = useState(null);
  const [gender, setGender] = useState(null)
  const [err, setErr] = useState("")

  // This little function asks the server if the typed in username is available and sets an error message accordingly
  useEffect(() => {
    async function checkAvailability(){
      try{
        const response = await api.get(`/users/usernames?username=${username}`)
        if(response.data.available === true) {
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

  const doRegister = async () => {
    try {

      // post the new user to the server
      const requestBody = JSON.stringify({username:username, name, password, birthday, gender});
      console.log(requestBody)
      const response = await api.post('/users', requestBody);
      // Get the returned user and update a new object.

      // Store the token into the local storage.
      localStorage.setItem('token', response.headers.token);
      localStorage.setItem('id', response.data.id);

      // do the login (especially change the status to online)
      await api.post('/users/login', JSON.stringify({username, password}))

      // Registration successfully worked --> navigate to the route /game in the GameRouter
      history.push({
        pathname: `/game/select/blackCard`,
        state: {
          id: response.data.id,
          token: response.headers.token
        }
      });

    } catch (error) {
      alert(`Something went wrong during the registration: \n${handleError(error)}`);
    }
  };



  return (
      <React.Fragment>
        <Header view="register"/>
    <BaseContainer>
      <div className="registration container">
        <div className="registration form">
        <h2 className="registration title"> Registration </h2>
          <FormField
            label="Username"
            value={username.trim()} //can't add spaces at start or end of username, with this it is impossible to enter ""as username
            onChange={un => setUsername(un)}
          />
          <div className={"registration errorMessage"}>
            {err}
          </div>

        <FormField
            label="Name"
            value={name}
            onChange={na => setName(na)}
          />
          <FormField
              label="Password"
              type="password"
              value={password}
              onChange={pw => setPassword(pw)}
          />
          <div>
            <DatePicker className="registration date-picker-container"
                value={birthday}
                onChange={(date)=>setBirthday(date)}
                dateFormat="dd/MM/yyyy"
                // restrict age:
                maxDate={new Date()}
                minDate={new Date('1900-01-01')}
            />
          </div>
          <div>
            <Select
                options={genderOptions}
                onChange={(genders)=>setGender(genders.value)}
            />
          </div>
          <div className="registration button-container">
            <Button
              disabled={err!=='' || !username || !password || !name || !birthday || !gender}
              width="100%"
              onClick={() => doRegister()}
            >
              Register
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
      </React.Fragment>
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Registration;