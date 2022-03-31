import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Registration.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

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

const Registration = props => {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const doRegister = async () => {
    try {
      // post the new user to the server
      const requestBody = JSON.stringify({username, name, password});
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

  const doLogin = async => {
    // do login instead of registration
    try{
      history.push('/login')
    } catch (error){
      alert(`Something went wrong during the registration: \n${handleError(error)}`);
    }
  };

  return (
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
              <Button
                  width="100%"
                  onClick={() => doLogin()}
              >
                You already have a login? go to login.
              </Button>
            </div>
        </div>
      </div>
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Registration;