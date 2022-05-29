import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/LoginRegistration.scss';
import BaseContainer from "components/ui/BaseContainer";
import {FormField} from "../ui/FormField";
import {getGeoLocation} from "../../helpers/getGeoLocation";


const Login = () => {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorResponse, setErrorResponse] = useState("");

  const pushUser = async () => {
    try {
      const id =  localStorage.getItem('id')
      // if user has no black card yet, server should return null or something.
      await api.get(`/users/${id}/games/blackCards/current`)

      history.push({
        pathname: `/game/menu`,
      });
    } catch (error) {
      if(error.response.status === 404){
        history.push(`/game/select/blackCard`);
      }
      else{
        console.error("Details:", error);
        alert("Invalid Input:\n " + handleError(error));}
    }
  };

  const doLogin = async () => {

    try {
      setErrorResponse("")
      const requestBody = JSON.stringify({username, password});
      const response = await api.post('/users/login', requestBody);

      // Get the returned user and update a new object.

      // Store the token into the local storage.
      localStorage.setItem('token', response.headers.token);
      localStorage.setItem('id', response.data.id)

      await getGeoLocation(response.data.id);

      // Login successfully worked --> navigate to the route /game in the GameRouter
      await pushUser();

    } catch (error) {
      const response = error.response;
      if (response && `${response.status}`.toString() === "401") {
        setErrorResponse("username or password incorrect.");
      } else {
        alert(`Something went wrong during the login: \n${handleError(error)}`);
      }
    }


  };

  return (
      <React.Fragment>
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
                type="password"
                value={password}
                onChange={pw => setPassword(pw)}
            />
            <div className= "errorMessage">
              {errorResponse}
            </div>
            <div className="login fixed-button-container">
              <Button
                  disabled={!username || !password}
                  width="100%"
                  onClick={() => doLogin()}
              >
                Login
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
export default Login;
