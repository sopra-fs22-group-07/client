import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Login.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import Header from "./Header";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = props => {
  return (
      <div className="login field">
        <label className="login label">
          {props.label}
        </label>
        <input
            className="login input"
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

const Login = () => {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  let errorResponse = null;

  const pushUser = async () => {
    try {
      const id =  localStorage.getItem('id')
      // if user has no black card yet, server should return null or something.
      const response = await api.get(`/users/${id}/games/blackCards/current`)

      history.push({
        pathname: `/game/menu`,
      });
    } catch (error) {
      if(error.response.status === 404){
        history.push({
          pathname: `/game/select/blackCard`,
          state: {
            id: localStorage.getItem('id'),
            token: localStorage.getItem('token')
          }
        });
      }
      else{
        console.error("Details:", error);
        alert("Invalid Input:\n " + handleError(error));}
    }
  };


  // TODO: this is a feature for development only, remove on final build
  // api call to add demo users
  const addDemoUsers = async () => {
    try {
      await api.post('/users/demo')
      window.alert("Demo users added.")
    }
    catch (error) {
      window.alert("Error: " + error.response.data.message);
    }
  }




  const doLogin = async () => {
    try {
      localStorage.removeItem('errorMessage');
      const requestBody = JSON.stringify({username, password});
      const response = await api.post('/users/login', requestBody);

      // Get the returned user and update a new object.
      // const user = new User(response.data);


      // Store the token into the local storage.
      localStorage.setItem('token', response.headers.token);
      localStorage.setItem('id', response.data.id)

      // Login successfully worked --> navigate to the route /game in the GameRouter
      await pushUser();

    } catch (error) {
      const response = error.response;
      if (response && `${response.status}`.toString() === "401") {
        errorResponse = "username or password incorrect.";
        console.log(errorResponse);
        localStorage.setItem('errorMessage', errorResponse);
        window.location.assign(window.location);
      } else {
        alert(`Something went wrong during the login: \n${handleError(error)}`);
      }
    }
  };

  return (
      <React.Fragment>
        <Header view="login"/>
      <BaseContainer>
        <div className="login container">
          <div className="login form">
            <h2 className = "login title"> Login </h2>
            <FormField
                label="Username"
                value={username}
                onChange={un => setUsername(un)}
            />
            <FormField
                label="Password"
                value={password}
                onChange={pw => setPassword(pw)}
            />
            <div className= "errorMessage">
              {localStorage.getItem("errorMessage")}
            </div>
            <div className="login button-container">
              <Button
                  disabled={!username || !password}
                  width="100%"
                  onClick={() => doLogin()}
              >
                Login
              </Button>
            </div>

            {/* TODO: this is a feature for development only, remove on final build */}
            <div className="login button-container">
              <Button
                  width="100%"
                  onClick={() => addDemoUsers()}
              >
                Add Demo Users
              </Button>
            </div>

          </div>

          {/* TODO: this is a feature for development only, remove on final build */}
          <div style={{color: "black"}}>
            <br/>
            <br/>
            <br/>
            There are three demo users with credentials:
            <ul>
              <li>Username: demoUser1</li>
              <li>Password: demoUser1</li>
            </ul>
            <ul>
              <li>Username: demoUser2</li>
              <li>Password: demoUser2</li>
            </ul>
            <ul>
              <li>Username: demoUser3</li>
              <li>Password: demoUser3</li>
            </ul>
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
export default Login;
