import * as React from "react";
import ReactDOM from "react-dom";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import DoneIcon from "@mui/icons-material/Done";
import DeleteIcon from "@mui/icons-material/Delete";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import InboxIcon from "@mui/icons-material/Inbox";
import ListItemText from "@mui/material/ListItemText";
import Input from "@mui/material/Input";
import ListSubheader from "@mui/material/ListSubheader";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import MuscleGroupItem from "./MuscleGroupItem";

class MuscleGroupListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Typography sx={{marginLeft:2, textAlign:"center"}} variant="h5"
        > {this.props.muscleGroup}</Typography>
        {Object.values(
          this.props.currentProgram.exercises[this.props.muscleGroup]
        ).map((exercise, key) => (
          <MuscleGroupItem
            key={key}
            chosenWeight={this.props.chosenWeight}
            chosenProgram={Object.values(
              this.props.currentProgram.exercises[this.props.muscleGroup]
            ).pop()}
            exerciseName={exercise.name}
          />
        ))}
      </div>
    );
  }
}

export default MuscleGroupListItem;
