import {useLocation} from "react-router-dom";
import React from "react";


const Chat = () => {
    const location = useLocation();
    const otherUserId = location.state.otherUserId

    return <React.Fragment>
        <div>Under Construction. UserId from other user is {otherUserId}</div>
    </React.Fragment>
}

export default Chat