import React, {useEffect, useState} from 'react';

import "styles/views/Matches.scss";
import Header from "./Header";
import {api, handleError} from "../../helpers/api";
import MatchListItems from "components/ui/MatchListItems";
import {ONE_DAY, ONE_HOUR, ONE_MINUTE, ONE_SECOND, ONE_WEEK} from "../../helpers/Time";


// Viewing the matches
const Matches = () => {
    // use react-router-dom's hook to access the history
    const userId = localStorage.getItem("id")
    const [matchedUsers, setMatchedUsers] = useState(null)
    const [searchParam, setSearchParam] = useState("")

    // functions that gets the matches from the server
    const getMatches = async () => {
        try {
            const response = await api.get(`users/${userId}/chats`);
            console.log(response.data)
            // convert the response to an array of objects
            const matchedUsersArray = response.data.map(match => {

                return {
                    userId: match.user.id,
                    username: match.user.name,
                    status: match.user.status,
                    messageType: match.message.messageType,
                    content: match.message.content,
                    otherUserId: (match.message.fromUserId === match.user.id) ? match.message.fromUserId : match.message.toUserId,
                    read: match.message.read,
                    creationDate: match.message.creationDate,
                }
            })
            // sort by age of message and assign
            matchedUsersArray.sort((a,b) => new Date(b.creationDate) - new Date(a.creationDate))
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

    /**
     * Gets a String from the time difference, e.g. 1 second, 5 seconds, 1 minute, 10 minutes, 1 hour, 3 hours,
     * 1 day, 6 days, 1 week, 104 weeks.
     * @param creationDate: Date string to get the time difference from
     * @returns {string}: String of time difference
     */
    function getTime(creationDate) {
        const diff = new Date() - new Date(creationDate)
        if (diff < ONE_SECOND) {return "1 second"}
        else if (diff < ONE_MINUTE) {return (Math.round(diff/ONE_SECOND)).toString(10) + " seconds"}
        else if (diff < ONE_HOUR) {return  (Math.round(diff/ONE_MINUTE)).toString(10) + " minute" + ((diff<2*ONE_MINUTE) ? "" : "s")}
        else if (diff < ONE_DAY) {return (Math.round(diff/ONE_HOUR)).toString(10) + " hour" + ((diff<2*ONE_HOUR) ? "" : "s")}
        else if (diff < ONE_WEEK) {return (Math.round(diff/ONE_DAY)).toString(10) + " day" + ((diff<2*ONE_DAY) ? "" : "s")}
        else {return (Math.round(diff/ONE_WEEK)).toString(10) + " week" + ((diff<2*ONE_WEEK) ? "" : "s")}
    }

    function handleChange(event) {
        setSearchParam(event.target.value)
    }

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
                        <input type="text"
                               placeholder="Search User"
                               required
                               value={searchParam}
                               onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="MatchListItem">
                    {matchedUsers ? matchedUsers.map(user => {
                        // only show message if message type is plain text
                        const content = (user.messageType === "PLAIN_TEXT") ? user.content : "[...]"
                        const time = getTime(user.creationDate)
                        // only show chats with name that contains searchParam
                        if (user.username.toLowerCase().match(searchParam.toLowerCase())) {
                            return (
                                <div>
                                    <MatchListItems
                                        animationDelay={0.02}
                                        name={user.username}
                                        key={user.userId}
                                        //active={user.status ? "ONLINE" : ""}
                                        //isOnline={user.status ? "ONLINE" : ""}
                                        status={user.status}
                                        image={user.image} //todo
                                        content={content}
                                        time={time}
                                        read={user.read}
                                        otherUserId={user.otherUserId} // own userId
                                    />
                                </div>

                            );
                        }
                    }): "No Matches Found"}
                </div>
            </div>
        </React.Fragment>
    );
}

export default Matches;