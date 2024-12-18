import * as React from "react";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListAltIcon from "@mui/icons-material/ListAlt";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import LogoutIcon from "@mui/icons-material/Logout";
import {getAuth} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import DescriptionIcon from "@mui/icons-material/Description";
import { Avatar, Divider, ListItemText } from "@mui/material";

export default function Bar({user, onClick, currentProgramName}) {

  let navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  }

  function onCloseMenu() {
    setAnchorEl(null);
    setOpen(false);
  }

  function onMenuItemClick(actionName) {
    setOpen(false);
    onClick(actionName);
  }

  function logout () {
    getAuth().signOut().then(() => {
      navigate('/login');
    });
  }



  function loggedUser() {
    return getAuth().currentUser;
  }

    return (
      <AppBar position="static">
        <Toolbar>

          { user ? <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={handleClick}
          >
            <MenuIcon />
          </IconButton> 
          : ""}

          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl}
            open={open}
            onClose={onCloseMenu}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <MenuItem onClick={() => onMenuItemClick("Program")}>
              <ListItemIcon>
                <ListAltIcon fontSize="medium" />
              </ListItemIcon>
              <Typography variant="inherit">Add new program</Typography>
            </MenuItem>
            <MenuItem onClick={() => onMenuItemClick("Exercise")}>
              <ListItemIcon>
                <FitnessCenterIcon fontSize="medium" />
              </ListItemIcon>
              <Typography variant="inherit">Add new exercise</Typography>
            </MenuItem>
            <MenuItem onClick={() => {setOpen(false); navigate("/programs");}}>
              <ListItemIcon>
                <DescriptionIcon fontSize="medium" />
              </ListItemIcon>
              <Typography variant="inherit">Programs</Typography>
            </MenuItem>
            <Divider />
          <MenuItem>
          <ListItemIcon>
            <Avatar src={user?.photoURL} sx={{ width: "35px", height: "35px", marginRight: "10px"}}></Avatar>
          </ListItemIcon>
          <ListItemText>{user?.displayName}</ListItemText>
        </MenuItem>
          </Menu>


          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} onClick={() => navigate('/home')}>
            Gym Stats
          </Typography>

          { user ?
              <IconButton aria-label="delete"
                          onClick={() => logout()}
                          sx={{color: "white"}}>
                <LogoutIcon />
              </IconButton> : ""
          }

        </Toolbar>
      </AppBar>
    );
}
