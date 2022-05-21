import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/LoginRegistration.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import DatePicker from "react-date-picker"
import "styles/ui/DatePicker.scss"
import {GenderPicker} from "../ui/GenderPicker";

/*
Registration Page
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
  const [gender, setGender] = useState(null)
  const [err, setErr] = useState("")
  let eighteenYearsAgo = new Date()
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18)
  let hundredYearsAgo = new Date()
  hundredYearsAgo.setFullYear(hundredYearsAgo.getFullYear() - 100)
  const [birthday, setBirthday] = useState(eighteenYearsAgo);
  const [location, setLocation] = useState([0, 0]);


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


  const getGeoLocation = async (userId) => {

    // how to handle if we get user location
    const successCallback = (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      setLocation([latitude, longitude]);
    };

    // how to handle if user denies access to location
    const errorCallback = (error) => {
      console.log(`Error: ${error.code}`);
      console.log(`Error Message: ${error.message}`);
      window.alert("Your location could not be determined. You were set to the default location (0\"N, 0\"E).");
    };

    // if geolocation is not supported by the browser, do so
    if (!navigator.geolocation) {
      window.alert("Geolocation is not supported by your browser. You were set to the default location (0\"N, 0\"E).");
    } else {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    }

    console.log(location);
    await api.post(`/users/${userId}/location`, {
      latitude: location[0],
      longitude: location[1]
    });

  }



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

      // get the user's location
      getGeoLocation(response.data.id)

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
    <BaseContainer>
      <div className="login container">
        <div className="login form">
          <h2 className="login title"> Registration </h2>
          <FormField
            label="Username"
            value={username.trim()} //can't add spaces at start or end of username, with this it is impossible to enter ""as username
            onChange={un => setUsername(un)}
          />
          <div className={"errorMessage"}>
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
            <DatePicker className="login date-picker-container"
                value={birthday}
                onChange={(date)=>setBirthday(date)}
                dateFormat="dd/MM/yyyy"
                // restrict age:
                maxDate={eighteenYearsAgo}
                minDate={hundredYearsAgo}
            />
          </div>
          <div>
            <div className="login container-title">
              Gender
            </div>
            <GenderPicker
                onChange={(genders)=>setGender(genders.value)}
            />
          </div>
          <div className="login fixed-button-container">
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