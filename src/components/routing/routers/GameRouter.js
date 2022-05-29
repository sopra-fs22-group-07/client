import {Redirect, Route} from "react-router-dom";
import PropTypes from 'prop-types';
import GameMenu from "components/views/GameMenu";
import BlackCardSelection from "../../views/BlackCardSelection";
import PlayWhites from "components/views/PlayWhites";
import Matches from "components/views/Matches";
import RateWhites from "../../views/RateWhites";
import UserHand from "../../views/UserHand";
import Chat from "../../views/Chat";
import Rules from "../../views/Rules"
import {GameGuard} from "../routeProtectors/GameGuard";

const GameRouter = props => {
  /**
   * "this.props.base" is "/app" because as been passed as a prop in the parent of GameRouter, i.e., App.js
   */
  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>

      {/* menu */}
      <Route exact path={`${props.base}/menu`}>
          <GameGuard>
              <GameMenu/>
          </GameGuard>
      </Route>

      {/* black card selection */}
      <Route exact path={`${props.base}/select/blackCard`}>
          <GameGuard>
              <BlackCardSelection />
          </GameGuard>
      </Route>

      {/* play white cards */}
      <Route exact path={`${props.base}/playWhites`}>
          <GameGuard>
              <PlayWhites/>
          </GameGuard>
      </Route>

      {/* matches */}
      <Route exact path={`${props.base}/matches`}>
          <GameGuard>
              <Matches/>
          </GameGuard>
      </Route>

      {/* hand */}
      <Route exact path={`${props.base}/hand`}>
          <GameGuard>
              <UserHand/>
          </GameGuard>
      </Route>

        {/* rules */}
        <Route exact path={`${props.base}/rules`}>
            <GameGuard>
                <Rules/>
            </GameGuard>
        </Route>

      {/* rate white cards */}
      <Route exact path={`${props.base}/rateWhites`}>
          <GameGuard>
              <RateWhites/>
          </GameGuard>
      </Route>

      <Route exact path={`${props.base}/chat`}>
          <GameGuard>
              <Chat/>
          </GameGuard>
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
