import React from 'react';

import "styles/views/GameMenu.scss";
import CardButton from "../ui/CardButton";
import Header from "./Header";
import MenuContainer from "../ui/MenuContainer";


const GameMenu = () => {
  // use react-router-dom's hook to access the history

  // const history = useHistory();

  return (
      <React.Fragment>
          <Header view="game"/>

          <MenuContainer className={"menu container"}>
              <CardButton className={"card whiteCard"}
              >
                  Play White Cards
              </CardButton>
              <CardButton className={"card whiteCard"}
              >
                  Rate Cards
              </CardButton>
              <CardButton className={"card whiteCard"}
              >
                  Rules
              </CardButton>
              <CardButton className={"card whiteCard"}
              >
                  Go to Matches
              </CardButton>

          </MenuContainer>
      </React.Fragment>
  );
}

export default GameMenu;
