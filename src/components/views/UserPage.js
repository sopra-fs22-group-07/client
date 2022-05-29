import React, {useEffect, useState} from "react";
import {api, handleError} from 'helpers/api';
import BaseContainer from "../ui/BaseContainer";
import 'styles/views/UserPage.scss'
import 'styles/views/LoginRegistration.scss';
import {useHistory} from "react-router-dom";
import {Button} from "../ui/Button";

// import for map
import 'leaflet/dist/leaflet.css';
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon} from 'leaflet'
import { Circle, MapContainer, Marker, TileLayer} from 'react-leaflet'

const displayDate = (date) => {

    if(date){
        const dt = new Date(date);
        const day = dt.getDate(); //gets day of the month
        const month = dt.getMonth()+1; //month starts with jan = 0, so month + 1
        const year = dt.getFullYear();
        return day+"-"+month+"-"+year;
    }
    else{
        return "No Birthday Found";
    }
}

const calculateZoom = (range) => {
    return Math.log2(21000/range)
}

const UserPage = () =>{
    const id = localStorage.getItem("id")
    const history = useHistory()

    const[user, setUser] = useState(null);

    useEffect(() => {

        async function getUser(){
            try{
                const response = await api.get('/users/'+id)
                setUser(response.data);
                // console.log(response)
            } catch (error) {
                console.error("Details:", error);
                alert("Invalid Input:\n " + handleError(error));
            }
        }
        getUser()
    }, []);


    let profile = (
        <table className="userPage table">
            <div className="userPage player-info-container">Username: </div>
            <div className="userPage player-info-container">Name: </div>
            <div className="userPage player-info-container">Gender: </div>
            <div className="userPage player-info-container">Birthday: </div>
        </table>

    )


    if(user){
        profile  = (
                <table className="userPage table">
                    <tbody>
                        <tr className="userPage player-info-container">
                            <td> Username: </td>
                            <td className="userPage td"> {user.username} </td>
                        </tr>
                        <tr className="userPage player-info-container">
                            <td> Name: </td>
                            <td className="userPage td"> {user.name} </td>
                        </tr>
                        <tr className="userPage player-info-container">
                            <td> Gender: </td>
                            <td className="userPage td-gender"> {user.gender.toLowerCase()} </td>
                        </tr>
                        <tr className="userPage player-info-container">
                            <td> Birthday: </td>
                            <td className="userPage td"> {displayDate(user.birthday)} </td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <Button
                                    className="invert"
                                    width="100%"
                                    onClick={() => goToEdit()}
                                >
                                    Edit Profile
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </table>
        )
    }

    let userPreferences = (
        <table className="userPage table">
            <div className="userPage player-info-container">Age Preference: </div>
            <div className="userPage player-info-container">Gender Preferences: </div>
            <div className="userPage player-info-container">Range: </div>
        </table>
    )

    if(user){
        userPreferences = (
            <table className="userPage table">
                <tbody>
                    <tr className="userPage player-info-container">
                        <td> Age:</td>
                        <td className="userPage td"> {user.minAge} Years - {user.maxAge} Years</td>
                    </tr>
                    <tr className="userPage player-info-container">
                        <td> Gender: </td>
                        <td className="userPage td-gender"> {(user.genderPreferences.join(', ')).toLowerCase()} </td>
                    </tr>
                    <tr className="userPage player-info-container">
                        <td> Range: </td>
                        <td className="userPage td"> {(user.maxRange)} km</td>
                    </tr>
                    <tr>
                        <td colSpan="2">
                            <Button
                              className="invert"
                              width="100%"
                              onClick={() => goToEditPreferences()}
                            >
                                Edit Profile
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }

    // MAP
    let map = null;
    if(user){
        let zoomScale = calculateZoom(user.maxRange)
        let position = [user.latitude, user.longitude] // latitude, longitude
        if(position[0] === 0 && position[1] === 0){
            zoomScale = 4; // higher zoom because somewhere in the water
        }
        map = (
            <MapContainer center={position} zoom={zoomScale} scrollWheelZoom={false}
                          className="userPage leaflet-container">
                <TileLayer className = "userPage leaflet-tile-pane"
                           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                           attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={position}
                        icon={new Icon({iconUrl: markerIconPng, iconSize: [12, 20], iconAnchor: [6, 20]})}>
                </Marker>
                <Circle
                    center={position}
                    pathOptions={{ color: 'blue' }}
                    fillOpacity={0.5}
                    opacity={0.6}
                    radius={user.maxRange*1000}>
                </Circle >
            </MapContainer>
        )
    }


    const goToEdit = async () =>{
        try {
            history.push(`/users/${id}/edit/userinfo`)
        }catch (error) {
            alert(`Something went wrong while navigating to the game menu: \n${handleError(error)}`);
        }
    }

    const goToEditPreferences = async () =>{
        try {
            history.push(`/users/${id}/edit/preferences`, {
                origin: `/users/${id}`
            })
        }catch (error) {
            alert(`Something went wrong while navigating to the game menu: \n${handleError(error)}`);
        }
    }

    return(
        <React.Fragment>
            <BaseContainer className="userPage main-container">
                <div className="userPage main-container">
                    <div className="userPage bigTitle"> Profile </div>
                    {profile}
                </div>

                <div className="userPage main-container">
                    <div className="userPage bigTitle">Preferences</div>
                    {userPreferences}
                </div>
                {map}
            </BaseContainer>
        </React.Fragment>
    )
}

export default UserPage