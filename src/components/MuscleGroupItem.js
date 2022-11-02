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
import Card from "@mui/material/Card";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import CardActions from "@mui/material/CardActions";

class ChipsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  addWeights(setNumber) {
    setNumber.set = setNumber.set + this.props.chosenWeight;
    this.setState((state, props) => ({ sets: state.sets }));
  }
  removeWeights(setNumber) {
    setNumber.set = setNumber.set - this.props.chosenWeight;
    this.setState((state, props) => ({ sets: state.sets }));
  }

  render() {
    return (
      <Card sx={{ marginBottom: 2, padding: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
          }}
        >
          <TextField
            sx={{ marginX: 2, marginY: 1 }}
            id="standard-basic"
            label="Exercise Name"
            variant="standard"
            value={this.props.exerciseName}
            onChange={(event) =>
              this.props.onChangeExerciseName(
                event.target.value,
                this.props.chosenExercise
              )
            }
          />

          {/* <Typography sx={{ marginLeft: 2, textAlign: "left" }} variant="h6">
            {this.props.exerciseName}
          <IconButton aria-label="delete" size="small">
            <EditIcon />
          </IconButton>
          </Typography> */}

          <IconButton
            aria-label="delete"
            color="error"
            onClick={() =>
              this.props.onDeleteExercise(this.props.chosenExercise)
            }
          >
            <DeleteIcon />
          </IconButton>
        </Box>
        <Box sx={{ width: "100%", display: "flex" }}>
          <Stack
            sx={{ m: 2 }}
            direction="column"
            flexWrap="wrap"
            justifyContent="space-around"
            alignContent="center"
          >
            {this.props.chosenExercise.sets.map((setNumber, index) => (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  my: 1,
                }}
                key={`${setNumber}` + index}
              >
                <FormControl sx={{ m: "1px" }} variant="outlined" size="small">
                  <OutlinedInput
                    id="outlined-adornment-weight"
                    label="Set {index}"
                    type="number"
                    onChange={(event) =>
                      this.props.onChangeReps(
                        event.target.value,
                        this.props.chosenExercise,
                        index
                      )
                    }
                    value={setNumber.reps}
                    endAdornment={
                      <InputAdornment position="end">reps</InputAdornment>
                    }
                    aria-describedby="outlined-weight-helper-text"
                    inputProps={{
                      "aria-label": "weight",
                      style: { textAlign: "center" },
                    }}
                  />
                  <InputLabel> Set {index + 1}</InputLabel>
                </FormControl>
              </Box>
            ))}
          </Stack>

          <Stack
            sx={{ m: 2 }}
            direction="column"
            flexWrap="wrap"
            justifyContent="space-around"
            alignContent="center"
          >
            {this.props.chosenExercise.sets.map((setNumber, index) => (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  my: 1,
                }}
                key={`${setNumber}` + index}
              >
                <FormControl sx={{ m: "1px" }} variant="outlined" size="small">
                  <OutlinedInput
                    id="outlined-adornment-weight"
                    label="Set {index}"
                    type="number"
                    value={setNumber.weight}
                    onChange={(event) =>
                      this.props.onChangeWeight(
                        event.target.value,
                        this.props.chosenExercise,
                        index
                      )
                    }
                    endAdornment={
                      <InputAdornment position="end">kg</InputAdornment>
                    }
                    aria-describedby="outlined-weight-helper-text"
                    inputProps={{
                      "aria-label": "weight",
                      style: { textAlign: "center" },
                    }}
                  />
                  <InputLabel> Weight</InputLabel>
                </FormControl>
              </Box>
            ))}
          </Stack>
        </Box>
        <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            size="small"
            startIcon={<AddIcon />}
            variant="outlined"
            sx={{ width: "142px" }}
            onClick={() => this.props.onAddSet(this.props.chosenExercise)}
          >
            Add Set
          </Button>
          <Button
            size="small"
            startIcon={<RemoveIcon />}
            variant="outlined"
            sx={{ width: "142px" }}
            onClick={() => this.props.onRemoveSet(this.props.chosenExercise)}
          >
            Remove Set
          </Button>
        </CardActions>
      </Card>
    );
  }
}

export default ChipsList;
