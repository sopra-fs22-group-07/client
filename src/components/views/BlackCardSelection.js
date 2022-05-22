import React, {useEffect, useState} from 'react';
import "styles/views/GameMenu.scss";
import CardButton from "../ui/CardButton";
import ViewTitle from "components/ui/ViewTitle";
import {api, handleError} from "../../helpers/api";
import {useHistory} from "react-router-dom";
import CardContainer from "../ui/CardContainer";
import PropTypes from "prop-types";
import {ONE_DAY, ONE_HOUR, ONE_MINUTE, ONE_SECOND} from "../../helpers/Time";

// zero pads a number and returns a string with min length 2.
function pad(number) {
    return String(number).padStart(2, "0")
}

// converts ms to HH:MM:SS
function msToHHMMSS (ms) {
    if (ms <= 0) return "00:00:00"

    // converts milliseconds in normal time
    let hours = Math.floor(ms / (ONE_HOUR))
    let minutes = Math.floor((ms / ONE_MINUTE) % 60)
    let seconds = Math.floor((ms / ONE_SECOND) % 60)

    return pad(hours)+":"+pad(minutes)+":"+pad(seconds);
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
    const [cards, setCards] = useState(null);
    const [blackCard, setBlackCard] = useState(null);
    const [creationDate, setCreationDate] = useState(new Date());
    const [gameDuration, setGameDuration] = useState(-1);
    const [timeLeft, setTimeLeft] = useState(ONE_DAY);
    // newGame: if countdown is finished, the site gets the card again (because know able to choose)
    const [isCountdownActive, setIsCountdownActive] = useState(false);

    // get the userID from the localStorage
    const userId = localStorage.getItem("id")

    function calcTimeLeft() {
        return (gameDuration - (new Date() - new Date(creationDate)))
    }

    // fetch the blackCards from the server (it is the server's responsibility to give us 8 cards)
    useEffect(() => {

        if (!isCountdownActive) {
            api.get(`users/${userId}/games/activeGame`)
                .then(response => {
                    setBlackCard(response.data.blackCard);
                    setCreationDate(response.data.creationDate)
                    setGameDuration(response.data.gameDuration)
                    setTimeLeft(response.data.gameDuration - (new Date() - new Date(response.data.creationDate)))
                    setIsCountdownActive(true)
                })
                .catch(error => {
                    if(error.response.status === 404){
                        setBlackCard(null);
                        // && error.response.data.message === ""
                    }else{
                        console.error("Details:", error);
                        alert("Invalid Input:\n " + handleError(error));
                    }
                })

            api.get(`users/${userId}/games`)
                .then(response => setCards(response.data))
                .catch(error => {
                    console.error("Details:", error);
                    alert("Invalid Input:\n " + handleError(error));
                })
        } else {
            const timer = setInterval(async () => {
                const tL = calcTimeLeft()
                setTimeLeft(tL)
                if (tL <= 0) {
                    setIsCountdownActive(false)
                }
            }, ONE_SECOND)
            return () => clearInterval(timer)
        }

    }, [isCountdownActive]); // new call to content if state changes




    // define content variables
    let textContent;
    let cardContent;
    // get content
    if(blackCard!==null){
        textContent =
            <ViewTitle>
                You can choose a new black card in {msToHHMMSS(timeLeft)}
            </ViewTitle>
        cardContent=
            <CardButton className={"card blackCard"} disabled={true}>
                {blackCard.text}
            </CardButton>

    }else if(cards){
        textContent=
            <ViewTitle>
                Choose a Black Card of the Day
            </ViewTitle>
        cardContent =
            <ul>
                {cards.map(card => (
                    <BlackCard card={card} key={card.id}/>
                ))}
            </ul>
    }

    return (
        <React.Fragment>
            {textContent}
            <CardContainer className={"blackCard-container"}>
                {cardContent}
            </CardContainer>
        </React.Fragment>
    );
}

export default BlackCardSelection;
