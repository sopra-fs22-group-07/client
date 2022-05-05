import React, { Component } from "react";
import Avatar from "./Avatar";
import PropTypes from "prop-types";

export default class ChatListItems extends Component {
    constructor(props) {
        super(props);
    }
    selectChat = (e) => {
        for (
            let index = 0;
            index < e.currentTarget.parentNode.children.length;
            index++
        ) {
            e.currentTarget.parentNode.children[index].classList.remove("active");
        }
        e.currentTarget.classList.add("active");
    };

    render() {
        return (
         <React.Fragment>

            <div
                style={{animationDelay: `0.${this.props.animationDelay}s`,
                     justifyContent: "space-evenly", alignSelf: "flex-start"}}
                onClick={this.selectChat}
                className={`chatlist__item ${
                    this.props.active ? this.props.active : ""
                } `}
            >
                <Avatar
                    image={
                        this.props.image ? this.props.image : "https://via.placeholder.com/80"
                    }
                    isOnline={this.props.isOnline}
                />

                <div className="userMeta">
                    <p>{this.props.name}</p>
                    <span className="activeTime">32 mins ago</span>
                </div>
                <div className="userMeta">
                    <p>{this.props.gender}</p>
                </div>
                <div className="userMeta">
                    <p>{this.props.birthday}</p>
                </div>
            </div>
         </React.Fragment>
        );
    }
}