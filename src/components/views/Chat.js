import {useLocation} from "react-router-dom";
import Header from "./Header";
import React from "react";


const Chat = () => {
    const location = useLocation();
    const otherUserId = location.state.otherUserId

    return <React.Fragment>
       <Header view={"game"}/>
        <div>Under Construction. UserId from other user is {otherUserId}</div>
    </React.Fragment>
}

export default Chat