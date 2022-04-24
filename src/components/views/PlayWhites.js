import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/WhiteCardSelection.scss";
import Header from "./Header";
import CardButton from "../ui/CardButton";
import {api, handleError} from "../../helpers/api";

//TODO: fetch a game of a random user (todo) and your white cards (done)


const PlayWhites = () => {
  // use react-router-dom's hook to access the history
  const history = useHistory();
  const [cards, setCards] = useState(null)
  const userId = localStorage.getItem("id")
  const token = localStorage.getItem("token")

  // define a state variable (using the state hook).
  // if this variable changes, the component will re-render, but the variable will
  // keep its value throughout render cycles.
  // a component can have as many state variables as you like.
  // more information can be found under https://reactjs.org/docs/hooks-state.html

    // fetch the blackCards from the server (it is the server's responsibility to give us 8 cards)
    useEffect(() => {
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
        fetchWhiteCards();
    }, []);

    // placeholder in case of failure
    let content = <div>No Content Available</div>

    if(cards) {
        // TODO: onClick: ask to confirm this card, then make api call to submit this card choice, then reload page
        content =
            <ul className={"game card-list"}>
                {cards.map(card => (
                    <CardButton className={"card whiteCard"}
                                children={card.text}
                                key={card.id}
                    />
                ))}
            </ul>
    }

  return (
    <React.Fragment>
        <Header view="game"/>
        <div className={"game description"}>
            <h1>Pick a white card</h1>
        </div>

        <BaseContainer className={"menu container"}>
            {content}
        </BaseContainer>
    </React.Fragment>
  );
}

export default PlayWhites;