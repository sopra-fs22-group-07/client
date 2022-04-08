import React, {useEffect, useState} from 'react';
import "styles/views/GameMenu.scss";
import CardButton from "../ui/CardButton";
import Header from "./Header";
import MenuContainer from "../ui/MenuContainer";
import {api, handleError} from "../../helpers/api";
import {useHistory} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import Card from "../../models/Card";
import PropTypes from "prop-types";


const BlackCardSelection = () => {



    const history = useHistory();
    async function selectCard() {
        const requestBody = JSON.stringify(1);
        try {
            const response = await api.post(`games/${localStorage.getItem("id")}`, requestBody,
                {
                    headers: {
                        authorization: localStorage.getItem("token")
                    }
                });

        } catch (error) {
            console.error("Details:", error);
            alert("Invalid Input:\n " + handleError(error));
        }
        history.push(`/game/menu`)
    }

    const CardS = ({card}) => (
        <CardButton className={"card whiteCard"}
                    onClick={()=>selectCard()}
                    >
            {card.text}
        </CardButton>
    )

    CardS.propTypes = {
        card: PropTypes.object
    };

    const [cards, setCards] = useState(null)
    useEffect(() => {
        async function fetchData() {
            console.log("Getting Content...")
            try {
                const response = await api.get(`games/${localStorage.getItem("id")}`);
                console.log(response)
                setCards(response.data)
                console.log(response.data)
                console.log(cards)
            }
            catch (error) {
                console.error("Details:", error);
                alert("Invalid Input:\n " + handleError(error));
            }
        }
        fetchData();
    }, []);

    console.log(cards)
    let content = <div>No Content Available</div>
    useEffect(() => {
        if(cards) {
            content =
                <BaseContainer className={"blackCard-container"}>
                    <ul className={"game card-list"}>
                        {cards.map(card => (
                            <CardS card={card} key={card.cardId}/>
                        ))}
                    </ul>
                </BaseContainer>
        }
    }, [cards])


    return (
        <React.Fragment>
            <Header view="game"/>
            <div className={"game description"}>
                Choose a Black Card of the Day
            </div>
            {content}





        </React.Fragment>
    );
}

export default BlackCardSelection;
