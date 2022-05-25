import React, {useState} from "react";
import Avatar from "./Avatar";
import "styles/views/Matches.scss";
import "styles/views/UserProfile.scss"
import {useHistory} from "react-router-dom";
import {UserProfile} from "./UserProfile";

export const generateAvatar = (sprites, seed) => `https://avatars.dicebear.com/api/${sprites}/${seed}.svg`

const MatchListItems = props => {
    const history = useHistory();
    const fromUserId = props.fromUserId
    const onDelete = props.onDelete
    const userId = Number.parseInt(localStorage.getItem("id"))
    const [showUserProfile, setShowUserProfile] = useState(false)

    // see https://avatars.dicebear.com/
    // the faces:
    // const avatar = generateAvatar("adventurer-neutral", props.otherUserId)
    // the GitHub style avatar:
    const avatar = generateAvatar("identicon", props.otherUserId)

    // truncate chat message to max length
    let chatContent = props.content
    const maxMsgLength = 70
    chatContent = chatContent.length > maxMsgLength ? chatContent.substring(0, maxMsgLength-1) + "..." : chatContent

    // go to chat
    function pushChat() {

        history.push("/game/chat",
            {
                chatId: props.chatId,
                otherUserId: props.otherUserId,
                otherUserName: props.name
            })
    }

    let content = (<div
        style={{animationDelay: `0.${props.animationDelay}s`,
            alignSelf: "flex-start"}}


        className={`matchListItem ${
            props.active ? props.active : "" // what does this do?
        } `}
    >
        <Avatar
            image={
                props.image ? props.image : avatar
            }
            isOnline={props.status}
            onClick={() => setShowUserProfile(true)}
        />

        <div className={`userMeta ${
            props.read || userId === fromUserId ? "readMsg" : "unreadMsg"
        }`}
             onClick={() => pushChat()}>
            <p id={"name"}>{props.name}</p>

        </div>
        <div className={`userMeta ${
            props.read || userId === fromUserId ? "readMsg" : "unreadMsg"
        }`}
             onClick={() => pushChat()}>

            <span id={"message"}>{(userId === fromUserId) ? "You: " : "" }{chatContent}</span>
            <span className="activeTime">{props.time} ago</span>
        </div>

    </div>)

    if (showUserProfile) {
        content = (
            <div         style={{animationDelay: `0.${props.animationDelay}s`,
                alignSelf: "flex-start"}}


                         className={`matchListItem ${
                             props.active ? props.active : "" // what does this do?
                         } `} >
                <UserProfile
                    image = {props.image ? props.image : avatar}
                    otherUserId = {props.otherUserId}
                    name = {props.name}
                    onGoBack = {() => setShowUserProfile(false)}
                    onDelete = {onDelete}
                    view = "matches"
                />
            </div>

        )
    }

    return content
}

export default MatchListItems