import React, {useEffect, useState} from 'react';
import PropTypes from "prop-types";
import {useHistory} from "react-router-dom";
import {api, handleError} from "../../helpers/api";
import CardButton from "../ui/CardButton";
import "styles/ui/CardButton.scss";
import "styles/views/UserHand.scss";

const UserHand = () => {
  const [blackCard, setBlackCard] = useState(null)
  const [whiteCards, setWhiteCards] = useState(null)
  const userId = localStorage.getItem("id")
  const cardsPerHand = 8 //constant of how many cards there are in a users hand
  const history = useHistory();

  const WhiteCard = ({card}) => {
    return(
      <CardButton className={"card whiteCard simple"}
            children={card.text}
            key={card.id}
      />
    );
  };
  WhiteCard.propTypes = {
    card: PropTypes.object
  };

  useEffect( () => {
    async function getBlackCard() {
      await api.get(`/users/${userId}/games/blackCards/current`)
        .then(response => {setBlackCard(response.data);})
        .catch(error => {
          if (error.response.status === 401 || error.response.status === 404) {
            setBlackCard(null);
          } else {
            console.error("Details: ", error);
            alert("Invalid Input:\n " + handleError(error));
          }
        });
    }
    async function getWhiteCards() {
      await api.get(`/users/${userId}/games/whiteCards`)
        .then(response => {setWhiteCards(response.data);})
        .catch(error => {
          if(error.response.status === 401 || error.response.status === 404) {
            setWhiteCards(null);
          } else {
            console.error("Details: ", error);
            alert("Invalid Input:\n " + handleError(error));
          }
        });
    }
    getBlackCard();
    getWhiteCards();
  }, []);

  let blackCardContent
  let whiteCardsContent = <div className="hand">No more white Cards available</div>
  let cardsOnPile;

  if(blackCard) { // black card has been played
    blackCardContent = <CardButton className="card blackCard" disabled={true}>
      {blackCard.text}
    </CardButton>
  } else { // black card has not been played
    blackCardContent = <CardButton className="card blackCard"
                     onClick={() => {history.push('/game/select/blackCard')}}>
      No black Card set, Choose black Card
    </CardButton>
  }

  if (whiteCards){ // normally empty array is returned no null unless errors
    if (whiteCards.length === 0 && !blackCard) { // black card needs to be played
      whiteCardsContent = <CardButton className="card whiteCard simple"
                      onClick={() => {history.push('/game/select/blackCard')}}>
        No white Card available, Did you choose a black Card?
      </CardButton>
    } else if (whiteCards.length === 0 && blackCard) { // all white cards have been played
      whiteCardsContent = <CardButton className="card whiteCard" disabled={true}>
        No more white Cards available for today
      </CardButton>
    } else if (whiteCards.length > 0) { // there are still white cards available
      if (whiteCards.length > cardsPerHand) { // there are more white cards available than the user is allowed to see
        const diff = whiteCards.length - cardsPerHand;
        cardsOnPile = <CardButton className="card whiteCard" disabled={true} style={{justifySelf: "flex-end"}}>
          You can draw {diff} more card{(diff === 1) ? "" : "s"}.
        </CardButton>
      }
      const cardsOnHand = whiteCards.slice(0, cardsPerHand);
      whiteCardsContent =
        <ul className={"hand card-list"}>
          {cardsOnHand.map(card => (
            <WhiteCard card={card} key={card.id}/>
          ))}
          {cardsOnPile}
        </ul>
    }
  }


  return (
    <React.Fragment>
      <div className="hand main-container">
        <div className={"hand card-container"}>
          <div className="hand text">
            <h2>Your Black Cards:</h2>
          </div>
          {blackCardContent}
        </div>
        <div className={"hand card-container"}>
          <div className="hand text">
            <h2>Your White Cards:</h2>
          </div>
          {whiteCardsContent}
        </div>
      </div>
    </React.Fragment>
  );
}

export default UserHand;