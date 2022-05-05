import React, {useEffect, useState} from 'react';

import "styles/views/Matches.scss";
import Header from "./Header";
import {api, handleError} from "../../helpers/api";
import MatchListItems from "components/ui/MatchListItem";


// Viewing the matches
const Matches = () => {
    // use react-router-dom's hook to access the history
    const userId = localStorage.getItem("id")
    const [matchedUsers, setMatchedUsers] = useState(null)

    // functions that gets the matches from the server
    const getMatches = async () => {
        try {
            const response = await api.get(`users/${userId}/matches`);
            console.log(response.data)
            // convert the response to an array of objects
            const matchedUsersArray = response.data.map(match => {
                return {
                    id: match.id,
                    name: match.name,
                    username: match.username,
                    birthday: match.birthday,
                    creationDate: match.creationDate,
                    gender: match.gender,
                    status: match.status
                }
            })
            setMatchedUsers(matchedUsersArray)
        } catch (error) {
            console.error("Details:", error);
            alert("Invalid Input:\n " + handleError(error));
        }
    }

    // get all matches on page load
    useEffect(() => {
        getMatches()
    }, [])
    // for styling: animationDelay={index + 1}
    return (
        <React.Fragment>
            <Header view="game"/>
            <div className="containerMatchList">
                <div className="matchListHeading">
                    <h2>Matches</h2>
                </div>
                <div className="messageList">
                    <div className="searchWrap">
                        <input type="text" placeholder="Search Here" required />
                        <button className="searchButton">
                            <i className="fa fa-search"></i>
                        </button>
                    </div>
                </div>
                <div className="MatchListItem">
                    {matchedUsers ? matchedUsers.map(user => {
                        return (
                            <div>
                                <MatchListItems
                                    name={user.username}
                                    key={user.id}
                                    active={user.status ? "ONLINE" : ""}
                                    isOnline={user.status ? "ONLINE" : ""}
                                    status={user.status ? "ONLINE" : ""}
                                    image={user.image}
                                    gender = {user.gender}
                                    birthday = {user.birthday}
                                />
                            </div>

                        );
                    }): "No Matches Found"}
                </div>
            </div>
        </React.Fragment>
    );
}

export default Matches;