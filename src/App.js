import logo from "./logo.svg";
import "./App.css";
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
import ChipsList from "./components/ChipsList";
import MuscleGroupItem from "./components/MuscleGroupItem";
import MuscleGroupListItem from "./components/MuscleGroupListItem";
import db from "./firebaseConfigs";
import { ref, set, get, onValue, update, remove } from "firebase/database";
// import  { MuscleGroup }  from "./muscleGroup";
import { map, from, mergeMap, of, switchMap, take, concatMap } from "rxjs";
import Bar from "./components/Toolbar";
// import firebase from 'firebase/app';
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import Select from "@mui/material/Select";
import MuscleGroups from "./enums/muscleGroupEnum";
import MenuItem from "@mui/material/MenuItem";
import Fab from "@mui/material/Fab";
import AddNewExerciseDialog from "./dialogs/addNewExerciseDialog";
import SpeedDialTools from "./components/speedDialTools";
import AddNewProgramDialog from "./dialogs/addNewProgramDialog";
import ResponseResults from "./enums/responseResult";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import SaveIcon from "@mui/icons-material/Save";
import Autocomplete from "@mui/material/Autocomplete";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chosenWeight: 0,
      chosenMuscleGroup: [],
      muscleGroups: [],
      programs: [],
      openNewProgramm: false,
      openNewExercise: false,
      openSuccessSnackBar: false,
      openErrorSnackBar: false,
      currentProgram: {
        name: "",
        exercises: [],
      },
      currentProgramName: "",
      chosenTab: "",
    };

    this.onChangeMuscleGroup = this.onChangeMuscleGroup.bind(this);
    this.onChangeCurrProgram = this.onChangeCurrProgram.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  componentDidMount() {
    this.getMuscleGroups();
    this.getPrograms();
  }

  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }

  getCurrentProgram(programs) {
    get(ref(db, "current_program"))
      .then((res) => {
        // console.log(res.val(), Object.keys(programs));
        var response = res.val() ? res.val() : "";
        if (Object.keys(programs)?.length === 1) {
          this.createUpdateCurrentProgram(Object.keys(programs).pop());
          response = Object.keys(programs).pop();
        }
        // var response = res.val() ? res.val() : "";
        this.setState({ currentProgram: programs[response] });
      })
      .catch((error) => {
        // console.log(error);
      });
  }

  createUpdateCurrentProgram(currentProgramName) {
    set(ref(db, "current_program"), currentProgramName);
  }

  getMuscleGroups() {
    return from(get(ref(db, "muscleGroups/")))
      .pipe(switchMap((x) => (x.val() ? of(x.val()) : of({}))))
      .subscribe((res) => {
        this.setState({ muscleGroups: res });
      });
  }

  onChangeCurrProgram(currProgramName) {
    console.log(currProgramName);
    set(ref(db, "current_program"), currProgramName);
    this.setState({ chosenMuscleGroup: [] });
    this.setState({ currentProgram: this.state.programs[currProgramName] });
  }

  getPrograms() {
    onValue(ref(db, "programs"), (res) => {
      this.setState({ programs: res.val() ? res.val() : [] });
      this.getCurrentProgram(res.val());
    });
  }

  closeNewProgramDialog(response, error) {
    this.setState({ openNewProgramm: false });
    switch (response) {
      case ResponseResults.SUCCESS:
        this.setState({ openSuccessSnackBar: true });
        break;
      case ResponseResults.ERROR:
        this.setState({ openErrorSnackBar: true });
        break;
      default:
        break;
    }
  }

  closeNewExerciseDialog(response, error) {
    this.setState({ openNewExercise: false });
    switch (response) {
      case ResponseResults.SUCCESS:
        this.setState({ openSuccessSnackBar: true });
        break;
      case ResponseResults.ERROR:
        this.setState({ openErrorSnackBar: true });
        break;
      default:
        break;
    }
  }

  onActionClicked(actionName) {
    switch (actionName) {
      case "Program":
        this.setState({ openNewProgramm: true });
        break;
      case "Exercise":
        this.setState({ openNewExercise: true });
        break;
      default:
        break;
    }
  }

  handleCloseSnackBar(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ openSuccessSnackBar: false });
    this.setState({ openErrorSnackBar: false });
  }

  onChangeMuscleGroup(event, test) {
    this.setState({ chosenMuscleGroup: event.target.value });
    // console.log(event,test,  event.target.value, this.state.chosenMuscleGroup);
    this.setState({
      chosenTab: event.target.value[0],
    });
  }

  onTabChange(event, newValue) {
    this.setState({ chosenTab: newValue });
  }

  onChangeWeight(weight, exercise, index, muscleGroup) {
    var program = this.state.currentProgram;
    Object.values(program.exercises[muscleGroup])
      .filter((x) => x.name === exercise.name)
      .pop().sets[index].weight = Number(weight);
    this.setState({ currentProgram: program });
  }

  onAddSet(exercise, muscleGroup) {
    console.log(exercise, muscleGroup);
    var program = this.state.currentProgram;
    Object.values(program.exercises[muscleGroup])
      .filter((x) => x.name === exercise.name)
      .pop()
      .sets.push({ reps: 0, weight: 0 });

    this.setState({ currentProgram: program });
  }

  onRemoveSet(exercise, muscleGroup) {
    var program = this.state.currentProgram;
    Object.values(program.exercises[muscleGroup])
      .filter((x) => x.name === exercise.name)
      .pop()
      .sets.pop();

    this.setState({ currentProgram: program });
  }

  onChangeReps(reps, exercise, index, muscleGroup) {
    var program = this.state.currentProgram;
    Object.values(program.exercises[muscleGroup])
      .filter((x) => x.name === exercise.name)
      .pop().sets[index].reps = Number(reps);
    this.setState({ currentProgram: program });
  }

  onSave() {
    set(
      ref(db, "programs/" + this.state.currentProgram.name),
      this.state.currentProgram
    )
      .catch((error) => {
        this.setState({ openErrorSnackBar: true });
      })
      .finally(() => {
        this.setState({ openSuccessSnackBar: true });
      });
  }

  onDeleteProgram() {
    this.setState({
      currentProgram: {
        name: "",
        exercises: [],
      },
    });
    remove(ref(db, "programs/" + this.state.currentProgram.name));
    set(ref(db, "current_program"), "");
  }

  onDeleteExercise(exercise, muscleGroup) {
    var exerciseIdToBeDeleted = Object.entries(
      this.state.currentProgram.exercises[muscleGroup]
    )
      .filter((x) => x[1].name === exercise.name)
      .pop()[0];
    remove(
      ref(
        db,
        "programs/" +
          this.state.currentProgram.name +
          "/exercises/" +
          muscleGroup +
          "/" +
          exerciseIdToBeDeleted
      )
    );

    var x = this.state.currentProgram;
    if (Object.keys(x.exercises[muscleGroup]).length === 1) {
      x.exercises[muscleGroup] = [];
    }

    var index = this.state.chosenMuscleGroup.findIndex(
      (x) => x === muscleGroup
    );
    if (this.state.currentProgram.exercises[muscleGroup].length === 0) {
      this.state.chosenMuscleGroup.splice(index, 1);
      this.setState({ chosenTab: this.state.chosenMuscleGroup[0] });
    }
    if (this.state.chosenMuscleGroup.length === 0)
      this.setState({ chosenMuscleGroup: [] });
  }

  onChangeExerciseName(exerciseName, exercise, muscleGroup) {
    var program = this.state.currentProgram;
    Object.values(program.exercises[muscleGroup])
      .filter((x) => x.name === exercise.name)
      .pop().name = exerciseName;
    this.setState({ currentProgram: program });
  }

  render() {
    return (
      <div>
        <Bar onClick={(action) => this.onActionClicked(action)} />
        {this.state.currentProgram ? (
          <Box sx={{ margin: "15px" }}>
            <FormControl sx={{ marginBottom: 2 }} fullWidth>
              <InputLabel id="demo-simple-select-label">
                Current program
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Current program"
                value={this.state.currentProgram.name}
                onChange={(event) =>
                  this.onChangeCurrProgram(event.target.value)
                }
              >
                {!this.state.currentProgram.name ? (
                  <MenuItem disabled value="">
                    <em>No options. Create a new program first!</em>
                  </MenuItem>
                ) : (
                  ""
                )}

                {Object.keys(this.state.programs).map((group) => (
                  <MenuItem
                    value={group}
                    key={group}
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {group}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Muscle Group
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Muscle Group"
                multiple
                value={this.state.chosenMuscleGroup}
                onChange={this.onChangeMuscleGroup}
              >
                {this.state.currentProgram.exercises?.length === 0 ||
                !this.state.currentProgram.exercises ? (
                  <MenuItem disabled value="">
                    <em>No options. Create an exercise first!</em>
                  </MenuItem>
                ) : (
                  ""
                )}
                {(this.state.currentProgram.exercises
                  ? Object.keys(this.state.currentProgram.exercises)
                  : []
                ).map((group) => (
                  <MenuItem
                    value={group}
                    key={group}
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {group}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        ) : (
          ""
        )}
        {this.state.currentProgram.name !== "" && (
          <Box
            sx={{
              marginX: 2,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="outlined"
              endIcon={<DeleteIcon />}
              onClick={() => this.onDeleteProgram()}
              color="error"
            >
              Delete program
            </Button>
            <Button
              variant="outlined"
              endIcon={<SaveIcon />}
              onClick={this.onSave}
            >
              Save program
            </Button>
          </Box>
        )}

        {this.state.chosenMuscleGroup.length > 0 && (
          <TabContext value={this.state.chosenTab}>
            <Box sx={{ borderBottom: 1, borderColor: "divider", marginX: 2 }}>
              <TabList
                aria-label="lab API tabs example"
                onChange={this.onTabChange}
              >
                {this.state.chosenMuscleGroup.map((muscleGroup, key) => (
                  <Tab label={muscleGroup} value={muscleGroup} key={key} />
                ))}
              </TabList>
            </Box>

            {this.state.chosenMuscleGroup?.map((muscleGroup, key) => (
              <TabPanel value={muscleGroup} key={key}>
                {Object.values(
                  this.state.currentProgram.exercises[muscleGroup]
                ).map((exercise, key) => (
                  <MuscleGroupItem
                    key={key}
                    chosenWeight={this.state.chosenWeight}
                    chosenExercise={Object.values(
                      this.state.currentProgram.exercises[muscleGroup]
                    )
                      .filter((x) => x.name === exercise.name)
                      .pop()}
                    exerciseName={exercise.name}
                    onSave={(event) =>
                      this.onSave(event, this.state.currentProgram)
                    }
                    onChangeReps={(...params) =>
                      this.onChangeReps(...params, muscleGroup)
                    }
                    onChangeWeight={(...params) =>
                      this.onChangeWeight(...params, muscleGroup)
                    }
                    onChangeExerciseName={(...params) =>
                      this.onChangeExerciseName(...params, muscleGroup)
                    }
                    onDeleteExercise={(...params) =>
                      this.onDeleteExercise(...params, muscleGroup)
                    }
                    onAddSet={(...params) =>
                      this.onAddSet(...params, muscleGroup)
                    }
                    onRemoveSet={(...params) =>
                      this.onRemoveSet(...params, muscleGroup)
                    }
                  />
                ))}
              </TabPanel>
            ))}
          </TabContext>
        )}

        <AddNewExerciseDialog
          openNewExerciceDialog={this.state.openNewExercise}
          programs={this.state.programs}
          onCloseExerciseDialog={(res, error) =>
            this.closeNewExerciseDialog(res, error)
          }
        />

        <AddNewProgramDialog
          programs={this.state.programs}
          openNewProgramDialog={this.state.openNewProgramm}
          onCloseProgramDialog={(res, error) =>
            this.closeNewProgramDialog(res, error)
          }
        />

        <Snackbar
          open={this.state.openSuccessSnackBar}
          autoHideDuration={1000}
          onClose={() => this.handleCloseSnackBar()}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => this.handleCloseSnackBar()}
            severity="success"
            sx={{ width: "100%" }}
          >
            Save completed successfully
          </Alert>
        </Snackbar>
        <Snackbar
          open={this.state.openErrorSnackBar}
          autoHideDuration={1000}
          onClose={() => this.handleCloseSnackBar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => this.handleCloseSnackBar}
            severity="error"
            sx={{ width: "100%" }}
          >
            Something went wrong
          </Alert>
        </Snackbar>
      </div>
    );
  }
}

export default App;
