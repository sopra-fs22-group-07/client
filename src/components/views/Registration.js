import React, {useState} from 'react';
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
  let errorResponse = null;
  const [birthday, setBirthday] = useState(null);
  const [gender, setGender] = useState(null)

  const doRegister = async () => {
    try {
      localStorage.removeItem('errorMessage');
      // post the new user to the server

      const requestBody = JSON.stringify({username, name, password, birthday, gender});
      const response = await api.post('/users', requestBody);
      // Get the returned user and update a new object.

      // Store the token into the local storage.
      localStorage.setItem('token', response.headers.token);
      localStorage.setItem('id', response.data.id);

      // Registration successfully worked --> navigate to the route /game in the GameRouter
      history.push('/game')
      //history.push(`/game/select/blackCard`);
    } catch (error) {
      const response = error.response;
      if (response && `${response.status}`.toString() === "409") {
        errorResponse = "Username already taken. Try again.\n";
        console.log(errorResponse);
        localStorage.setItem('errorMessage', errorResponse);
        window.location.assign(window.location);
      } else {
        alert(`Something went wrong during the registration: \n${handleError(error)}`);
      }
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
            value={username}
            onChange={un => setUsername(un)}
          />
          <div className= "errorMessage">
            {localStorage.getItem("errorMessage")}
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
            <DatePicker
                value={birthday}
                onChange={(date)=>setBirthday(date)}
                dateFormat="dd/MM/yyyy"
                // restrict age:
                maxDate={new Date()}
                minDate={new Date('1900-01-01')}
            />
          </div>
          <div className="registration date-picker-container">
            <Select
                options={genderOptions}
                onChange={(genders)=>setGender(genders.value)}
            />
          </div>
          <div className="registration button-container">
            <Button
              disabled={!username || !password || !name || !birthday || !gender}
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