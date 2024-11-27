import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MuscleGroups from "../enums/muscleGroupEnum";
import FilledInput from "@mui/material/FilledInput";
import FormHelperText from "@mui/material/FormHelperText";
import {db} from "../firebaseConfigs";
import {get, push, ref, set,} from "firebase/database";
import {from, of, switchMap} from "rxjs";
import ResponseResults from "../enums/responseResult";

function ConfirmationDialogRaw(props) {
  const {
    onClose,
    exerciseName: exerciseNameProp,
    open,
    programs,
    exercises,
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
      validateExerciseName();
    });
    setChosenMuscleGroup(event.target.value);
  };

  const onChangeExerciseName = (event) => {
    setExerciseName(event.target.value);
  };

  const validateExerciseName = () => {
    let allExercises = Object.values(exercises).reduce((result, current) => Object.assign(result, current), {})
    let exerciseAlreadyExists = Array.from(Object.values(allExercises)).map(x => x.exerciseName).includes(exerciseName);
    setExerciseAlreadyExists(exerciseAlreadyExists);
  };

  const onSelectProgram = (event) => {
    getExercises(event.target.value, chosenMuscleGroup).subscribe((res) => {
      setExercisesList(res);
      validateExerciseName();
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
              exerciseName
            ) || exerciseAlreadyExists
          }
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}


export default function AddNewExerciseDialog(props) {
  const {
    openNewExerciceDialog: open,
    onCloseExerciseDialog,
    programs,
    exercises,
  } = props;
  // const [exerciseName, setExerciseName] = React.useState(exerciseNameProp);

  const [openPopup, setOpenPopup] = React.useState(open);
  const [exerciseName, setExerciseName] = React.useState("");

  React.useEffect(() => {
    setOpenPopup(open);
  }, [open, openPopup]);

  const handleClose = (muscleGroup, exercise, program, setsNumber) => {
    setOpenPopup(false);
    if (exercise && muscleGroup) {
      saveNewExercise(muscleGroup, exercise, program);
    } else {
      onCloseExerciseDialog(ResponseResults.CANCEL);
    }
  };

  /**
   * Save a new Exercise in the database
   * @param {*} muscleGroup
   * @param {*} exercise
   */
  const saveNewExercise = (muscleGroup, exerciseName, program) => {
    const muscleGroupsListRef = ref(db, "all_exercises/" + muscleGroup);
    const newmuscleGroupsListRef = push(muscleGroupsListRef);
    set(newmuscleGroupsListRef, {
      exerciseName,
      muscleGroup,
      photoUrl: ""
    })
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
          open={open}
          onClose={handleClose}
          exerciseName={exerciseName}
          programs={programs}
          exercises={exercises}
        />
      </Box>
    </div>
  );
}
