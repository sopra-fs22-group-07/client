import React, { Component } from "react";
import Avatar from "./Avatar";
import "styles/views/Matches.scss";
import {useHistory} from "react-router-dom";

export default class MatchListItems extends Component {
    constructor(props) {
        super(props);
        const history = useHistory();
    }
    // go to chat
    pushChat = (user) => {
        console.log("pushChat")
        history.push("/game/chat",
            {
                user: user
            })
    };

    pushUser = (user) => {
        console.log("pushUser")
    };

    render() {
        let chatContent = this.props.content
        const maxMsgLength = 70
        chatContent = chatContent.length > maxMsgLength ? chatContent.substring(0, maxMsgLength-1) + "..." : chatContent

        return (
            <div
                style={{animationDelay: `0.${this.props.animationDelay}s`,
                    /* justifyContent: "space-evenly",*/ alignSelf: "flex-start"}}


                className={`matchListItem ${
                    this.props.active ? this.props.active : "" // what does this do?
                } `}
            >
                <Avatar
                    image={
                        this.props.image ? this.props.image : "https://via.placeholder.com/80"
                    }
                    isOnline={this.props.status}
                    onClick={this.pushUser} // todo how to do something here?
                />

                <div className={`userMeta ${
                    this.props.read || this.props.key === this.props.otherUserId ? "readMsg" : "unreadMsg"
                }`}
                onClick={this.pushChat}>
                    <p id={"name"}>{this.props.name}</p>

                </div>
                <div className={`userMeta ${
                    this.props.read || this.props.key === this.props.otherUserId ? "readMsg" : "unreadMsg"
                }`}
                onClick={this.pushChat}>

                    <span id={"message"}>{chatContent}</span>
                    <span className="activeTime">{this.props.time} ago</span>
                </div>

            </div>
        );
    }
}