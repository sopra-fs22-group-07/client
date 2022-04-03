import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/WhiteCardSelection.scss";
import Header from "./Header";
import { Card } from 'components/ui/Card';


const WhiteCardSelection = () => {
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

      {/* div containing the white cards */}
      <div style={ {position: "fixed", bottom: 0, margin:"0px auto", left:0, right:0} }>
        <BaseContainer className="card container">

          {/* some card */}
          <Card
          // TODO: onClick: ask to confirm this card, then make api call to submit this card choice, then reload page
          >
          This is a white card
          </Card>

          {/* some card */}
          <Card
          // TODO: onClick: ask to confirm this card, then make api call to submit this card choice, then reload page
          >
          This is a white card
          </Card>


          {/* some card */}
          <Card
          // TODO: onClick: ask to confirm this card, then make api call to submit this card choice, then reload page
          >
          This is a white card
          </Card>


          {/* some card */}
          <Card
          // TODO: onClick: ask to confirm this card, then make api call to submit this card choice, then reload page
          >
          This is a white card
          </Card>

        </BaseContainer>
      </div>
    </React.Fragment>
  );
}

export default WhiteCardSelection;
