import React from "react";
import Avatar from "./Avatar";
import "styles/views/Matches.scss";
import {useHistory} from "react-router-dom";

const MatchListItems = props => {
    const history = useHistory();
    const userId = props.otherUserId
    // truncate chat message to max length
    let chatContent = props.content
    const maxMsgLength = 70
    chatContent = chatContent.length > maxMsgLength ? chatContent.substring(0, maxMsgLength-1) + "..." : chatContent

    // go to chat
    function pushChat() {
        history.push("/game/chat",
            {
                otherUserId: userId
            })
    }

    // view userprofile TODO
    function pushUser() {
        console.log("pushUser")
    }


    return (
        <div
            style={{animationDelay: `0.${props.animationDelay}s`,
                alignSelf: "flex-start"}}


            className={`matchListItem ${
                props.active ? props.active : "" // what does this do?
            } `}
        >
            <Avatar
                image={
                    props.image ? props.image : "https://via.placeholder.com/80"
                }
                isOnline={props.status}
                onClick={() => pushUser()}
            />

            <div className={`userMeta ${
                props.read || props.key === props.otherUserId ? "readMsg" : "unreadMsg"
            }`}
                 onClick={() => pushChat()}>
                <p id={"name"}>{props.name}</p>

            </div>
            <div className={`userMeta ${
                props.read || props.key === props.otherUserId ? "readMsg" : "unreadMsg"
            }`}
                 onClick={() => pushChat()}>

                <span id={"message"}>{chatContent}</span>
                <span className="activeTime">{props.time} ago</span>
            </div>

        </div>
    );
}

export default MatchListItems