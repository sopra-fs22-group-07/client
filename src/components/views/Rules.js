import React from "react";
import BaseContainer from "../ui/BaseContainer";
import 'styles/views/Rules.scss'
import 'styles/views/LoginRegistration.scss';
import {useHistory} from "react-router-dom";
import {handleError} from "../../helpers/api";


const Rules = () =>{
    const history = useHistory();
    const id = localStorage.getItem("id")


    function pushURL(url){
        try {
            history.push(url)
        } catch (error) {
            alert(`Something went wrong during the logout: \n${handleError(error)}`);
        }
    }

    function goToHand() {
        pushURL(`/game/hand`)
    }

    function goToPlayWhites() {
        pushURL(`/game/playWhites`)
    }

    function goToRateWhites() {
        pushURL(`/game/rateWhites`)
    }

    function goToMatches() {
        pushURL(`/game/matches`)
    }

    function goToEditPreferences() {
        pushURL(`/users/${id}/edit/preferences`)
    }

    function goToUserProfile() {
        pushURL(`/users/${id}`)
    }

    const handLink = <a className="rules link" onClick={()=>goToHand()}>hand</a>;

    const playLink = <a className="rules link" onClick={()=>goToPlayWhites()}>play</a>;

    const rateLink = <a className="rules link" onClick={()=>goToRateWhites()}>rate</a>;

    const matchLink = (props) => {return <a className="rules link" onClick={()=>goToMatches()}>{props.txt}</a>}

    const textLink = (text, onClick) => {return <a className="rules link" onClick={onClick}>{text}</a>}

    const editPreferencesLink = <a className="rules link" onClick={()=>goToEditPreferences()}>changing your preferences</a>;

    const userProfileLink = <a className="rules link" onClick={()=>goToUserProfile()}>profile</a>;






    let information  = (
        <table className="rules table">

            <div className="rules largeTitle"> About </div>
            <tr className="rules info-container">
                <td> Date against humanity helps you meet people with the same sense of humour and allows you to network with others in a fun way.
                    The basic principle is based on the card game "Cards Against Humanity", where you play White Cards to fill the gap in the Black Cards and the funniest player wins.<br/>
                    You can select your preferences on what players you would like to meet and then find people with the same kind of humor.
                </td>
            </tr>

            <br/>

            <div className="rules largeTitle"> Rules </div>
            <div className="rules smallTitle"> Black Cards </div>
            <tr className="rules info-container">
                <td>When first registering or after 24 hours you can choose one Black Card, which has a Gap to be filled by other players White Cards. <br/>
                    Other players can see you Black Card for 24 hours after you choose it and play White Cards on it.
                    <br/>After 24 hours your {handLink} resets and you get to choose a new Black Card.</td>
            </tr>

            <br/>

            <div className="rules smallTitle"> White Cards </div>
            <tr className="rules info-container">
                <td> Whenever you choose a new Black Card you also get a fixed number of White Cards which you can {playLink} on other Users Black Cards. Try to use them in a way that is as funny or clever as possible.
                    If the other user likes the white card you played you might {matchLink({txt: "match"})}!
                    <br/>After 24 hours your {handLink} resets and you get a new set of White Cards.</td>
            </tr>

            <br/>

            <div className="rules smallTitle"> Rating Cards & Matching </div>
            <tr className="rules info-container">
                <td> Whenever someone has played a White Card on your Black Card, you can {rateLink} their White Card by giving either a thumbs up or thumbs down. <br/>
                    When two players give each other's White Cards a thumbs up, they get match. Matched Users can {matchLink({txt: "chat"})} with each other. <br/>
                    If you don't want to be in contact with the other user anymore, you can unmatch or even block them.</td>
            </tr>

            <br/>

            <div className="rules smallTitle"> Preferences </div>
            <tr className="rules info-container">
                <td> You can edit your preferences in your {userProfileLink}. <br/>
                    You can select the Gender, Age and Radius that you are interested in, so only Black Cards from users that fit these criteria get shown to you.
                    Similarly, your Black Cards only get shown to users that are potentially interested in you.
                </td>
            </tr>

            <br/>

            <div className="rules smallTitle"> No Black Cards to play on? </div>
            <tr className="rules info-container">
                <td> If you still have White Cards left and there are no Black Cards left to play on, consider {editPreferencesLink}, so you might see more players' Black Cards.
                </td>
            </tr>

            <br/>

            <div className="rules largeTitle"> Licence </div>
            <tr className="rules info-container">
                <td>
                    This project based on the work of {textLink("Cards Agains Humanity", () => window.open("https://www.cardsagainsthumanity.com/"))} and {textLink("JSON Against Humanity", ()=>window.open("https://www.crhallberg.com/cah/"))}, and is licensed under the {textLink("Creative Commons BY-NC-SA 4.0 license", () => window.open("https://creativecommons.org/licenses/by-nc-sa/4.0/"))} (as are the afore mentioned projects).
                </td>
            </tr>



        </table>
    )


    return(
        <React.Fragment>
            <BaseContainer className="rules main-container">
                <div className="rules main-container">
                    {information}
                </div>
            </BaseContainer>
        </React.Fragment>
    )

}

export default Rules