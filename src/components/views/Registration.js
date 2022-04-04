import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Registration.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import Header from "./Header";

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

const Registration = () => {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  let errorResponse = null;

  const doRegister = async () => {
    try {
      localStorage.removeItem('errorMessage');
      // post the new user to the server
      const requestBody = JSON.stringify({username, name, password});

      const response = await api.post('/users', requestBody);

      // Get the returned user and update a new object.
      //const user = new User(response.data);
      // Store the token into the local storage.
      localStorage.setItem('token', response.headers.token);
      localStorage.setItem('id', response.data.id);

      // Registration successfully worked --> navigate to the route /game in the GameRouter
      history.push(`/game`);
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
          <div className="registration button-container">
            <Button
              disabled={!username || !password}
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