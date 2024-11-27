import Box from "@mui/material/Box";
import * as React from "react";
import {useEffect} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import ResponseResults from "../enums/responseResult";

function ConfirmationDialogRaw({isOpen, onClose, allExercises, programExercises, chosenTab}) {

    const [chosenMuscleGroup, setChosenMuscleGroup] = React.useState(chosenTab);
    const [chosenExercisesList, setChosenExercisesList] = React.useState(null);
    const [newExercise, setNewExercise] = React.useState('');

    useEffect(() => {
        let tempObj = structuredClone(allExercises);
        for (const muscleGroup in programExercises) {
            if (programExercises.hasOwnProperty(muscleGroup) && tempObj.hasOwnProperty(muscleGroup)) {
                for (const exerciseId in programExercises[muscleGroup]) {
                    if (programExercises[muscleGroup].hasOwnProperty(exerciseId)) {
                        // Remove the corresponding entry from the first object
                        delete tempObj[muscleGroup][exerciseId];
                    }
                }
            }
        }
        console.log(tempObj)
        setChosenExercisesList(tempObj);
    }, []);

    const onSaveNewExercises = () => {

        let setsArray = Array.from(
            [...Array(4).keys()].map((x) => {
                return {weight: 0, reps: 0};
            })
        );
        let finalDataObj = {};
        let dataToBeSaved = {
            "exerciseId": newExercise,
            "sets": setsArray,
        }
        finalDataObj[chosenMuscleGroup] = dataToBeSaved
        onClose(ResponseResults.SUCCESS, finalDataObj)
    }

    return (
        <Dialog
            sx={{"& .MuiDialog-paper": {width: "80%", maxHeight: 435}}}
            maxWidth="xs"
            open={isOpen}
        >
            <DialogTitle>Add new exercises to program </DialogTitle>
            <DialogContent dividers>

                <FormControl sx={{marginBottom: 2}} fullWidth>
                    <InputLabel id="demo-simple-select-label">
                        Choose muscle group
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Choose muscle group"
                        value={chosenMuscleGroup}
                        onChange={(event) => {
                            setChosenMuscleGroup(event.target.value);
                            setNewExercise('');
                        }
                    }
                    >
                        <MenuItem
                            disabled
                            value=''
                            key=''
                            sx={{display: "none", justifyContent: "space-between"}}
                        >
                        </MenuItem>

                        {allExercises && Object.keys(allExercises).map((group) => (
                            <MenuItem
                                value={group}
                                key={group}
                                sx={{display: "flex", justifyContent: "space-between"}}
                            >
                                {group}
                            </MenuItem>
                        ))}

                    </Select>
                </FormControl>

                { chosenExercisesList && chosenMuscleGroup ?
                    <FormControl sx={{marginBottom: 2}} fullWidth>
                        <InputLabel id="demo-simple-select-label">
                            Choose exercise
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Current program"
                            value={newExercise}
                            multiple={false}
                            onChange={(event) => {
                                setNewExercise(event.target.value);
                            }}
                        >
                            {Object.entries(chosenExercisesList[chosenMuscleGroup]).length === 0 ? <MenuItem
                                disabled
                                value=''
                                key=''
                                sx={{display: "flex", justifyContent: "space-between"}}
                            >
                                No exercises available!
                            </MenuItem> : <div></div>}

                            { chosenMuscleGroup && Object.entries(chosenExercisesList[chosenMuscleGroup])?.map((group) => (
                                <MenuItem
                                    value={group[0]}
                                    key={group[0]}
                                    sx={{display: "flex", justifyContent: "space-between"}}
                                >
                                    {group[1].exerciseName}
                                </MenuItem>

                            ))}


                        </Select>
                    </FormControl> : <div></div> }
            </DialogContent>
            <DialogActions>
                <Button autoFocus color="warning" onClick={() => onClose(ResponseResults.CANCEL)}>
                    Cancel
                </Button>
                <Button
                    disabled={!newExercise}
                    onClick={() => onSaveNewExercises()}
                    color="success"
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default function AddNewExerciseToProgramDialog({
                                                          isOpen,
                                                          onClose,
                                                          allExercises,
                                                          programExercises,
                                                          chosenTab
                                                      }) {

    return isOpen && (<div>
            <Box sx={{width: "100%", maxWidth: 360, bgcolor: "background.paper"}}>
                <ConfirmationDialogRaw
                    id="ringtone-menu"
                    keepMounted
                    isOpen={isOpen}
                    onClose={onClose}
                    allExercises={allExercises}
                    programExercises={programExercises}
                    chosenTab={chosenTab}
                />
            </Box>
        </div>
    )
}