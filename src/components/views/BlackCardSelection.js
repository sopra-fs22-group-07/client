import React, {useEffect, useState} from 'react';
import "styles/views/GameMenu.scss";
import CardButton from "../ui/CardButton";
import Header from "./Header";
import {api, handleError} from "../../helpers/api";
import {useHistory, useLocation} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";



const BlackCardSelection = () => {

    const history = useHistory()
    const [cards, setCards] = useState(null)


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
            }
            catch (error) {
                // todo if user already has selected a Card, server should probably throw an error
                console.error("Details:", error);
                alert("Invalid Input:\n " + handleError(error));
            }
        }
        fetchCards();
    }, []);

    // put the black Card to the Server and proceed to main menu
    async function selectCard(id) {
        // let id = card.id
        console.log('Card id: ', id)
        const requestBody = JSON.stringify({id});
        try {
            await api.post(`users/${userId}/games/`, requestBody);
        } catch (error) {
            console.error("Details:", error);
            alert("Invalid Input:\n " + handleError(error));
        }
        history.push(`/game/menu`)
    }


    // placeholder in case of failure
    let content = <div>No Content Available</div>

    if(cards) {
        content =
            <ul className={"game card-list"}>
                {cards.map(card => (
                    <CardButton card = {card}
                                children={card.text}
                                key={card.id}
                                className={"card blackCard"}
                                onClick={(card) => selectCard(card.id)}
                                />
                ))}
            </ul>
    }

    return (
        <React.Fragment>
            <Header view="game"/>
            <div className={"game description"}>
                Choose a Black Card of the Day
            </div>
            <BaseContainer className={"blackCard-container"}>
                {content}
            </BaseContainer>
        </React.Fragment>
    );
}

export default BlackCardSelection;
