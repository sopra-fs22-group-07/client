import React, {useEffect, useState} from 'react';
import PropTypes from "prop-types";
import {useHistory} from "react-router-dom";
import {api, handleError} from "../../helpers/api";
import BaseContainer from "../ui/BaseContainer";
import CardButton from "../ui/CardButton";
import "styles/ui/CardButton.scss";
import "styles/views/GameMenu.scss";

const UserHand = () => {
    const [blackCard, setBlackCard] = useState(null)
    const [whiteCards, setWhiteCards] = useState(null)
    const userId = localStorage.getItem("id")
    const token = localStorage.getItem("token")
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
            try {
                const response = await api.get(`/users/${userId}/games/blackCards/current`,
                        {
                        headers: {
                            "authorization": token
                        }
                    });
                setBlackCard(response.data);
            } catch (error) {
                if(error.response.status === 401 || error.response.status === 404) {
                    setBlackCard(null);
                    console.error("Error " , error.response.status, ": ", error.response.message);
                } else {
                    console.error("Details: ", error);
                    alert("Invalid Input:\n " + handleError(error));
                }
            }
        }
        async function getWhiteCards() {
            try {
                const response = await api.get(`users/${userId}/games/whiteCards`,
                    {
                        headers: {
                            "authorization": token
                        }
                    });
                setWhiteCards(response.data);
                console.log(response)
            } catch (error) {
                if(error.response.status === 401 || error.response.status === 404) {
                    setWhiteCards(null);
                    console.error("Error " , error.response.status, ": ", error.response.message);
                } else {
                    console.error("Details: ", error);
                    alert("Invalid Input:\n " + handleError(error));
                }
            }
        }
        getBlackCard();
        getWhiteCards();
    }, []);

    let blackCardContent
    let whiteCardsContent = <div className="hand">No white Cards available</div>

    if(blackCard) {
        blackCardContent = <CardButton className="card blackCard" disabled={true}>
            {blackCard.text}
        </CardButton>
    } else {
        blackCardContent = <CardButton className="card blackCard"
                                       onClick={() => {history.push('/game/select/blackCard')}}>
            No black Card set, Choose black Card
        </CardButton>
    }

    if(whiteCards) {
        const cardsOnHand = whiteCards.slice(0, cardsPerHand);
        whiteCardsContent =
            <ul className={"game card-list"}>
                {cardsOnHand.map(card => (
                    <WhiteCard card={card} key={card.id}/>
                ))}
            </ul>
    }

    return (
        <React.Fragment>
            <BaseContainer className="base-container userPage main-container">
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <div className="userPage text">
                                    <h2>Your Black Cards:</h2>
                                </div>
                            </td>
                            <td>
                                <div className="userPage text">
                                    <h2>Your White Cards:</h2>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {blackCardContent}
                            </td>
                            <td>
                                <div className={"menu container"}>
                                    {whiteCardsContent}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </BaseContainer>
        </React.Fragment>
    );
}

export default UserHand;