import * as React from 'react';
import { useState } from 'react';
import {useHistory} from "react-router-dom";
import {api, handleError} from "../../helpers/api";

// import mui components
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Tooltip } from '@mui/material';

// import icons
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItemIcon from '@mui/material/ListItemIcon';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ChatIcon from '@mui/icons-material/Chat';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import GavelIcon from '@mui/icons-material/Gavel';
import ArticleIcon from '@mui/icons-material/Article';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import LogoutIcon from '@mui/icons-material/Logout';



// ==================================================
// functions that handle the closing and opening animation of the sidebar as well as styling
const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);



// ==================================================
// component for a button in the sidebar
const SidebarItem = ({
    open,  // whether the sidebar is open or not
    text,  // text that gets displayed in the button and in the tooltip
    onClick,  // action that gets executed when the button is clicked
    icon,  // icon that gets displayed in the button
}) => {

    const [tooltipIsOpen, setTooltipIsOpen] = useState(false);

    return (
      <Tooltip 
        title={text} 
        placement="right"
        open={tooltipIsOpen && !open}
        onOpen={() => setTooltipIsOpen(true)}
        onClose={() => setTooltipIsOpen(false)}
      >
        <ListItemButton
            key={text}
            sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
            }}
            onClick={onClick}
        >
            <ListItemIcon
                sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                }}
            >
                {icon}
            </ListItemIcon>

            <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
        </ListItemButton>
      </Tooltip>
    );
};


// ==================================================
// sidebar and header
export default function Sidebar({view, children}) {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const history = useHistory();

    // ==================================================
    // handling drawer state (open/closed)
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };


    // ==================================================
    // functions for navigation
    async function logout() {
        try {
            const requestBody = ""

            await api.put(`/users/logout/${localStorage.getItem('id')}`,
                requestBody);

        } catch (error) {
            alert(`Something went wrong during the logout: \n${handleError(error)}`);
        }
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        history.push('/login');
    }


    function goToUserPage() {
        try {
            history.push(`/users/${localStorage.getItem("id")}`)
        }catch (error) {
            alert(`Something went wrong while trying to access your profile: \n${handleError(error)}`);
        }
    }


    // ============================================================
    // drawer components that differ in their listed sidebar items (depending on the view prop)
    const LoginDrawer = () => {
        return (
            <Drawer variant="permanent" open={open}>

            {/* header of the sidebar */}
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>


                <Divider />

                {/* list of sidebar items */}
                <List>
                    <SidebarItem
                        open={open}
                        text="Login"
                        onClick={() => {history.push('/login')}}
                        icon={<LoginIcon />}   
                    />
                    <SidebarItem
                        open={open}
                        text="Registration"
                        onClick={() => {history.push('/registration')}}
                        icon={<PersonAddIcon />}   
                    />
                </List>

            </Drawer>
        )
    }

    const GameDrawer = () => {
        return (
            <Drawer variant="permanent" open={open}>

            {/* header of the sidebar */}
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>


                <Divider />

                {/* list of sidebar items */}
                <List>
                    <SidebarItem
                        open={open}
                        text="Menu"
                        onClick={() => {history.push('/game/menu')}}
                        icon={<MenuIcon />}   
                    />
                    <SidebarItem
                        open={open}
                        text="Select Black Card"
                        onClick={() => {history.push('/game/select/blackCard')}}
                        icon={<ArticleIcon />}   
                    />
                    <SidebarItem
                        open={open}
                        text="Play White Cards"
                        onClick={() => {history.push('/game/playWhites')}}
                        icon={<ArticleOutlinedIcon />}   
                    />
                    <SidebarItem
                        open={open}
                        text="Rate Cards"
                        onClick={() => {history.push('/game/rateWhites')}}
                        icon={<ThumbsUpDownIcon />}   
                    />
                    <SidebarItem
                        open={open}
                        text="Rules"
                        onClick={() => {history.push('/game/rules')}}
                        icon={<GavelIcon />}   
                    />
                    <SidebarItem
                        open={open}
                        text="Chat & Matches"
                        onClick={() => {history.push('game/matches')}}
                        icon={<ChatIcon />}   
                    />
                </List>

                    {/* footer of the sidebar; this is not technically different from the list above, it's just visually separated */}
                    <Divider />
                <List>
                    <SidebarItem
                        open={open}
                        text="Personal Profile"
                        onClick={() => {goToUserPage()}}
                        icon={<AccountBoxIcon />}   
                    />
                    <SidebarItem
                        open={open}
                        text="Logout"
                        onClick={() => {logout()}}
                        icon={<LogoutIcon />}   
                    />
                </List>
            </Drawer>
        )
    }



    // ============================================================
    // full sidebar with header
    return (
        <Box sx={{ display: 'flex' }}>
        <CssBaseline />

        {/* header */}
        <AppBar position="fixed" open={open} sx={{bgcolor: "green"}}>
            <Toolbar>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{
                marginRight: 5,
                ...(open && { display: 'none' }),
                }}
            >
                <ChevronRightIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
                Date Against Humanity
            </Typography>
            </Toolbar>
        </AppBar>

        {/* sidebar/drawer */}
        {view === "game" ? <GameDrawer/> : null}
        {view === "login" ? <LoginDrawer/> : null}
        {view === "user" ? <GameDrawer/> : null}

        {/* box containing the main content of the page */}
        <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
            <DrawerHeader />
            {children}
        </Box>
        </Box>
    );
}
