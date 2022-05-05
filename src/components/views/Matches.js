import React, {useEffect, useState} from 'react';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/WhiteCardSelection.scss";
import "styles/views/Matches.scss";
import Header from "./Header";
import CardButton from "../ui/CardButton";
import {api, handleError} from "../../helpers/api";
import ChatListItems from "components/ui/ChatListItem";


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
            <div className={"game description"}>
                <h1>You matched with:</h1>
            </div>

            <BaseContainer className={"menu container"}>
                {/* display all users in matchedUsers if there are any */}
                {matchedUsers ? matchedUsers.map(user => {
                    return (
                        <div>
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

                    <ChatListItems
                        name={user.name}
                        key={user.id}
                        active={user.status ? "ONLINE" : ""}
                        isOnline={user.status ? "ONLINE" : ""}
                        image={user.image}
                    />
                    </div>
                    )
                }) : "No Matches Found"}
            </BaseContainer>


            <div className="main__chatlist">
                <button className="btn">
                    <i className="fa fa-plus"></i>
                    <span>New conversation</span>
                </button>
                <div className="chatlist__heading">
                    <h2>Chats</h2>
                    <button className="btn-nobg">
                        <i className="fa fa-ellipsis-h"></i>
                    </button>
                </div>
                <div className="chatList__search">
                    <div className="search_wrap">
                        <input type="text" placeholder="Search Here" required />
                        <button className="search-btn">
                            <i className="fa fa-search"></i>
                        </button>
                    </div>
                </div>
                <div className="chatlist__items">
                    {matchedUsers ? matchedUsers.map(user => {
                        return (
                            <ChatListItems
                                name={user.name}
                                key={user.id}
                                active={user.status ? "ONLINE" : ""}
                                isOnline={user.status ? "ONLINE" : ""}
                                image={user.image}
                            />
                        );
                    }): "No Matches Found"}
                </div>
            </div>
        </React.Fragment>
    );
}

export default Matches;