import React, {useEffect, useState} from 'react';
import BaseContainer from "components/ui/BaseContainer";
import "styles/ui/CardButton.scss";
import CardButton from "../ui/CardButton";
import {api, handleError} from "../../helpers/api";


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

    return (
        <React.Fragment>
            <div className={"game description"}>
                <h1>You matched with:</h1>
            </div>

            <BaseContainer className={"menu container"}>
                {/* display all users in matchedUsers if there are any */}
                {matchedUsers ? matchedUsers.map(user => {
                    return (
                        <CardButton
                            key={user.id}
                            className={"card whiteCard"}
                            // onClick={() => history.push(`/game/${user.id}`)}
                        >
                            {`Username: ${user.username}`}
                            <br/>
                            {`Name: ${user.name}`}
                            <br/>
                            {`Status: ${user.status}`}
                            <br/>
                            {`Birthday: ${user.birthday}`}
                            <br/>
                            {`Gender: ${user.gender}`}
                        </CardButton>
                    )
                }) : "No Matches Found"}
            </BaseContainer>
        </React.Fragment>
    );
}

export default Matches;