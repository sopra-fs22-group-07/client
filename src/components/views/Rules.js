import React from "react";
import BaseContainer from "../ui/BaseContainer";
import 'styles/views/Rules.scss'
import 'styles/views/LoginRegistration.scss';


const Rules = () =>{


    let information  = (
        <table className="rules table">
            <div className="rules largeTitle"> About: </div>
            <tr className="rules info-container">
                <td> Date against humanity helps you meet people with the same sense of humour and allows you to network with others in a fun way.
                    The basic principle is based on the card game "Cards Against Humanity", where you play White Cards to fill the gap in the Black Cards and the funniest player wins.<br/>
                </td>
            </tr>
            <div className="rules largeTitle"> Rules: </div>
            <div className="rules smallTitle"> Black Cards </div>
            <tr className="rules info-container">
                <td>Every day you get to choose one Black Card which has a Gap which will be filled by other players by playing White Cards. Other players can see you Black Card for 24 hours after you choose it. </td>

            </tr>
            <div className="rules smallTitle"> White Cards </div>
            <tr className="rules info-container">
                <td> Each day you get a fixed number of White Cards which you can play on other Users Black Cards. After 24 hours your "Hand" resets and you get a new set of White Cards</td>

            </tr>
            <div className="rules smallTitle"> Rating Cards & Matching </div>
            <tr className="rules info-container">

                <td> Whenever someone has played a White Card on your Black Card you can Rate them by giving either a Thumbs up or Thumbs down. <br/>
                    When two players give each others White Cards a Thumbs Up they get "matched". Matched Users can chat with each other. <br/>
                    If you don't like the other user or are unsure you can either block them or unmatch them</td>

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