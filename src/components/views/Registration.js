import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Registration.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import Header from "./Header";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
    {value: "MALE", label: "Male"},
    {value:  "FEMALE", label: "Female"},
  {value: "OTHER", label: "Other"}
]


const Registration = props => {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [birthday, setBirthday] = useState(null);
  const [gender, setGender] = useState(null)

  const doRegister = async () => {
    try {
      // post the new user to the server
      const requestBody = JSON.stringify({username, name, password, birthday, gender});
      const response = await api.post('/users', requestBody);

      // Get the returned user and update a new object.
      //const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem('token', response.headers.token);

      // Registration successfully worked --> navigate to the route /game in the GameRouter
      history.push(`/game`);
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
            value={username}
            onChange={un => setUsername(un)}
          />
        <FormField
            label="Name"
            value={name}
            onChange={na => setName(na)}
          />
          <FormField
              label="Password"
              value={password}
              onChange={pw => setPassword(pw)}
          />
          <div>
            <DatePicker placeholderText="Your Birthday" selected={birthday} onChange={(date)=>setBirthday(date)} />
          </div>
          <div>
            <Select
                options={genderOptions}
                onChange={(value)=>setGender(value)}

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
          <div className="registration button-container">
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