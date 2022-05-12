import React, {useEffect, useState} from 'react';
import "styles/views/GameMenu.scss";
import CardButton from "../ui/CardButton";
import {api, handleError} from "../../helpers/api";
import {useHistory, useLocation} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import PropTypes from "prop-types";

function msToHM( ms ) {
    // convert milliseconds to seonds:
    let secs = ms / 1000;
    // get hours
    const hours = parseInt( secs/3600);
    // secs left
    secs = secs % 3600;
    // get minutes
    const minutes = parseInt( secs/60);
    return( hours+"h:"+minutes+"min");
}



const BlackCardSelection = () => {

    const BlackCard = ({card}) => {
        // use react-router-dom's hook to access the history
        const history = useHistory();

        // put the black Card to the Server and proceed to main menu
        const selectCard = async ()  => {
            let id = card.id
            const requestBody = JSON.stringify({id});
            try {
                await api.post(`users/${userId}/games/`, requestBody);
            } catch (error) {
                console.error("Details:", error);
                alert("Invalid Input:\n " + handleError(error));
            }
            history.push(`/game/menu`)
        }

        return(
            <CardButton className={"card blackCard"}
                        onClick={() => selectCard()}
                        children={card.text}
                        key={card.id}
            />
        );

    };

    BlackCard.propTypes = {
        card: PropTypes.object
    };
    const [cards, setCards] = useState(null)
    const [blackCard, setBlackCard] = useState(null)
    const [startTime, setTime] = useState(new Date().toDateString())

    // Because of rendering reasons, we use location here, which allows passing states around components.
    // Here we get the state from Registration / Login, because the localStorage might not have been updated yet.
    // If token / userId is in localStorage, we use this, else we use the state passed from login / registration
    // if we're coming from these components, else we use null and trigger a call to the server which we shall then handle.
    const location = useLocation()
    let userId = null
    let token = null
    try {
        userId = (localStorage.getItem("id")) ? localStorage.getItem("id") : location.state.id
    } catch (e) {
        console.log("No userId found!")
    }
    try {
        token = (localStorage.getItem("token")) ? localStorage.getItem("token") : location.state.token
    } catch (e) {
        console.log("No token found!")
    }

    // fetch the blackCards from the server (it is the server's responsibility to give us 8 cards)
    useEffect(() => {
        async function fetchBlackCard() {
            // get blackCard
            try {
                const response = await api.get(`users/${userId}/games/activeGame`,
                    {
                        // reconfiguration might be necessary in case token is not in localStorage here
                        headers: {
                            "authorization": token
                        }
                    });
                // set black card and time from blackcard, if no blackcard an error gets thrown
                setBlackCard(response.data.blackCard);
                setTime(response.data.creationDate)
            }
            catch (error) {
                if(error.response.status === 404){
                    console.error("Error 404: ", error.response.data.message)
                    // && error.response.data.message === ""
                }else{
                console.error("Details:", error);
                alert("Invalid Input:\n " + handleError(error));
                }
            }
        }

        // get card to choose from
        async function fetchCards() {
            try {
                const response = await api.get(`users/${userId}/games`,
                    {
                        // reconfiguration might be necessary in case token is not in localStorage here
                        headers: {
                            "authorization": token
                        }
                    });
                setCards(response.data)
                console.log("data cards: ", response.data)
            }
            catch (error) {
                console.error("Details:", error);
                alert("Invalid Input:\n " + handleError(error));
            }
        }
        fetchBlackCard();
        fetchCards();

    }, []);

    // placeholder in case of failure
    let textContent;
    let cardContent;
    let now = new Date().toDateString();
    const diffTime = Math.abs(Date.parse(now) - Date.parse(startTime));
    const diffTimeAsString = msToHM(diffTime);

    if(blackCard!==null){
        textContent =
        <div className={"game description"}>
            <h1>You have already chosen a black card</h1>
            <h2>time played on this active black card: {diffTimeAsString}</h2>
        </div>

        cardContent=
        <CardButton className={"card blackCard"} disabled={true}>
            {blackCard.text}
        </CardButton>

    }else if(cards){
        textContent=
            <div className={"game description"}>
                <h1> Choose a Black Card of the Day</h1> </div>

        cardContent =
            <ul className={"game card-list"}>
                {cards.map(card => (
                    <BlackCard card={card} key={card.id}/>
                ))}
            </ul>
    }

    return (
        <React.Fragment>
            {textContent}
            <BaseContainer className={"blackCard-container"}>
                {cardContent}
            </BaseContainer>
        </React.Fragment>
    );
}

export default BlackCardSelection;
