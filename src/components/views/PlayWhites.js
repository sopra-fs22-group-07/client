import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/WhiteCardSelection.scss";
import Header from "./Header";
import CardButton from "../ui/CardButton";
import {api, handleError} from "../../helpers/api";
import PropTypes from "prop-types";

//TODO: fetch a game of a random user (todo) and your white cards (done)


const PlayWhites = () => {
  // use react-router-dom's hook to access the history
  const history = useHistory();
  const[blackCard, setBlackCard] = useState(null)
  const[gameId, setGameId] = useState(null)
  const [cards, setCards] = useState(null)
  const userId = localStorage.getItem("id")
  const token = localStorage.getItem("token")

    const WhiteCard = ({card}) => {
        // use react-router-dom's hook to access the history
        const history = useHistory();

        // put the black Card to the Server and proceed to main menu
        const selectCard = async ()  => {
            let cardId = card.id
            const requestBody = JSON.stringify({gameId});
            try {
                await api.post(`users/${userId}/whiteCards/${cardId}`, requestBody);
            } catch (error) {
                console.error("Details:", error);
                alert("Invalid Input:\n " + handleError(error));
            }
            history.push(`/game/menu`)
        }

        return(
            <CardButton className={"card whiteCard"}
                        onClick={() => selectCard()}
                        children={card.text}
                        key={card.id}
            />
        );

    };

    WhiteCard.propTypes = {
        card: PropTypes.object
    };

  // define a state variable (using the state hook).
  // if this variable changes, the component will re-render, but the variable will
  // keep its value throughout render cycles.
  // a component can have as many state variables as you like.
  // more information can be found under https://reactjs.org/docs/hooks-state.html

  // fetch the whiteCards from the server (it is the server's responsibility to give us 12 cards)
    useEffect(() => {
        async function fetchGame() {
            try {
                const response = await api.get(`users/${userId}/games/blackCards`,
                    {
                        // reconfiguration might be necessary in case token is not in localStorage here
                        headers: {
                            "authorization": token
                        }
                    });
                setBlackCard(response.data.blackCard)
                setGameId(response.data.gameId)
                console.log(response.data)
            }
            catch (error) {
                console.error("Details:", error);
                alert("Invalid Input:\n " + handleError(error));
            }
        }

        async function fetchWhiteCards() {
            try {

                const response = await api.get(`users/${userId}/games/whiteCards`,
                    {
                        // reconfiguration might be necessary in case token is not in localStorage here
                        headers: {
                            "authorization": token
                        }
                    });
                setCards(response.data)
                console.log(response.data)
            }
            catch (error) {
                console.error("Details:", error);
                alert("Invalid Input:\n " + handleError(error));
            }
        }
        fetchGame();
        fetchWhiteCards();
    }, []);

    // placeholder in case of failure
    let cardsContent = <div>No white cards available</div>
    let blackCardContent = <div>No black card available</div>

    if(cards) {
        // TODO: onClick: ask to confirm this card, then make api call to submit this card choice, then reload page
        cardsContent =
            <ul className={"game card-list"}>
                {cards.map(card => (
                    <WhiteCard card={card} key={card.id}/>
                ))}
            </ul>
    }
    if(blackCard){
        blackCardContent =
            <CardButton className={"card blackCard"}>
                {blackCard.text}
            </CardButton>
    }

  return (
    <React.Fragment>
        <Header view="game"/>
        <div className={"game description"}>
            <h1>Choose a White Card for the provided Black Card</h1>
        </div>

        <BaseContainer className={"menu container"}>
            {blackCardContent}
        </BaseContainer>
        <div className={"game description"}>
            <h1>Pick a white card</h1>
        </div>

        <BaseContainer className={"menu container"}>
            {cardsContent}
        </BaseContainer>
    </React.Fragment>
  );
}

export default PlayWhites;