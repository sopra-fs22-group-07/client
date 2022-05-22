import React, { Component } from "react";

export default class Avatar extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="avatar"
            onClick={this.props.onClick}>
                <div className="avatarImg">
                    <img src={this.props.image} alt="#" />
                </div>
                <span className={`isOnline ${this.props.isOnline}`}></span>
            </div>
        );
    }
}