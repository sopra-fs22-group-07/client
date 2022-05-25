import {useLocation} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import {api, handleError} from "../../helpers/api";
import "styles/views/Chat.scss";
import { css } from "@emotion/react";
import {MoonLoader} from "react-spinners";
import Avatar from "../ui/Avatar";
import {generateAvatar} from "../ui/MatchListItems";

const Chat = () => {
    // get infos passed by ChatOverview
    const location = useLocation();
    const otherUserId = location.state.otherUserId
    const chatId = location.state.chatId
    const otherUserName = location.state.otherUserName

    // we need id as number, is stored as string.
    const userId = Number.parseInt(localStorage.getItem("id"))
    // this is used for keeping track of the total number of messages loaded (possible without it)
    const [numOfMessages, setNumOfMessages] = useState(0)


    // At loading of the page, read the messages (call to server)
    useEffect(() => {
        async function initializeRead() {
            await readMessages()
        }
        initializeRead()
            .catch(error => {
            console.error("Details:", error);
            alert("An Error occurred:\n " + handleError(error));
        })
    }, [])

    // read messages
    async function readMessages() {
        await api.put(`users/${userId}/chats/${chatId}/read`).catch(error => {
            console.error("Details:", error);
            alert("An Error occurred:\n " + handleError(error));
        })
    }


    // This is the main (biggest) component of the Chat, composing of many ChatMessages
    function ChatRoom() {
        const [messages, setMessages] = useState(null)
        const [formValue, setFormValue] = useState("")
        const [lastScroll, setLastScroll] = useState(0)
        const [loading, setLoading] = useState(false)

        // messagesDiv is needed to calculate how far the user has scrolled and reset the scroll accordingly
        const messagesDiv = document.getElementById("messages")

        // we insert a dummy element at the end of the messages that we can easily scroll to
        const dummy = useRef(null)

        // used for the loader (when scrolling up - fetching new messages)
        const override = css`
          display: block;
          position: fixed;
          left: 50%;
          top: 130px;
          margin: 0 auto;
          border-color: #1e5adc;
        `;

        // function with optional parameters (not used as of now)
        const executeScroll = (ref = dummy, arg = "smooth") => {
            ref.current.scrollIntoView({behavior: arg})
        }

        // initial loading of the chat (start with 50 messages)
        useEffect(() => {
            async function loadChat() {
                const response = await api.get(`users/${userId}/chats/${chatId}?from=0&to=49`)

                // console.log("Reload chat: num of msg: " + numOfMessagesReceived)
                // map and reverse order of messages
                const receivedMessages = mapMessages(response.data)
                setNumOfMessages(prev => prev + receivedMessages.length)
                console.debug("successfully fetched " + receivedMessages.length + " message" + (receivedMessages.length === 1 ? "" : "s"))

                setMessages(receivedMessages)
            }
            loadChat()
                .catch(error => {
                    console.error("Details:", error);
                    alert("An Error occurred:\n " + handleError(error));
                })
                .then(executeScroll)
        }, [])

        // send a message: the message object gets returned and appended at the end of the messages
        const sendMessage = async (e) => {
            e.preventDefault()
            // as of now, only plain_text is supported anyway

            const requestBody = JSON.stringify({
                content: formValue,
                messageType: "PLAIN_TEXT",
                fromUserId: userId,
                toUserId: otherUserId,}
            )

            const response = await api.post(`/users/${userId}/chats/${chatId}`,
                requestBody)
                .catch(error => {
                    console.error("Details:", error);
                    alert("An Error occurred:\n " + handleError(error));
                })

            const sentMessage = {
                msg: response.data,
                creationDate: response.data.creationDate
            }

            // append sentMessage
            setMessages((prev) => [...prev, sentMessage])
            setNumOfMessages(prev => prev+1)
            // reset form
            setFormValue("")
            // scroll to bottom
            executeScroll()
        }

        function getShouldScroll(tolerance) {
            return messagesDiv && messagesDiv.scrollHeight - messagesDiv.scrollTop - messagesDiv.clientHeight < tolerance
        }

        // every n milliseconds, get the newest messages. Ideally, this would be done with a Websocket.
        useEffect(() => {
            const timer = setInterval(async () => {
                // only scroll to bottom if we have been at the bottom already, allowing for 10px offset.
                const shouldScroll = getShouldScroll(50)

                // Fetch new messages
                const response = await api.get(`users/${userId}/chats/${chatId}/newMsgs`)
                    .catch(error => {
                        console.error("Details:", error);
                        alert("An Error occurred:\n " + handleError(error));
                    })

                const receivedMessages = mapMessages(response.data)
                // read messages
                if (receivedMessages.length > 0) {
                    await readMessages();
                }



                if (receivedMessages.length){
                    console.debug("successfully fetched " + receivedMessages.length + " message" + (receivedMessages.length === 1 ? "" : "s"))
                    // append new messages at the bottom
                    setMessages((prev => [...prev, ...receivedMessages]))
                    setNumOfMessages(prev => prev + receivedMessages.length)
                }


                // only scroll down if we're already at the bottom (if user is reading old messages, that would disturb)
                if (shouldScroll) {
                    executeScroll()
                }
            }, 1000)

            return () => clearInterval(timer)
        }, [])


        function isScrollingUp() {
            // if messageDiv is not yet defined (undefined), just return false
            if (!messagesDiv) {return false}
            const currentScroll = messagesDiv.scrollTop
            const res = currentScroll > 0 && lastScroll <= currentScroll
            setLastScroll(currentScroll)
            return !res
        }

        function mapMessages(res) {
            const receivedMessages = res.map(msg => {
                return {
                    msg: msg,
                    creationDate: msg.creationDate
                }
            })
            // since the oldest messages appear first, we must sort them. Otherwise, the server would have to pass (=save)
            // them in reverse order
            receivedMessages.sort((a,b) => new Date(a.creationDate) - new Date(b.creationDate))
            return receivedMessages
        }

        const handleScroll = async e => {
            const elt = e.target
            if (elt && elt.scrollTop === 0 && isScrollingUp()) {
                // Loading new messages
                // console.log("Fetching other messages, if possible")
                const r = await api.get(`users/${userId}/chats/${chatId}/size`)
                if (r.data > messages.length) {
                    setLoading(true)

                    // console.log("Fetching messages...")
                    const response = await api.get(`users/${userId}/chats/${chatId}?from=${numOfMessages}&to=${numOfMessages + 50}`)
                        .catch(error => {
                            console.error("Details:", error);
                            alert("An Error occurred:\n " + handleError(error));
                        })
                    // artificial timeout to show the loader
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    const receivedMessages = mapMessages(response.data)
                    console.debug("successfully fetched " + receivedMessages.length + " message" + (receivedMessages.length === 1 ? "" : "s"))
                    setNumOfMessages(prev => prev + receivedMessages.length)

                    // prevent scrollTop to stay 0:
                    const before = messagesDiv.scrollHeight
                    setMessages((prev) => [...receivedMessages, ...prev])
                    const after = messagesDiv.scrollHeight
                    // stay at the first message:
                    messagesDiv.scrollTop = after - before

                    setLoading(false)
                }
            }
        }

        return (
            <main className={"page"}>
                <header className={"header sticky"} >
                    <Avatar
                        image={
                            generateAvatar("identicon", otherUserId)
                        }
                        isOnline={"INACTIVE"}
                    />
                    {otherUserName}
                     </header>
                <MoonLoader  loading={loading} css={override} size={20}/>
                <div className={"messageContainer"} id={"messages"}
                     onScroll={handleScroll}
                     >
                    {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
                    <span ref={dummy} />
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
        const text = message.content
        const date = new Date(message.creationDate)
        const hour = date.getHours()
        const minute = date.getMinutes()
        const fromUserId = message.from

        const messageClass = userId === fromUserId ? "right-message" : "left-message"
        const name = userId === fromUserId ? "You" : otherUserName

        return(

            <div className={`message ${messageClass}`}>
                <div className={"message-bubble"}>
                    <div className={"message-info"}>
                        <div className={"message-info-name"}>{name}</div>
                        <div className={"message-info-time"}>
                            {String(hour).padStart(2, '0') + ":" + String(minute).padStart(2, 'O')}
                        </div>
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