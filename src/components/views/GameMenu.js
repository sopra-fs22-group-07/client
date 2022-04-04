import React from 'react';

import "styles/views/GameMenu.scss";
import CardButton from "../ui/CardButton";
import Header from "./Header";
import MenuContainer from "../ui/MenuContainer";
import {handleError} from "../../helpers/api";
import {useHistory} from "react-router-dom";


const GameMenu = () => {
  // use react-router-dom's hook to access the history

  const history = useHistory();

    function pushURL(url){
        try {
            history.push(url)
        } catch (error) {
            alert(`Something went wrong during the logout: \n${handleError(error)}`);
        }
    }

    function goToPlayWhites() {
       pushURL(`/playWhites`)
    }

    function goToRateWhites() {
        pushURL(`/rateWhites`)
    }

    function goToRules() {
        pushURL(`/rules`)
    }

    function goToMatches() {
        pushURL(`/matches`)
    }

    return (
      <React.Fragment>
          <Header view="game"/>

          <MenuContainer className={"menu container"}>
              <CardButton className={"card whiteCard"}
                          onClick={() => goToPlayWhites()}
              >
                  Play White Cards
              </CardButton>
              <CardButton className={"card whiteCard"}
                          onClick={() => goToRateWhites()}
              >
                  Rate Cards
              </CardButton>
              <CardButton className={"card whiteCard"}
                          onClick={() => goToRules()}
              >
                  Rules
              </CardButton>
              <CardButton className={"card whiteCard"}
                          onClick={() => goToMatches()}
              >
                  Go to Matches
              </CardButton>

          </MenuContainer>
      </React.Fragment>
  );
}

export default GameMenu;
