import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MuscleGroups from "../enums/muscleGroupEnum";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import FilledInput from "@mui/material/FilledInput";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import db from "../firebaseConfigs";
import {
  ref,
  set,
  get,
  onValue,
  update,
  push,
  equalTo,
  query,
} from "firebase/database";
import Backdrop from "@mui/material/Backdrop";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import ListAltIcon from "@mui/icons-material/ListAlt";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { map, from, mergeMap, of, switchMap, take, concatMap } from "rxjs";
import ResponseResults from "../enums/responseResult";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";

function ConfirmationDialogRaw(props) {
  const {
    onClose,
    exerciseName: exerciseNameProp,
    open,
    programs,
    ...other
  } = props;
  const [exerciseName, setExerciseName] = React.useState(exerciseNameProp);
  const [chosenMuscleGroup, setChosenMuscleGroup] = React.useState("");
  const [chosenProgram, setChosenProgram] = React.useState("");
  const [openAutocomplete, setOpenAutocomplete] = React.useState(false);
  const [optionsAutocomplete, setOptionsAutocomplete] = React.useState([]);
  const [exercisesList, setExercisesList] = React.useState([]);
  const [exerciseAlreadyExists, setExerciseAlreadyExists] =
    React.useState(false);
  const [clearAutocomplete, setClearAutocomplete] = React.useState(false);
  const [setsNumber, setSetsNumber] = React.useState(4);

  const loadingAutocomplete =
    openAutocomplete && optionsAutocomplete.length === 0;

  React.useEffect(() => {
    if (!open) {
      setExerciseName(exerciseNameProp);
      setChosenProgram("");
      setChosenMuscleGroup("");
      setSetsNumber(4);
    }
  }, [exerciseNameProp, open, chosenProgram]);

  React.useEffect(() => {
    if (!openAutocomplete) {
      setOptionsAutocomplete([]);
    }
  }, [openAutocomplete]);

  const onCancel = () => {
    setChosenProgram("");
    setClearAutocomplete(!clearAutocomplete);
    onClose();
  };

  const onSave = () => {
    setClearAutocomplete(!clearAutocomplete);
    onClose(chosenMuscleGroup, exerciseName, chosenProgram, setsNumber);
  };

  const onChangeMuscleGroup = (event) => {
    getExercises(chosenProgram, event.target.value).subscribe((res) => {
      setExercisesList(res);
      validateExerciseName(null, res);
    });
    setChosenMuscleGroup(event.target.value);
  };

  const onChangeExerciseName = (event) => {
    setExerciseName(event.target.value);
  };

  const validateExerciseName = (event, exercises) => {
    var name;
    var isEqual;
    if (event) {
      name = event.target.value;
    } else if (exerciseName) {
      name = exerciseName;
    } else {
      name = ""
    }
    isEqual = Array.from(Object.values(exercises ? exercises : exercisesList)).map(x => x.name).includes(name);
    setExerciseAlreadyExists(isEqual);
  };

  const onSelectProgram = (event) => {
    getExercises(event.target.value, chosenMuscleGroup).subscribe((res) => {
      setExercisesList(res);
      validateExerciseName(null, res);
    });
    setChosenProgram(event.target.value);
  };

  const getExercises = (program, muscleGroup) => {
    return from(
      get(ref(db, "programs/" + program + "/exercises/" + muscleGroup))
    ).pipe(switchMap((x) => (x.val() ? of(x.val()) : of({}))));
  };

  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
      maxWidth="xs"
      open={open}
      {...other}
    >
      <DialogTitle>Add new exercise</DialogTitle>
      <DialogContent dividers>
        <Autocomplete
          id="asynchronous-demo"
          sx={{ width: "100%", marginBottom: 2 }}
          open={openAutocomplete}
          onOpen={() => {
            setOpenAutocomplete(true);
          }}
          onClose={() => {
            setOpenAutocomplete(false);
          }}
          isOptionEqualToValue={(option, value) => option === value}
          key={clearAutocomplete}
          getOptionLabel={(option) => option}
          options={Array.from(Object.keys(programs))}
          loading={loadingAutocomplete}
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                label="Choose Programm"
                value={chosenProgram}
                onSelect={onSelectProgram}
                onChange={onSelectProgram}
                required
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loadingAutocomplete ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            );
          }}
        />

        <FormControl fullWidth required>
          <InputLabel id="demo-simple-select-label">Muscle Group</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Muscle Group"
            value={chosenMuscleGroup}
            onChange={onChangeMuscleGroup}
          >
            {Object.values(MuscleGroups).map((group) => (
              <MenuItem
                value={group}
                key={group}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                {group}

                {/* TODO: Add svg icons based on https://mui.com/material-ui/icons/#createsvgicon */}
                {/* <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon> */}
                {/* <ListItemText primary="Inbox" /> */}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box
          sx={{
            display:
              chosenMuscleGroup === "" || chosenProgram === ""
                ? "none"
                : "block",
          }}
        >
          <FormControl
            fullWidth
            variant="filled"
            sx={{ marginTop: 2 }}
            required
          >
            <InputLabel htmlFor="filled-adornment-amount">
              Exercise Name
            </InputLabel>
            <FilledInput
              id="filled-adornment-amount"
              value={exerciseName}
              onChange={onChangeExerciseName}
              error={exerciseAlreadyExists}
              onKeyUp={validateExerciseName}
            />
          </FormControl>
          <FormHelperText
            sx={{ display: exerciseName === "" ? "hidden" : "block" }}
            id="my-helper-text"
            error={exerciseAlreadyExists}
          >
            {exerciseAlreadyExists ? "This exercise already exists!" : ""}
          </FormHelperText>
          <FormControl
            fullWidth
            variant="filled"
            sx={{ marginTop: 2 }}
            required
          >
            <InputLabel htmlFor="filled-adornment-amount1">
              Sets number
            </InputLabel>
            <FilledInput
              type="number"
              id="filled-adornment-amount1"
              value={setsNumber}
              onChange={(event) => setSetsNumber(Number(event.target.value))}
            />
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button autoFocus color="warning" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={onSave}
          color="success"
          disabled={
            !(
              chosenMuscleGroup &&
              exerciseName &&
              chosenProgram &&
              setsNumber
            ) || exerciseAlreadyExists
          }
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmationDialogRaw.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  exerciseName: PropTypes.string.isRequired,
};

export default function AddNewExerciseDialog(props) {
  const {
    openNewExerciceDialog: open,
    onCloseExerciseDialog,
    programs,
  } = props;
  // const [exerciseName, setExerciseName] = React.useState(exerciseNameProp);

  const [openPopup, setOpenPopup] = React.useState(open);
  const [exerciseName, setExerciseName] = React.useState("");

  React.useEffect(() => {
    setOpenPopup(open);
  }, [open]);

  const handleClose = (muscleGroup, exercise, program, setsNumber) => {
    setOpenPopup(false);
    if (exercise && muscleGroup) {
      updateProgram(muscleGroup, exercise, program, setsNumber);
    } else {
      onCloseExerciseDialog(ResponseResults.CANCEL);
    }
  };

  /**
   * Save a new Exercise in the database
   * @param {*} muscleGroup
   * @param {*} exercise
   */
  const saveNewExercise = (muscleGroup, exercise, program) => {
    const muscleGroupsListRef = ref(db, "muscleGroups/" + muscleGroup);
    const newmuscleGroupsListRef = push(muscleGroupsListRef);
    set(newmuscleGroupsListRef, exercise)
      .catch((error) => {
        console.log(error);
        onCloseExerciseDialog(ResponseResults.ERROR, error);
      })
      .finally(() => {
        onCloseExerciseDialog(ResponseResults.SUCCESS);
      });
  };

  /**
   * Update a Programm with a new Exercise in the database
   */
  const updateProgram = (muscleGroup, exercise, program, setsNumber) => {
    const muscleGroupsListRef = ref(
      db,
      "programs/" + program + "/exercises/" + muscleGroup
    );
    const newmuscleGroupsListRef = push(muscleGroupsListRef);
  
    var setsArray = Array.from(
      [...Array(setsNumber).keys()].map((x) => {
        return { weight: 0, reps: 0 };
      })
    );

    set(newmuscleGroupsListRef, {
      name: exercise,
      sets: setsArray,
    })
      .catch((error) => {
        console.log(error);
        onCloseExerciseDialog(ResponseResults.ERROR, error);
      })
      .finally(() => {
        onCloseExerciseDialog(ResponseResults.SUCCESS);
      });
  };

  return (
    <div>
      <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        <ConfirmationDialogRaw
          id="ringtone-menu"
          keepMounted
          open={openPopup}
          onClose={handleClose}
          exerciseName={exerciseName}
          programs={programs}
        />
      </Box>
    </div>
  );
}
