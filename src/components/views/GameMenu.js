import React from 'react';
import "styles/views/GameMenu.scss";
import CardButton from "../ui/CardButton";
import MenuContainer from "../ui/MenuContainer";
import {handleError} from "../../helpers/api";
import {useHistory} from "react-router-dom";
import ChatIcon from '@mui/icons-material/Chat';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import ArticleIcon from '@mui/icons-material/Article';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import PanToolIcon from "@mui/icons-material/PanTool";
import ViewTitle from "components/ui/ViewTitle";

const GameMenu = () => {
    // use react-router-dom's hook to access the history
    const history = useHistory();
    const iconStyle = {fontSize: 45, align: "center"};

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

    function goToMatches() {
        pushURL(`/game/matches`)
    }

    function goToHand() {
        pushURL(`/game/hand`)
    }

    return (
        <React.Fragment>
            <ViewTitle>
                Game Menu
            </ViewTitle>
            <MenuContainer className={"menu container"}>
                <CardButton className={"card whiteCard"}
                          onClick={() => history.push("/game/select/blackCard")}
                          children={"Select Black Card"}
                          icon={<ArticleIcon sx={iconStyle}/>}
                />
                <CardButton className={"card whiteCard"}
                          onClick={() => goToPlayWhites()}
                          children={"Play White Cards"}
                          icon={<ArticleOutlinedIcon sx={iconStyle}/>}
                />
                <CardButton className={"card whiteCard"}
                            onClick={() => goToHand()}
                            children={"Current Hand"}
                            icon={<PanToolIcon sx={iconStyle}/>}
                />
                <CardButton className={"card whiteCard"}
                          onClick={() => goToRateWhites()}
                          children={"Rate Cards"}
                          icon={<ThumbsUpDownIcon sx={iconStyle}/>}
                />
                <CardButton className={"card whiteCard"}
                          onClick={() => goToMatches()}
                          children={"Chat & Matches"}
                          icon={<ChatIcon sx={iconStyle}/>}
                />
            </MenuContainer>
        </React.Fragment>
    );
}

export default GameMenu;
