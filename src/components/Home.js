import Bar from "./Toolbar";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import {Slider} from "primereact/slider";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import MuscleGroupItem from "./MuscleGroupItem";
import Login from "./Login";
import AddNewExerciseDialog from "../dialogs/addNewExerciseDialog";
import AddNewProgramDialog from "../dialogs/addNewProgramDialog";
import Snackbar from "@mui/material/Snackbar";
import * as React from "react";
import {get, onValue, push, ref, remove, set} from "firebase/database";
import db from "../firebaseConfigs";
import {from, of, switchMap} from "rxjs";
import ResponseResults from "../enums/responseResult";
import {Alert} from "@mui/lab";
import DescriptionIcon from '@mui/icons-material/Description';
import MuiAlert from "@mui/material/Alert";
import ProgramDetailsDialog from "../dialogs/programDetailsDialog";
import Test from "../dialogs/programDetailsDialog";
import AddIcon from "@mui/icons-material/Add";
import endpoints from "../constants";
import SideNavBar from "./SideNavBar";
import {SvgIcon} from "@mui/material";
import AddNewExerciseToProgramDialog from "../dialogs/AddNewExerciseToProgramDialog";
import {useEffect} from "react";


// const Alert = React.forwardRef(function Alert(props, ref) {
//     return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

export default function Home({user, openNewProgram, openNewExercise, setOpenNewExercise, setOpenNewProgram}) {

    const [currentProgram, setCurrentProgram] = React.useState({
        name: "",
        exercises: [],
    });
    const [allExercises, setAllExercises] = React.useState([]);
    const [history, setHistory] = React.useState([]);
    const [openSuccessSnackBar, setOpenSuccessSnackBar] = React.useState(false);
    const [openErrorSnackBar, setOpenErrorSnackBar] = React.useState(false);
    const [programs, setPrograms] = React.useState([]);
    const [muscleGroups, setMuscleGroups] = React.useState([]);
    const [chosenMuscleGroup, setChosenMuscleGroup] = React.useState([]);
    const [chosenTab, setChosenTab] = React.useState("");
    const [chosenWeight, setChosenWeight] = React.useState(0);
    const [kgSlider, setKgSlider] = React.useState(0.5);
    const [openProgramDetailsDialog, setOpenProgramDetailsDialog] = React.useState(false);
    const [openNewExerciseToProgramDialog, setOpenNewExerciseToProgramDialog] = React.useState(false);



    React.useEffect(() => {
        getPrograms();
        getMuscleGroups();
        getAllExercises();

    },[]);

    useEffect(() => {
        getHistory();
    }, [currentProgram])

    function getCurrentProgram(programs) {
        get(ref(db, "users/" + user.uid + endpoints.CURRENT_PROGRAM))
            .then((res) => {
                let response = res.val() ? res.val() : "";
                if (Object.keys(programs)?.length === 1) {
                    createUpdateCurrentProgram(Object.keys(programs).pop());
                    response = Object.keys(programs).pop();
                }
                console.log(programs[response])
                setCurrentProgram(programs[response]);
            })
            .catch((error) => {
                // console.log(error);
            });
    }


    function createUpdateCurrentProgram(currentProgramName) {
        set(ref(db, "users/"  + user.uid + endpoints.CURRENT_PROGRAM), currentProgramName);
    }

    function getMuscleGroups() {
        return from(get(ref(db, "muscleGroups/")))
            .pipe(switchMap((x) => (x.val() ? of(x.val()) : of({}))))
            .subscribe((res) => {
                setMuscleGroups(res);
            });
    }



    function getPrograms() {
        onValue(ref(db, "users/" + user.uid + endpoints.PROGRAMS), (res) => {
            setPrograms(res.val() ? res.val() : [])
            getCurrentProgram(res.val());
        });
    }

    function getAllExercises() {
        onValue(ref(db, "all_exercises"), (res) => {
            setAllExercises(res.val() ? res.val() : []);
        });
    }

    function closeNewProgramDialog(response, error) {
        setOpenNewProgram(false);
        switch (response) {
            case ResponseResults.SUCCESS:
                setOpenSuccessSnackBar(true)
                break;
            case ResponseResults.ERROR:
                setOpenErrorSnackBar(true)
                break;
            default:
                break;
        }
    }

    function closeNewProgramDetailsDialog(response, data) {
        setOpenProgramDetailsDialog(false);
        switch (response) {
            case ResponseResults.SUCCESS:
                createUpdateCurrentProgram(data.name)
                onSave(data);
                setCurrentProgram(data);
                setOpenSuccessSnackBar(true)
                break;
            case ResponseResults.ERROR:
                setOpenErrorSnackBar(true)
                break;
            default:
                break;
        }
    }

    function closeNewExerciseToProgramDialog(response, data) {
        console.log(data, currentProgram)
        setOpenNewExerciseToProgramDialog(false);
        switch (response) {
            case ResponseResults.SUCCESS:
                let chosenMuscleGroup = Object.keys(data).pop();
                let dataToBeSaved = Object.assign(currentProgram.exercises[chosenMuscleGroup], data[chosenMuscleGroup])

                console.log(dataToBeSaved)
                set(ref(db, "users/" + user.uid + "/programs/" +
                    currentProgram.name + "/exercises/" + chosenMuscleGroup ), dataToBeSaved )
                setOpenSuccessSnackBar(true)
                break;
            case ResponseResults.ERROR:
                setOpenErrorSnackBar(true)
                break;
            default:
                break;
        }
    }



    function closeNewExerciseDialog(response, error) {

        setOpenNewExercise(false);
        switch (response) {
            case ResponseResults.SUCCESS:
                setOpenSuccessSnackBar(true)
                break;
            case ResponseResults.ERROR:
                setOpenErrorSnackBar(true)
                break;
            default:
                break;
        }
    }
    function handleCloseSnackBar(event, reason) {
        if (reason === "clickaway") {
            return;
        }
        setOpenSuccessSnackBar(false);
        setOpenErrorSnackBar(false);
    }

    function onChangeMuscleGroup(event, test) {
        setChosenMuscleGroup(event.target.value);
        setChosenTab(event.target.value[0]);
    }

    const onTabChange = (event, newValue) => {
        setChosenTab(newValue);
    }

    const onChangeWeight = (weight, exercise, index, muscleGroup) => {
        let program = {...currentProgram};
        Object.values(program.exercises[muscleGroup])
            .filter((x) => x.exerciseName === exercise.exerciseName)
            .pop().sets[index].weight = Number(weight);
        setCurrentProgram(program);
    }

    const onAddSet = (exercise, muscleGroup) => {

        console.log(exercise,muscleGroup, currentProgram)

        var program = {...currentProgram};
        // var program;
        // program = Object.assign(program, currentProgram);
        Object.values(program.exercises[muscleGroup])
            .filter((x) => x.exerciseName === exercise.exerciseName)
            .pop()
            .sets.push({reps: 0, weight: 0});

        console.log(program)
        setCurrentProgram(program);
    }

    const onRemoveSet = (exercise, muscleGroup) => {
        var program = {...currentProgram};
        Object.values(program.exercises[muscleGroup])
            .filter((x) => x.exerciseName === exercise.exerciseName)
            .pop()
            .sets.pop();

        setCurrentProgram(program)
    }

    const onChangeReps = (reps, exercise, index, muscleGroup) => {
        let program = {...currentProgram};
        Object.values(program.exercises[muscleGroup])
            .filter((x) => x.exerciseName === exercise.exerciseName)
            .pop().sets[index].reps = Number(reps);
        setCurrentProgram(program)
    }

    const onSave = (data) => {
        let currProgram = data ? data : currentProgram;
        set(
            ref(db, "users/" + user.uid + "/programs/" + currProgram.name),
            currProgram
        )
            .catch((error) => {
                setOpenErrorSnackBar(true)
            })
            .finally(() => {
                setOpenSuccessSnackBar(true)
            });


        // console.log(history)
        let historyObj = history.filter(x => x[1].date === new Date().toLocaleDateString())
        if(history && historyObj.length === 0) {
            push(ref(db, "users/" + user.uid + "/programs/" + currProgram.name + "/history"), {
                date: new Date().toLocaleDateString(),
                exercises: currentProgram.exercises
            })
        } else {
            set(ref(db, "users/" + user.uid + "/programs/" + currProgram.name + "/history/" + historyObj[0][0]), {
                date: new Date().toLocaleDateString(),
                exercises: currentProgram.exercises
            })
        }

    }

    const getHistory = () => {
        get(ref(db, "users/" + user.uid + "/programs/" + currentProgram.name + "/history")).then(res => {
            setHistory(res.val() ? Object.entries(res.val()) : []);
        })
    }

    const onDeleteProgram = () => {
        setCurrentProgram({
            currentProgram: {
                name: "",
                exercises: []
            }});

        remove(ref(db, "programs/" + currentProgram.name));
        set(ref(db, "current_program"), "");
    }

    const onDeleteExercise = (exercise, muscleGroup) => {
        var exerciseIdToBeDeleted = Object.entries(
            currentProgram.exercises[muscleGroup]
        )
            .filter((x) => x[1].exerciseName === exercise.exerciseName)
            .pop()[0];
        remove(
            ref(
                db,
                "users/" + user.uid +
                "/programs/" +
                currentProgram.name +
                "/exercises/" +
                muscleGroup +
                "/" +
                exerciseIdToBeDeleted
            )
        );

        if (Object.keys(currentProgram.exercises[muscleGroup]).length === 1) {
            currentProgram.exercises[muscleGroup] = [];
        }

        var index = chosenMuscleGroup.findIndex(
            (x) => x === muscleGroup
        );
        if (currentProgram.exercises[muscleGroup].length === 0) {
            chosenMuscleGroup.splice(index, 1);
            setChosenTab(chosenMuscleGroup[0]);
        }
        if (chosenMuscleGroup.length === 0)
            setChosenMuscleGroup([])
    }

    const onChangeExerciseName = (exerciseName, exercise, muscleGroup) => {
        let program = currentProgram;
        Object.values(program.exercises[muscleGroup])
            .filter((x) => x.name === exercise.name)
            .pop().name = exerciseName;
        setCurrentProgram(program)
    }

    const onAddNewProgram = () => {
        setOpenProgramDetailsDialog(false);
        setOpenNewProgram(true);
    }


    return (
        <div>
            {/*<Bar onClick={(action) => onActionClicked(action)} user={user}/>*/}

            {/*<SideNavBar></SideNavBar>*/}
            {currentProgram ? (
                <Box sx={{margin: "15px", marginBottom: "0px"}}>


                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                            Muscle Group
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Muscle Group"
                            multiple
                            value={chosenMuscleGroup}
                            onChange={onChangeMuscleGroup}
                        >
                            {/*{currentProgram.exercises?.length === 0 ||*/}
                            {/*!currentProgram.exercises ? (*/}
                            {/*    <MenuItem disabled value="">*/}
                            {/*        <em>No options. Create an exercise first!</em>*/}
                            {/*    </MenuItem>*/}
                            {/*) : (*/}
                            {/*    ""*/}
                            {/*)}*/}
                            {(allExercises
                                    ? Object.keys(allExercises)
                                    : []
                            ).map((group) => (
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
                </Box>
            ) : (
                ""
            )}
            {chosenMuscleGroup.length > 0 && (
                <IconButton
                    onClick={() => onSave()}
                    className="saveButton"
                >
                    <SaveIcon/>
                </IconButton>
            )}


            {chosenMuscleGroup.length > 0 && (
                <TabContext value={chosenTab}>
                    <Box sx={{borderBottom: 1, borderColor: "divider", marginX: 2}}>
                        <TabList
                            aria-label="lab API tabs example"
                            onChange={onTabChange}
                        >
                            {chosenMuscleGroup.map((muscleGroup, key) => (
                                <Tab label={muscleGroup} value={muscleGroup} key={key}/>
                            ))}
                        </TabList>
                    </Box>


                    {currentProgram.exercises  && chosenMuscleGroup?.map((muscleGroup, key) => (
                        <TabPanel value={muscleGroup} key={key}
                        sx={{padding:2, marginBottom: "90px"}}
                        >
                            { currentProgram.exercises[muscleGroup] && Object.values(
                                currentProgram.exercises[muscleGroup]
                            ).map((exercise, key) => (
                                <MuscleGroupItem
                                    key={key}
                                    chosenWeight={chosenWeight}
                                    kgSlider={kgSlider}
                                    chosenExercise={exercise}
                                    exerciseName={exercise.exerciseName}
                                    onSave={(event) =>
                                        onSave(event, this.state.currentProgram)
                                    }
                                    onChangeReps={(...params) =>
                                        onChangeReps(...params, muscleGroup)
                                    }
                                    onChangeWeight={(...params) =>
                                        onChangeWeight(...params, muscleGroup)
                                    }
                                    onChangeExerciseName={(...params) =>
                                        onChangeExerciseName(...params, muscleGroup)
                                    }
                                    onDeleteExercise={(...params) =>
                                        onDeleteExercise(...params, muscleGroup)
                                    }
                                    onAddSet={(...params) =>
                                        onAddSet(...params, muscleGroup)
                                    }
                                    onRemoveSet={(...params) =>
                                        onRemoveSet(...params, muscleGroup)
                                    }
                                />
                            ))}
                        </TabPanel>
                    ))}
                    {!currentProgram.exercises ? <p>No exercises added yet!</p> : <div></div>}
                </TabContext>
            )}


            <AddNewExerciseDialog
                openNewExerciceDialog={openNewExercise}
                programs={programs}
                exercises={allExercises}
                onCloseExerciseDialog={(res, error) =>
                    closeNewExerciseDialog(res, error)
                }
            />

            <AddNewProgramDialog
                programs={programs}
                openNewProgramDialog={openNewProgram}
                onCloseProgramDialog={(res, error) =>
                    closeNewProgramDialog(res, error)
                }
            />
            <ProgramDetailsDialog
                openProgramDetailsDialog={openProgramDetailsDialog}
                onCloseProgramDetailsDialog={ (res,data) => closeNewProgramDetailsDialog(res, data)}
                programs={programs}
                currentProgram={currentProgram}
                exercises={allExercises}
                onAddNewProgram={onAddNewProgram}
            >
            </ProgramDetailsDialog>

            <AddNewExerciseToProgramDialog
                isOpen={openNewExerciseToProgramDialog}
                onClose={closeNewExerciseToProgramDialog}
                allExercises={allExercises}
                chosenExercises={currentProgram.exercises}
            >

            </AddNewExerciseToProgramDialog>


            <Snackbar
                open={openSuccessSnackBar}
                autoHideDuration={1000}
                onClose={() => handleCloseSnackBar()}
                anchorOrigin={{vertical: "bottom", horizontal: "center"}}
            >
                <Alert
                    onClose={() => handleCloseSnackBar()}
                    severity="success"
                    sx={{width: "100%"}}
                >
                    Save completed successfully
                </Alert>
            </Snackbar>
            <Snackbar
                open={openErrorSnackBar}
                autoHideDuration={1000}
                onClose={() => handleCloseSnackBar}
                anchorOrigin={{vertical: "bottom", horizontal: "center"}}
            >
                <Alert
                    onClose={() => handleCloseSnackBar}
                    severity="error"
                    sx={{width: "100%"}}
                >
                    Something went wrong
                </Alert>
            </Snackbar>

            <IconButton
                onClick={() => setOpenProgramDetailsDialog(true)}
                className="programButton"
            >
                <DescriptionIcon/>
            </IconButton>

            <IconButton
                onClick={() => setOpenNewExerciseToProgramDialog(true)}
                className="addButton"
            >
                <AddIcon/>
            </IconButton>


        </div>
    )
}