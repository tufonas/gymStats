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
import ListItemText from "@mui/material/ListItemText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import ResponseResults from "../enums/responseResult";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

function ConfirmationDialogRaw({isOpen, onClose, allExercises, chosenExercises}) {

    const [chosenMuscleGroup, setChosenMuscleGroup] = React.useState("");
    const [chosenExercisesList, setChosenExercisesList] = React.useState([]);
    // const [chosenExercisesList, setChosenExercisesList] = React.useState([]);


    useEffect(() => {
        if (chosenExercises) {
            let allExercises = Object.values(chosenExercises).reduce((result, current) => Object.assign(result, current), {})
            setChosenExercisesList(Object.assign(chosenExercisesList, Object.keys(allExercises)));
        }
    },[chosenExercises]);
    const onSaveNewExercises = () => {

        let setsArray = Array.from(
            [...Array(4).keys()].map((x) => {
                return { weight: 0, reps: 0 };
            })
        );

        let dataToBeSaved = chosenExercisesList.map(x => {
            let myObject = {};
            console.log( allExercises[chosenMuscleGroup], chosenExercisesList)
            allExercises[chosenMuscleGroup][x]['sets'] = setsArray;
            myObject[x] = allExercises[chosenMuscleGroup][x];
            return myObject;
        })
        console.log(dataToBeSaved)
        dataToBeSaved = dataToBeSaved.reduce(function(result, item) {
            let key = Object.keys(item)[0]; //first property: a, b, c
            result[key] = item[key];
            return result;
        }, {})
        let finalDataObj = {};
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
                        onChange={(event) => setChosenMuscleGroup(event.target.value)}
                    >

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

                {!chosenMuscleGroup ? <div/> : <FormControl sx={{marginBottom: 2}} fullWidth>
                    <InputLabel id="demo-simple-select-label">
                        Choose exercise
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Current program"
                        value={chosenExercisesList}
                        multiple={true}
                        onChange={(event) => {
                            setChosenExercisesList(event.target.value);
                        }}
                    >

                        {chosenMuscleGroup && Object.entries(allExercises[chosenMuscleGroup]).map((group) => (
                            <MenuItem
                                value={group[0]}
                                key={group[0]}
                                sx={{display: "flex", justifyContent: "space-between"}}
                            >
                                {group[1].exerciseName}
                            </MenuItem>

                        ))}


                    </Select>
                </FormControl>}
                {chosenMuscleGroup ? (<List dense={true}>
                    {chosenExercisesList.map((data) => (
                        <ListItem key={data}>
                            <ListItemText
                                primary={allExercises[chosenMuscleGroup][data]?.exerciseName}
                            />
                        </ListItem>
                    ))}
                </List>) : <div></div>}


            </DialogContent>
            <DialogActions>
                <Button autoFocus color="warning" onClick={() => onClose(ResponseResults.CANCEL)}>
                    Cancel
                </Button>
                <Button
                    onClick={() => onSaveNewExercises()}
                    color="success"
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    )
        ;

}

export default function AddNewExerciseToProgramDialog({
                                                          isOpen,
                                                          onClose,
                                                          allExercises,
                                                          chosenExercises
                                                      }) {


    return (<div>
            <Box sx={{width: "100%", maxWidth: 360, bgcolor: "background.paper"}}>
                <ConfirmationDialogRaw
                    id="ringtone-menu"
                    keepMounted
                    isOpen={isOpen}
                    onClose={onClose}
                    allExercises={allExercises}
                    chosenExercises={chosenExercises}
                />
            </Box>
        </div>
    )
}