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
       pushURL(`/game/playWhites`)
    }

    function goToRateWhites() {
        pushURL(`/game/rateWhites`)
    }

    function goToRules() {
        pushURL(`/game/rules`)
    }

    function goToMatches() {
        pushURL(`/game/matches`)
    }

    return (
      <React.Fragment>
          <Header view="game"/>

          <MenuContainer className={"menu container"}>
              <CardButton className={"card whiteCard"}
                          onClick={() => goToPlayWhites()}
                          children={"Play White Cards"}
              />

              <CardButton className={"card whiteCard"}
                          onClick={() => goToRateWhites()}
                          children={"Rate Cards"}
              />

              <CardButton className={"card whiteCard"}
                          onClick={() => goToRules()}
                          children={"Rules"}
              />

              <CardButton className={"card whiteCard"}
                          onClick={() => goToMatches()}
                          children={"Go to Matches"}
              />


          </MenuContainer>
      </React.Fragment>
  );
}

export default GameMenu;
