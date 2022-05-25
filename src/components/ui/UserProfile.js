import React from "react";
import "styles/views/UserProfile.scss"
import "styles/ui/Button.scss"
import {Button} from "./Button";
import {api, handleError} from "../../helpers/api";


export const UserProfile = props => {
    const img = props.image
    const userId = parseInt(localStorage.getItem("id"), 10)
    const otherUserId = props.otherUserId
    const userName = props.name
    const goBack = props.onGoBack
    const onDelete = props.onDelete
    const view = props.view
    console.log(userName)

    async function unmatch() {
        if (window.confirm("Are you sure to unmatch this user?")) {
            await api.delete(`users/${userId}/matches/${otherUserId}`).catch(error => {
                console.error("Details:", error);
                alert("An Error occurred:\n " + handleError(error));
            }).then(onDelete)
        }
    }

    async function block() {
        if (window.confirm("Are you sure to block this user? This operation will be irreversible!")) {
            await api.put(`users/${userId}/matches/${otherUserId}/block`).catch(error => {
                console.error("Details:", error);
                alert("An Error occurred:\n " + handleError(error));
            }).then(onDelete)
        }
    }

    return <div className={"profile"}>
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor"
             className="bi bi-arrow-left-circle" viewBox="0 0 16 16"
        onClick={goBack}>
            <path fillRule="evenodd"
                  d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
        </svg>
        <div className="profilePicture"
        >
            <div className={"username"} >
                {userName}
            </div>
            <img src={img} alt="#" />
        </div>
        <div className={"button-container"} >
            <Button className = {`invert unmatch ${view}`}
                    onClick={() => unmatch()}
            >
                Unmatch
            </Button>
            <Button className = {`invert block ${view}`}
                    onClick={() => block()}
            >
                Block
            </Button>
        </div>
    </div>
}