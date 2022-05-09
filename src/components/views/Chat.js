import {useLocation} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import {api, handleError} from "../../helpers/api";
import "styles/views/Chat.scss";
import Message from "../../models/Message";


const Chat = () => {
    const location = useLocation();
    const otherUserId = location.state.otherUserId
    const chatId = location.state.chatId
    const otherUserName = location.state.otherUserName
    const userId = Number.parseInt(localStorage.getItem("id"))
    // this is used for keeping track of the total number of messages loaded.
    const [numOfMessages, setNumOfMessages] = useState(0)

    useEffect(() => {
        async function initializeRead() {
            await readMessages()
        }
        initializeRead()
    }, [])

    function goBack() {
        console.log("Go Back To Match Overview (maybe not needed)")
    }

    async function readMessages() {
        await api.put(`users/${userId}/chats/${chatId}/read`)
    }

    function ChatRoom() {
        const [messages, setMessages] = useState(null)
        const [formValue, setFormValue] = useState("")
        const dummy = useRef()
     //   dummy.current.scrollIntoView({behavior: 'smooth'})

        useEffect(() => {
            async function loadChat() {
                try{
                    const response = await api.get(`users/${userId}/chats/${chatId}?from=0&to=49`)
                    const numOfMessagesReceived = response.data.length
                    setNumOfMessages(numOfMessagesReceived)
                    console.log("num of msg: " + numOfMessagesReceived)
                    // handle messages ..
                    const receivedMessages = response.data.map(msg => {
                        return {
                            msg: msg,
                            creationDate: msg.creationDate
                        }
                    })
                    // sort by creationDate
                    receivedMessages.sort((a,b) => new Date(a.creationDate) - new Date(b.creationDate))
                    setMessages(receivedMessages)
                } catch (error) {
                    console.error("Details:", error);
                    alert("Invalid Input:\n " + handleError(error));
                }
            }
            loadChat()
            dummy.current.scrollIntoView({behavior: "smooth"})
        }, [])

        const sendMessage = async (e) => {
            console.log("Sending Message")
            e.preventDefault()
            console.log("otherUserId: " + otherUserId)
            const requestBody = JSON.stringify({content: formValue,
                messageType: "PLAIN_TEXT",
                fromUserId: userId,
                toUserId: otherUserId,})
            const response = await api.post(`/users/${userId}/chats/${chatId}`,
                requestBody)
            const receivedMessages = {
                msg: response.data,
                creationDate: response.data.creationDate
            }
            setMessages((prev) => [...prev, receivedMessages])
            setFormValue("")
            console.log(receivedMessages)
        }

        useEffect(() => {
            const timer = setInterval(async () => {
                console.log("Getting new messages...")
                const response = await api.get(`users/${userId}/chats/${chatId}/newMsgs`)
                const receivedMessages = response.data.map(msg => {
                    return {
                        msg: msg,
                        creationDate: msg.creationDate
                    }
                })
                if (receivedMessages.length > 0) {
                    readMessages();
                }
                receivedMessages.sort((a,b) => new Date(a.creationDate) - new Date(b.creationDate))
                console.log(receivedMessages)
                setMessages((prev => [...prev, ...receivedMessages]))
                console.log("I have now " + messages.length + " messages")

                // todo do stuff
            }, 1000)
            // needed here: user.status,

            return () => clearInterval(timer)
        }, [])

      /*  const handleScroll = async e => {
            let elt = e.target
            console.info("Scrolling...")
            if (elt.scrollHeight - elt.scrollTop === elt.clientHeight) {
                // Loading new messages
                console.log("Fetching other messages, if possible")
                const r = await api.get(`users/${userId}/chats/${chatId}/size`)
                if (r.data.size < numOfMessages) {
                    const response = await api.get(`users/${userId}/chats/${chatId}?from=${numOfMessages+1}&to=${numOfMessages+50}`)
                    const numOfMessagesReceived = response.data.size //todo: probably not size
                    setNumOfMessages(numOfMessages + numOfMessagesReceived)
                }
            }
        }*/

        const handleScroll = e => {
            const elt = e.target
            console.info("Scrolling")
        }

        useEffect(() => {
            function e(){
                console.log(messages)
            }
            e()
        }, [])


        return (<main className={"page"}>
            <header className={"header sticky"} >
                Here comes info about User</header>
            <div className={"messageContainer"}
                 // onScroll={handleScroll}
                 >
                {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
                <span ref={dummy}/>
            </div>
            <form className={"chatInput-container"}
                  onSubmit={sendMessage}>
                <input className={"inputField"}
                       value={formValue}
                       onChange={(e) => setFormValue(e.target.value)}
                       placeholder={"Enter your message..."}
                />
                <button className={"submitButton"}
                        type={"submit"}
                        disabled={!formValue}
                        >
                    Send
                </button>
            </form>
        </main>)
    }
    function ChatMessage(props) {
        const message = props.message.msg
        const messageType = message.messageType
        const text = message.content
        const date = new Date(message.creationDate)
        const hour = date.getHours()
        const minute = date.getMinutes()
        const fromUserId = message.from
        const toUserId = message.to

        // with '===', it would always evaluate to false
        const messageClass = userId === fromUserId ? "right-message" : "left-message"
        const name = userId === fromUserId ? "You" : otherUserName

        return(

            <div className={`message ${messageClass}`}>
                <div className={"message-bubble"}>
                    <div className={"message-info"}>
                        <div className={"message-info-name"}>{name}</div>
                        <div className={"message-info-time"}>{hour + ":" + minute}</div>
                    </div>
                    <div className={"message-text"} >
                        {text}
                    </div>
                </div>

            </div>
        )
    }


    return (
    <React.Fragment>
        {ChatRoom()}
    </React.Fragment>
    )
}

export default Chat