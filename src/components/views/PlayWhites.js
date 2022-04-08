import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/WhiteCardSelection.scss";
import Header from "./Header";
import CardButton from "../ui/CardButton";
import MenuContainer from "../ui/MenuContainer";


const PlayWhites = () => {
  // use react-router-dom's hook to access the history
  const history = useHistory();

  // define a state variable (using the state hook).
  // if this variable changes, the component will re-render, but the variable will
  // keep its value throughout render cycles.
  // a component can have as many state variables as you like.
  // more information can be found under https://reactjs.org/docs/hooks-state.html

  return (
    <React.Fragment>
      <Header view="game"/>
      <h1>Pick a white card</h1>

      <MenuContainer className={"menu container"}>

        {/* some card */}
        <CardButton
          className="card whiteCard"
          // TODO: onClick: ask to confirm this card, then make api call to submit this card choice, then reload page
          // onClick={() => history.push('/game/playWhites')}
          children={"This is a white card"}
        />

        {/* some card */}
        <CardButton
          className="card whiteCard"
          // TODO: onClick: ask to confirm this card, then make api call to submit this card choice, then reload page
          // onClick={() => history.push('/game/playWhites')}
          children={"This is a white card"}
        />

        {/* some card */}
        <CardButton
          className="card whiteCard"
          // TODO: onClick: ask to confirm this card, then make api call to submit this card choice, then reload page
          // onClick={() => history.push('/game/playWhites')}
          children={"This is a white card"}
        />


      </MenuContainer>
    </React.Fragment>
  );
}

export default PlayWhites;