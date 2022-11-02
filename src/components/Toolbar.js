import * as React from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { ref, set, get, onValue, query, push } from "firebase/database";
import db from "../firebaseConfigs";
import Menu from "@mui/material/Menu";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListAltIcon from "@mui/icons-material/ListAlt";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

class Bar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      open: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.onCloseMenu = this.onCloseMenu.bind(this);
  }

  handleClick(event) {
    this.setState({ anchorEl: event.currentTarget });
    this.setState({ open: true });
  }

  onCloseMenu() {
    this.setState({ anchorEl: null });
    this.setState({ open: false });
  }

  onMenuItemClick(actionName) {
    this.setState({open: false});
    this.props.onClick(actionName);
  }


  render() {
    return (
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={this.handleClick}
          >
            <MenuIcon />
          </IconButton>

          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={this.state.anchorEl}
            open={this.state.open}
            onClose={this.onCloseMenu}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <MenuItem onClick={() => this.onMenuItemClick("Program")}> 
              <ListItemIcon>
                <ListAltIcon fontSize="medium" />
              </ListItemIcon>
              <Typography variant="inherit">Add new program</Typography>
            </MenuItem>
            <MenuItem onClick={() => this.onMenuItemClick("Exercise")}>
              <ListItemIcon>
                <FitnessCenterIcon fontSize="medium" />
              </ListItemIcon>
              <Typography variant="inherit">Add new exercise</Typography>
            </MenuItem>
          </Menu>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Gym stats
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

export default Bar;
