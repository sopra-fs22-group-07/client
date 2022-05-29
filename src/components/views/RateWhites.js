import React, {useEffect, useState} from 'react';
import CardButton from "../ui/CardButton";
import {Button} from "../ui/Button";
import {api, handleError} from "../../helpers/api";
import IconButton from '@mui/material/IconButton';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';


import 'styles/views/UserPage.scss'
import CardContainer from 'components/ui/CardContainer';
import ViewTitle from "../ui/ViewTitle";

/*
For Rating the White Cards that got played on your Black Cards
 */
const RateWhites = () => {
    //Users own Black Card
    const[blackCard, setBlackCard] = useState(null)
    //all the plays
    const[plays, setPlays] = useState(null)
    //the play that is currently relevant (contains WhiteCard + GameId, UserId (of user who played)
    const[currentPlay, setCurrentPLay] = useState(null)
    //playsEmpty gets used to fetch new votes
    const[playsEmpty, setPlaysEmpty] = useState(false)

    const userId = localStorage.getItem("id")

    //Get own game (BlackCard with all plays(WhiteCards) corresponding to it)
    useEffect(()=>{
        async function fetchVote() {
            try { //Getting a "Vote" which is a game (BlackCard with all it's played WhiteCards)
                const response = await api.get(`users/${userId}/games/vote`);
                setBlackCard(response.data.blackCard)
                setPlays(response.data.plays)
                setCurrentPLay(response.data.plays.shift()) //This removes the first item of the array, which is the first play
            }
            catch(error){
                // when no active game left or past game with open plays
                if (error.response.status === 404
                    && error.response.data.message === "no active game or past game with plays left") {
                    setBlackCard(null);
                    setCurrentPLay(null);
                    console.error("Error 404: ", error.response.data.message)
                } else {
                    console.error("Details:", error);
                    alert("Invalid Input:\n " + handleError(error));
                }
            }

        }
        fetchVote();
    }, [playsEmpty]); //When this gets changed then we get a new call to useEffects



    //PlaceHolder if no BlackCard can be found (yet)
    let blackCardContent = <CardButton disabled={true} className={"card blackCard"}> No Black Card to be found </CardButton>
    //If a black Card is found: Replace the placeholder text with the Card text
    if(blackCard){
        blackCardContent = (
            <CardButton disabled={true} className={"card blackCard"}> {blackCard.text}</CardButton>
        )
    }
    //PlaceHold if no Whitecard is found (yet)
    let whiteCardContent = <CardButton disabled={true} className={"card whiteCard"}> No White Card to Vote on at the moment</CardButton>
    //If a white cards is found
    if(currentPlay){
        whiteCardContent = (
            <CardButton className={"card whiteCard simple"}> {currentPlay.card.text}</CardButton>
        )
    }


    /**
     * Method that makes API call that the card is liked and therefore accepted - possibility for match
     */
    function acceptCard() {
        voteOnCard(true)
    }


    /**
     * Method that should makes the API Call that the card is not Liked by user and therefore declined
     */
    function declineCard() {
        voteOnCard(false)
    }

    /**
     * Method which makes put request to vote on the Cards
     * @param like Boolean, true => User likes Card, false => user doesn't like card
     */

    async function voteOnCard(like){

        if(plays.length===0) {
            setPlaysEmpty(true)
        }

        const otherUserId = currentPlay.userId.toString()
        const gameId = currentPlay.gameId
        const requestBody = JSON.stringify({userId:otherUserId, like})
        await api.put(`/users/${userId}/games/${gameId}/vote`, requestBody);
        setCurrentPLay(plays.shift())
    }

    return(
        <React.Fragment>
            <ViewTitle>
                Rate White Cards
            </ViewTitle>
            <CardContainer className={"container"}>
                {blackCardContent}
            </CardContainer>
            <CardContainer className={"container"}>
                {whiteCardContent}
            </CardContainer>
            <div className={"center"}>
                <IconButton
                    disabled={currentPlay==null}
                    onClick={() => acceptCard()}
                >
                    <ThumbUpIcon
                        sx={{fontSize: 45}}
                    />
                </IconButton>
                <IconButton
                    disabled={currentPlay==null}
                    onClick={() => declineCard()}
                >
                    <ThumbDownIcon
                        sx={{fontSize: 45}}
                    />
                </IconButton>
            </div>
        </React.Fragment>
    )
}

export default RateWhites;