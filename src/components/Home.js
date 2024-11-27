import Bar from "./Toolbar";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
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
import {db} from "../firebaseConfigs";
import {from, of, switchMap} from "rxjs";
import ResponseResults from "../enums/responseResult";
import DescriptionIcon from '@mui/icons-material/Description';
import MuiAlert from "@mui/material/Alert";
import ProgramDetailsDialog from "../dialogs/programDetailsDialog";
import Test from "../dialogs/programDetailsDialog";
import AddIcon from "@mui/icons-material/Add";
import endpoints from "../constants";
import {Grid, SvgIcon, Typography} from "@mui/material";
import AddNewExerciseToProgramDialog from "../dialogs/AddNewExerciseToProgramDialog";
import {useEffect} from "react";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import { Alert } from '@mui/material';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';

import _ from 'lodash';
import TabContent from "./TabContent";
export default function Home({user, openNewProgram, openNewExercise, setOpenNewExercise, setOpenNewProgram, openProgramsDialog, onNavigateToHome}) {

    const [currentProgram, setCurrentProgram] = React.useState({
        name: "",
        exercises: [],
    });
    const [allExercises, setAllExercises] = React.useState(null);
    const [history, setHistory] = React.useState([]);
    const [openSuccessSnackBar, setOpenSuccessSnackBar] = React.useState(false);
    const [openErrorSnackBar, setOpenErrorSnackBar] = React.useState(false);
    const [programs, setPrograms] = React.useState([]);
    const [chosenMuscleGroup, setChosenMuscleGroup] = React.useState([]);
    const [chosenTab, setChosenTab] = React.useState("");
    const [chosenWeight, setChosenWeight] = React.useState(0);
    const [kgSlider, setKgSlider] = React.useState(0.5);
    const [openProgramDetailsDialog, setOpenProgramDetailsDialog] = React.useState(false);
    const [openNewExerciseToProgramDialog, setOpenNewExerciseToProgramDialog] = React.useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedExercise, setSelectedExercise] = React.useState()

    useEffect(() => {
        getPrograms();
        getAllExercises();
    },[]);

    useEffect(() => {
        getHistory();
    }, [currentProgram])

    useEffect(() => {


        if(searchParams.get("muscleGroups")) {
            let muscleGroups = searchParams.get("muscleGroups")?.split(',');
            if(muscleGroups) {
                setChosenMuscleGroup(muscleGroups)
                // localStorage.setItem('muscleGroups', muscleGroups);
                setChosenTab(muscleGroups[0])
            }
        } else if (localStorage.getItem('muscleGroups')) {
            let muscleGroups = localStorage.getItem('muscleGroups')?.split(',');
            setChosenMuscleGroup(muscleGroups)
            setChosenTab(muscleGroups[0])
        }

    },[searchParams])

    useEffect(() => {
        setOpenProgramDetailsDialog(openProgramsDialog)
    }, [openProgramsDialog])

    function getCurrentProgram(programs) {
        get(ref(db, "users/" + user.uid + endpoints.CURRENT_PROGRAM))
            .then((res) => {
                let response = res.val() ? res.val() : "";
                if (Object.keys(programs)?.length === 1) {
                    createUpdateCurrentProgram(Object.keys(programs).pop());
                    response = Object.keys(programs).pop();
                }
                console.log(response, programs)
                setCurrentProgram(programs[response]);
                console.log(programs[response])
            })
            .catch((error) => {
                // console.log(error);
            });
    }


    function createUpdateCurrentProgram(currentProgramName) {
        set(ref(db, "users/"  + user.uid + endpoints.CURRENT_PROGRAM), currentProgramName);
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
            console.log(allExercises)
            console.log(res.val())
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
        onNavigateToHome()
    }

    function closeNewExerciseToProgramDialog(response, data) {

        setOpenNewExerciseToProgramDialog(false);
        switch (response) {
            case ResponseResults.SUCCESS:
                console.log(data)
                let newExerciseMuscleGroup = Object.keys(data).pop();
                // let dataToBeSaved = Object.assign(currentProgram.exercises[Object.keys(data).pop()], Object.values(data)[0])
                // console.log(dataToBeSaved);
                push(ref(db, "users/" + user.uid + "/programs/" +
                    currentProgram.name + "/exercises/" + newExerciseMuscleGroup ), data[newExerciseMuscleGroup] )
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
        searchParams.delete("muscleGroups");
        searchParams.append("muscleGroups", event.target.value)
        setSearchParams({muscleGroups: searchParams.get("muscleGroups")})
        localStorage.setItem("muscleGroups", event.target.value);
        if(event.target.value[0] === undefined) {
            setChosenTab('');
        } else {
            setChosenTab(event.target.value[0]);
        }


        console.log("change", event.target.value[0], chosenTab);
    }

    const onTabChange = (event, newValue) => {
        setChosenTab(newValue);
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
                // setOpenSuccessSnackBar(true)
            });


        // console.log(Object.entries(currentProgram.exercises));
        currentProgram.exercises = Object.fromEntries(Object.entries(currentProgram.exercises).filter(x => x[0] === chosenTab ));
        // currentProgram.exercises.filter( x => console.log(x));
        // console.log(history)
        // console.log(data, currentProgram,chosenTab, history)
        let historyObj = history.filter(x => x[1].date === new Date().toLocaleDateString())
        // console.log(historyObj)
        if(history && historyObj.length === 0) {
            push(ref(db, "users/" + user.uid + "/programs/" + currProgram.name + "/history"), {
                date: new Date().toLocaleDateString(),
                exercises: currentProgram.exercises
            })
        } else {

            // const mergedArray = _.mergeWith([], [historyObj[0][1].exercises[chosenTab], currentProgram.exercises[chosenTab]], (arrValue, srcValue) => {
            //     if (_.isArray(arrValue)) {
            //         return arrValue.concat(srcValue);
            //     }
            // });
            //
            // console.log(mergedArray);
            // let obj = currentProgram.exercises[chosenTab]
            // // _.merge(obj, [historyObj[0][1].exercises[chosenTab]])
            const mergedObject = _.merge({}, historyObj[0][1].exercises, currentProgram.exercises[chosenTab]);
            // console.log(currentProgram.exercises[chosenTab], historyObj[0][1].exercises)
            // console.log(mergedObject)
            set(ref(db, "users/" + user.uid + "/programs/" + currProgram.name + "/history/" + historyObj[0][0]), {
                date: new Date().toLocaleDateString(),
                exercises: _.merge({}, historyObj[0][1].exercises, currentProgram.exercises[chosenTab])
            })
        }

    }

    const getHistory = () => {
        get(ref(db, "users/" + user.uid + "/programs/" + currentProgram?.name + "/history")).then(res => {
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





    const onAddNewProgram = () => {
        setOpenProgramDetailsDialog(false);
        setOpenNewProgram(true);
    }


    return (
        <div>
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
                <div>
                <Typography align="center" marginTop={"20px"} variant="body1" fontWeight="bold"> In order to start, create a new program !</Typography>
                <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                    <IconButton className="addButton" color="primary" onClick={() => setOpenNewProgram(true)}>
                        <AddIcon />
                    </IconButton>
                </div>

                <AddNewProgramDialog
                            programs={programs}
                            openNewProgramDialog={openNewProgram}
                            onCloseProgramDialog={(res, error) =>
                                closeNewProgramDialog(res, error)
                            }
                        />
                </div>
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
                        <TabContent
                            muscleGroup={muscleGroup}
                            key={key}
                            allExercises={allExercises}
                            chosenMuscleGroup={chosenMuscleGroup}
                            currentProgram={currentProgram}
                            setCurrentProgram={(...params) => setCurrentProgram(...params)}
                            onSave={(...params) => onSave(...params)}
                        >

                        </TabContent>

                        // <TabPanel value={muscleGroup} key={key}
                        // sx={{padding:2, marginBottom: "90px"}}
                        // >
                        //     <Grid container spacing={0} sx={{  marginBottom: "10px" }}>
                        //     { currentProgram.exercises[muscleGroup] && Object.values(
                        //         currentProgram.exercises[muscleGroup]
                        //     ).map((exercise, key) => (
                        //             <Grid item xs={3} >
                        //
                        //                 {allExercises ? (
                        //                     <div className="flex flex-column" style={{ width: '70px', margin: '5px' }}>
                        //                         <img src={allExercises[muscleGroup][exercise.exerciseId].photoUrl} width={'70px'} height={'70px'} className="border-1 border-round-sm p-2 shadow-6" onClick={() => setSelectedExercise(exercise)}></img>
                        //                         {/*<label className="text-center">{allExercises[muscleGroup][exercise.exerciseId].exerciseName}</label>*/}
                        //                     </div>
                        //                 ) : (<p>asd</p>)}
                        //
                        //             </Grid>
                        //     ))}
                        //     </Grid>
                        //     {
                        //         selectedExercise ? (
                        //             <MuscleGroupItem
                        //             key={key}
                        //             chosenWeight={chosenWeight}
                        //             kgSlider={kgSlider}
                        //             chosenExercise={selectedExercise}
                        //             exerciseName={allExercises[muscleGroup][selectedExercise.exerciseId]?.exerciseName}
                        //             onSave={(event) =>
                        //                 onSave(event, this.state.currentProgram)
                        //             }
                        //             onChangeReps={(...params) =>
                        //             {
                        //                 onChangeReps(...params, muscleGroup)
                        //                 onSave();
                        //             }
                        //             }
                        //             onChangeWeight={(...params) =>
                        //             {
                        //                 onChangeWeight(...params, muscleGroup)
                        //                 onSave();
                        //             }
                        //             }
                        //             onChangeExerciseName={(...params) =>
                        //             {onChangeExerciseName(...params, muscleGroup); onSave();  }
                        //             }
                        //             onDeleteExercise={(...params) =>
                        //             { onDeleteExercise(...params, muscleGroup); }
                        //             }
                        //             onAddSet={(...params) =>
                        //             {onAddSet(...params, muscleGroup); onSave();  }
                        //             }
                        //             onRemoveSet={(...params) =>
                        //             { onRemoveSet(...params, muscleGroup); onSave();  }
                        //             }
                        //         />
                        //         ) : (<p></p>)
                        //     }
                        //
                        // </TabPanel>
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
                programExercises={currentProgram.exercises}
                chosenTab={chosenTab}
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

            {/*<IconButton*/}
            {/*    onClick={() => setOpenProgramDetailsDialog(true)}*/}
            {/*    className="programButton"*/}
            {/*>*/}
            {/*    <DescriptionIcon/>*/}
            {/*</IconButton>*/}

            {currentProgram?.name ? <IconButton
                onClick={() => setOpenNewExerciseToProgramDialog(true)}
                className="addButton2"
            >
                <AddIcon/>
            </IconButton> : <div></div>}


        </div>
    )
}