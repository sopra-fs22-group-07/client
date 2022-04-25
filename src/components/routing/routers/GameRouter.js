import {Redirect, Route} from "react-router-dom";
import PropTypes from 'prop-types';
import GameMenu from "components/views/GameMenu";
import BlackCardSelection from "../../views/BlackCardSelection";
import PlayWhites from "components/views/PlayWhites";
import Matches from "components/views/Matches";

const GameRouter = props => {
  /**
   * "this.props.base" is "/app" because as been passed as a prop in the parent of GameRouter, i.e., App.js
   */
  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>

      {/* menu */}
      <Route exact path={`${props.base}/menu`}>
        <GameMenu/>
      </Route>

      {/* black card selection */}
      <Route exact path={`${props.base}/select/blackCard`}>
          <BlackCardSelection />
      </Route>

      {/* play white cards */}
      <Route exact path={`${props.base}/playWhites`}>
        <PlayWhites/>
      </Route>

      {/* matches */}
      <Route exact path={`${props.base}/matches`}>
        <Matches/>
      </Route>

      {/* fallback option */}
      <Route exact path={`${props.base}`}>
        <Redirect to={`${props.base}/menu`}/>
      </Route>
    </div>
  );
};
/*
* Don't forget to export your component!
 */

GameRouter.propTypes = {
  base: PropTypes.string
}

export default GameRouter;
