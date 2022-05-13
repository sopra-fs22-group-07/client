import React, {useEffect, useState} from 'react';
import "styles/views/GameMenu.scss";
import CardButton from "../ui/CardButton";
import {api, handleError} from "../../helpers/api";
import {useHistory} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import PropTypes from "prop-types";
import {ONE_DAY, ONE_HOUR, ONE_MINUTE, ONE_SECOND} from "../../helpers/Time";


// converts ms to HH:MM:SS
function msToHHMMSS (ms) {
    // converts milliseconds in normal time
    let hours = Math.floor(ms / (ONE_HOUR))
    let minutes = Math.floor((ms / ONE_MINUTE) % 60)
    let seconds = Math.floor((ms / ONE_SECOND) % 60)

    // add styling
    if(hours<10){
        hours = '0' + hours;
    }
    if(minutes<10){
        minutes = '0'+ minutes;
    }
    if(seconds<10){
        seconds = '0'+ seconds;
    }
    return hours+":"+minutes+":"+seconds;
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
    const [timeLeft, setTimeLeft] = useState(ONE_DAY);
    // newGame: if countdown is finished, the site gets the card again (because know able to choose)
    const [countdown, setCountdown] = useState(false);

    // get the userID from the localStorage
    const userId = localStorage.getItem("id")

    // fetch the blackCards from the server (it is the server's responsibility to give us 8 cards)
    useEffect(() => {
        async function fetchBlackCard() {
            // get blackCard
            try {
                const response = await api.get(`users/${userId}/games/activeGame`);

                // set black card and time from blackcard, if no blackcard an error gets thrown
                setBlackCard(response.data.blackCard);
                setCreationDate(response.data.creationDate)
            }
            catch (error) {
                if(!(error.response.status === 404)){
                    // && error.response.data.message === ""
                    console.error("Details:", error);
                    alert("Invalid Input:\n " + handleError(error));
                }
            }
        }

        // get card to choose from
        async function fetchCards() {
            try {
                const response = await api.get(`users/${userId}/games`)
                setCards(response.data)
            }
            catch (error) {
                console.error("Details:", error);
                alert("Invalid Input:\n " + handleError(error));
            }
        }
        fetchBlackCard();
        fetchCards();

    }, [countdown]); // when countdown is reached, new call to useEffects

    // stops the interval call
    function checkIfIntervalStop() {
        // the cals get stopped if the countdown is finished or the url is changed
        if(countdown===true || !window.location.href.includes("/game/select/blackCard"))
        {
            clearInterval(timeInterval);
    }}

    // gets called all seconds and updates the countdown
    function calcTimeLeft(creationDate){
        // difference between now and creationDate
        const differenceInMs = new Date() - new Date(creationDate);
        // calculate the time left
        const timeLeft = ONE_DAY-differenceInMs;
        // when there is no time left, the black cards get fetched again
        if(timeLeft===0){
            // TODO: this leads to en error in the moment.
            //  Can the activeGame not be pushed to the past games?
            // useEffect gets fetched again
            setCountdown(true);
        }
        // checks if the function call stops
        checkIfIntervalStop();
        // set the time
        setTimeLeft(timeLeft);
    }

    // calls the calcTimeLeft function each second with the parameter creationDate
    let timeInterval = setInterval(calcTimeLeft, ONE_SECOND, creationDate);
    // changes time in HH:MM:SS
    let timeInHHMMSS =  msToHHMMSS(timeLeft);

    // define content variables
    let textContent;
    let cardContent;
    // get content
    if(blackCard!==null){
        textContent =
        <div className={"game description"}>
            <h1> You can choose a new black card in {timeInHHMMSS} </h1>
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
