import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {GameGuard} from "components/routing/routeProtectors/GameGuard";
import GameRouter from "components/routing/routers/GameRouter";
import {LoginGuard} from "components/routing/routeProtectors/LoginGuard";
import Login from "components/views/Login";
import Registration from "../../views/Registration";
import UserPage from "../../views/UserPage";
import EditUserPage from "../../views/EditUserPage"
import EditUserPreferencePage from "../../views/EditUserPreferencePage";
/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reacttraining.com/react-router/web/guides/quick-start
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Switch>

        {/* game router: this handles everything in game. URLs are prepended with "/game" */}
        <Route path="/game">
            <GameRouter base="/game"/>
        </Route>

        {/* login and registration */}
        <Route exact path="/login">
          <LoginGuard>
            <Login/>
          </LoginGuard>
        </Route>
        <Route exact path="/registration">
          <LoginGuard>
            <Registration/>
          </LoginGuard>
        </Route>

        {/* user guard */}
        <Route exact path={"/users/:id"}>
          <GameGuard>
            <UserPage/>
          </GameGuard>
        </Route>
        <Route exact path={'/users/:id/edit/userinfo'}>
          <GameGuard>
            <EditUserPage/>
          </GameGuard>
        </Route>
        <Route exact path={'/users/:id/edit/preferences'}>
          <GameGuard>
            <EditUserPreferencePage/>
          </GameGuard>
        </Route>

        {/* default/fall-back */}
        <Route exact path="/">
          <Redirect to="/game"/>
        </Route>
       

      </Switch>
    </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;
