import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import ViewTitle from "components/ui/ViewTitle";
import "styles/ui/CardButton.scss";
import "styles/ui/CardContainer.scss";
import "styles/views/UserHand.scss";
import CardButton from "../ui/CardButton";
import {api, handleError} from "../../helpers/api";
import PropTypes from "prop-types";

/*
for playing white cards on a black Card
 */
const PlayWhites = () => {
   // use react-router-dom's hook to access the history
  const [blackCardPlayed, setBlackCardPlayed] = useState(false)
  const [blackCard, setBlackCard] = useState(null)
  const [gameId, setGameId] = useState(0)
  const [whiteCards, setWhiteCards] = useState(null)
  const [count, setCount] = useState(0)
  const userId = localStorage.getItem("id")
  const cardsPerHand = 8 //constant of how many cards there are in a users hand
  const history = useHistory();

  // function defines what is happening, when a white card gets selected. also renders the white cards
    const WhiteCard = ({card}) => {

        // put the white Card and userId to the game on a Server, reloads useEffects
        const selectCard = async ()  => {
            let cardId = card.id
            const requestBody = JSON.stringify({gameId});
            // card gets played
            await api.post(`users/${userId}/whiteCards/${cardId}`, requestBody)
                .catch(error => {console.error("Details:", error);
                    alert("Invalid Input:\n " + handleError(error));});
            // next card gets displayed, use for statistic, reloads useEffects
            setCount(count + 1)
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

    useEffect(() => {
        // the game of a random user gets fetched
        async function fetchGame() {
            await api.get(`users/${userId}/games/blackCards`)
                .then(response => {
                    setBlackCard(response.data.blackCard);
                    setGameId(response.data.gameId)
                })
                .catch(error => {
                    if (error.response.status === 404) {
                        setBlackCard(null);
                        console.error("Error 404: ", error.response.data.message)
                        // && error.response.data.message === "There is no black card of another user left"
                    } else {
                        console.error("Details:", error);
                        alert("Invalid Input:\n " + handleError(error));
                    }
                });
        }

        // check if user has played back card if not, black card needs to be played first
        async function ownBlackCardPlayed() {
          await api.get(`/users/${userId}/games/blackCards/current`)
            .then(() => {setBlackCardPlayed(true);})
            .catch(error => {
              if (error.response.status === 401 || error.response.status === 404) { setBlackCardPlayed(false); }
              else { console.error("Details: ", error); alert("Invalid Input:\n " + handleError(error)); }});
        }

        // the white cards of the user who is playing gets fetched
        async function fetchWhiteCards() {
            await api.get(`users/${userId}/games/whiteCards`).then(response => {setWhiteCards(response.data)})
                .catch(error => {console.error("Details:", error); alert("Invalid Input:\n " + handleError(error));});
        }

        fetchGame();
        fetchWhiteCards();
        ownBlackCardPlayed();

    }, [count]); // when count gets changed, new call to useEffects

  let drawText = "Somehow there don't seem to be any cards today"
  if(whiteCards) { //If there are cards then display how many are left to draw today
    if(whiteCards.length>cardsPerHand){
      drawText= "You can play " +(whiteCards.length) + " more card" + ((whiteCards.length === 1) ? "" : "s") + " today"
    }
    else(drawText="No more Cards left to draw today")
  }
  if(!blackCardPlayed) { // If the black card has not been played no white cards are available
    drawText="White Cards will be available once you played a black card"
  } else if (!blackCard) { // own black card was played but no other black card is available
    if(whiteCards && whiteCards.length > 0){
      drawText= "You can play " +(whiteCards.length) + " more card" + ((whiteCards.length === 1) ? "" : "s") + " today"
    }
  }

  let drawPile =
    <CardButton className="card whiteCard" disabled={true}>
      {drawText}
    </CardButton>

    // placeholder in case of failure
    let whiteCardsContent = <div className="hand">No white cards available</div>;
    let blackCardContent = <div className="hand">No black cards available</div>;

    // If the black card has not been played yet, black card needs to be played
    if (!blackCardPlayed) {
      blackCardContent = <CardButton className="card blackCard"
                                     onClick={() => {history.push('/game/select/blackCard')}}>
        No black Card set, In order to play you need to choose a black Card
      </CardButton>
    }

    // If no game is left to play on (return value of blackCard is null), this is shown:
    if (blackCardPlayed && !blackCard) {
      blackCardContent = <CardButton className={"card blackCard"}
                                     onClick={() => {history.push(`/users/${userId}/edit/preferences`)}}>
        No black card available would you like to change your preferences?
      </CardButton>
    }

    // black card gets displayed if fetched
    if(blackCardPlayed && blackCard){
        blackCardContent =
            <CardButton className={"card blackCard"} disabled={true}>
                {blackCard.text}
            </CardButton>

        // white cards get displayed if fetched and a blackCard is not null
        if(whiteCards) {
            const cardsOnHand = whiteCards.slice(0, cardsPerHand);
            whiteCardsContent =
                <ul className={"hand card-list"}>
                    {cardsOnHand.map(card => (
                        <WhiteCard card={card} key={card.id}/>
                    ))}
                  {drawPile}
                </ul>
        }
    }

    // has to be called in case the above did not fill it
    if (!whiteCards || !(blackCardPlayed && blackCard)) {
      whiteCardsContent = drawPile
    }

  return (
    <React.Fragment>
      <ViewTitle>
        Use a White Card to fill in the Blank
      </ViewTitle>
      <div className="hand main-container">
        <div className={"hand card-container"}>
          <div className="hand text">
            <h2>Given Black Cards:</h2>
          </div>
          {blackCardContent}
        </div>
        <div className={"hand card-container"}>
          <div className="hand text">
            <h2>Pick a white cards:</h2>
          </div>
          {whiteCardsContent}
        </div>
      </div>
    </React.Fragment>
  );
}

export default PlayWhites;