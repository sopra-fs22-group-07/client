import React, {useEffect, useState} from 'react';
import "styles/views/GameMenu.scss";
import CardButton from "../ui/CardButton";
import Header from "./Header";
import {api, handleError} from "../../helpers/api";
import {useHistory} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";



const BlackCardSelection = () => {

    const history = useHistory();
    const [cards, setCards] = useState(null)

    useEffect(() => {
        async function fetchCards() {
            try {
                const response = await api.get(`games/${localStorage.getItem("id")}`);
                setCards(response.data)
            }
            catch (error) {
                console.error("Details:", error);
                alert("Invalid Input:\n " + handleError(error));
            }
        }
        fetchCards();
    }, []);

    async function selectCard(card) {
        let id = card.id
        const requestBody = JSON.stringify({id});
        try {
            await api.post(`games/${localStorage.getItem("id")}`, requestBody);
        } catch (error) {
            console.error("Details:", error);
            alert("Invalid Input:\n " + handleError(error));
        }
        history.push(`/game/menu`)
    }


    let content = <div>No Content Available</div>

    if(cards) {
        content =
            <ul className={"game card-list"}>
                {cards.map(card => (
                    <CardButton className={"card blackCard"}
                                onClick={(c) => selectCard(c)}
                                children={card.text}
                                key={card.id}
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
