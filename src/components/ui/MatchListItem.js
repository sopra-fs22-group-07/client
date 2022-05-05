import React, { Component } from "react";
import Avatar from "./Avatar";
import "styles/views/Matches.scss";

export default class MatchListItems extends Component {
    constructor(props) {
        super(props);
    }
    pushChat = (user) => {

    };

    pushUser = (user) => {

    };

    render() {
        return (
            <div
                style={{animationDelay: `0.${this.props.animationDelay}s`,
                     justifyContent: "space-evenly", alignSelf: "flex-start"}}


                className={`matchListItem ${
                    this.props.active ? this.props.active : ""
                } `}
            >
                <Avatar
                    image={
                        this.props.image ? this.props.image : "https://via.placeholder.com/80"
                    }
                    isOnline={this.props.isOnline}
                    onClick={this.pushChat}
                />

                <div className="userMeta">
                    <p>{this.props.name}</p>

                    <span className="activeTime">60 mins ago</span>
                </div>
                <div className="userMeta">
                    <p>{this.props.gender}</p>
                </div>
                <div className="userMeta">
                    <p>{this.props.birthday}</p>
                </div>
                <div className="userMeta"
                     onClick={this.pushUser}>
                    <p>Userpage</p>
                </div>
            </div>
        );
    }
}