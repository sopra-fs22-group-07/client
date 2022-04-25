import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/WhiteCardSelection.scss";
import Header from "./Header";
import CardButton from "../ui/CardButton";
import {api, handleError} from "../../helpers/api";
import PropTypes from "prop-types";

/*
for playing white cards on a black Card
 */
const PlayWhites = () => {
  // use react-router-dom's hook to access the history
  const history = useHistory();
  const[blackCard, setBlackCard] = useState(null)
  const[gameId, setGameId] = useState(null)
  const [cards, setCards] = useState(null)
    const [count, setCount] = useState(0)
  const userId = localStorage.getItem("id")
  const token = localStorage.getItem("token")

    // function defines what is happening, when a white card gets selected. also renders the white cards
    const WhiteCard = ({card}) => {

        // put the white Card and userId to the game on a Server, reloads useEffects
        const selectCard = async ()  => {
            if (window.confirm("Press OK to confirm this card")){
                let cardId = card.id
                const requestBody = JSON.stringify({gameId});
                // card gets played
                try {
                    await api.post(`users/${userId}/whiteCards/${cardId}`, requestBody);
                } catch (error) {
                    console.error("Details:", error);
                    alert("Invalid Input:\n " + handleError(error));
                }
                // next card gets displayed, use for statistic, reloads useEffects
                setCount(count + 1)
            }
            else{
                console.log("Card was not played!")
            }
        }
        // design of white card
        return(
            <CardButton className={"card whiteCard"}
                        onClick={() => selectCard()}
                        children={card.text}
                        key={card.id}
            />
        );

    };

    // test if white card is of type card
    WhiteCard.propTypes = {
        card: PropTypes.object
    };

  // define a state variable (using the state hook).
  // if this variable changes, the component will re-render, but the variable will
  // keep its value throughout render cycles.
  // a component can have as many state variables as you like.
  // more information can be found under https://reactjs.org/docs/hooks-state.html

    useEffect(() => {
        // the game of a random user gets fetched
        async function fetchGame() {
            try {
                const response = await api.get(`users/${userId}/games/blackCards`,
                    {
                        headers: {
                            "authorization": token
                        }
                    });
                setBlackCard(response.data.blackCard)
                setGameId(response.data.gameId)
            }
            catch (error) {
                if(error.response.status === 404
                    && error.response.data.message === "There is no black card of another user left"){
                    setBlackCard(null);
                    console.error("Error 404: ", error.response.data.message)
                }
                else{
                    console.error("Details:", error);
                    alert("Invalid Input:\n " + handleError(error));}
            }
        }

        // the white cards of the user who is playing gets fetched
        async function fetchWhiteCards() {
            try {

                const response = await api.get(`users/${userId}/games/whiteCards`,
                    {
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
    }, [count]); // when count gets changed, new call to useEffects

    // placeholder in case of failure
    let cardsContent = <div>No white cards available</div>
    // If no game is left to play on (return value of blackCard is null), this is shown:
    let blackCardContent =
        <CardButton className={"card blackCard"}>
            No black card available
        </CardButton>

    // black card gets displayed if fetched
    if(blackCard){
        blackCardContent =
            <CardButton className={"card blackCard"}>
                {blackCard.text}
            </CardButton>

        // white cards get displayed if fetched and a blackCard is not null
        if(cards) {
            cardsContent =
                <ul className={"game card-list"}>
                    {cards.map(card => (
                        <WhiteCard card={card} key={card.id}/>
                    ))}
                </ul>
        }
    }

  return (
    <React.Fragment>
        <Header view="game"/>
        <div className={"game description"}>
            <h1>Use a White Card to fill in the Blank</h1>
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