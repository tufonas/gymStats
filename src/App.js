import "./App.css";
import * as React from "react";
import {Navigate, Route, Routes, useLocation, useNavigate,} from "react-router-dom"
import Home from "./components/Home";
import Login from "./components/Login";
import History from "./components/History";
import {ProtectedRoute} from "./guards/AuthGuard";
import Bar from "./components/Toolbar";
import {getAuth} from "firebase/auth";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import HistoryIcon from '@mui/icons-material/History';
import {BottomNavigation, BottomNavigationAction} from "@mui/material";
import Paper from "@mui/material/Paper";
import {get, ref} from "firebase/database";
import db from "./firebaseConfigs";
import endpoints from "./constants";
import {useState} from "react";

function App() {

    let navigate = useNavigate();
    let location = useLocation();

    const [authenticated, setAuthenticated] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [openNewProgram, setOpenNewProgram] = React.useState(false);
    const [openNewExercise, setOpenNewExercise] = React.useState(false);
    const [actionName, setActionName] = React.useState("");
    const [currentProgramName, setCurrentProgramName] = useState("");


    React.useEffect(() => {
        getAuth().onAuthStateChanged((user) => {
            console.log(user)
            if(user) {
                getCurrentProgramName(user)
                setAuthenticated(() => {
                    setIsLoading(false);
                    return user;
                });
            } else {
                setIsLoading(false);
            }


        })
    }, []);

    function getCurrentProgramName(user) {

        console.log(user)
        get(ref(db, "users/" + user.uid + endpoints.CURRENT_PROGRAM))
            .then((res) => {
                let response = res.val() ? res.val() : "";
                console.log(response)
                setCurrentProgramName(response);
            })
            .catch((error) => {
                // console.log(error);
            });
    }

    function onActionClicked(actionName) {
        switch (actionName) {
            case "Program":
                setOpenNewProgram(true);
                break;
            case "Exercise":
                setOpenNewExercise(true);
                break;
            default:
                break;
        }
    }

    const [value, setValue] = React.useState(location.pathname === '/home' ? 1 : 0);

    return isLoading ? <div/> : (
        <div>
            <Bar onClick={(action) => {
                onActionClicked(action);
            }}
                 user={authenticated}
            />
            <Routes>
                <Route path="/" element={<Navigate to='/home' />}></Route>
                <Route path="/home" element={
                    <ProtectedRoute component={Home} user={authenticated}
                                    openNewProgram={openNewProgram}
                                    openNewExercise={openNewExercise}
                                    setOpenNewExercise={setOpenNewExercise}
                                    setOpenNewProgram={setOpenNewProgram}
                    ></ProtectedRoute>}>
                </Route>
                <Route path="/history" element={
                    <ProtectedRoute component={History} user={authenticated} currentProgramName={currentProgramName}
                    ></ProtectedRoute>}>
                </Route>
                <Route path="/login" element={<Login/>}></Route>
            </Routes>
            <Paper sx={{position: 'fixed', bottom: 0, left: 0, right: 0}} elevation={3}>
                {authenticated ? (<BottomNavigation
                    showLabels
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                    }}
                >
                    <BottomNavigationAction label="History" icon={<HistoryIcon/>} onClick={() => navigate("/history")}/>
                    <BottomNavigationAction label="Workout" icon={<FitnessCenterIcon/>} onClick={() => navigate("/home")}/>
                </BottomNavigation>) : <></>}
            </Paper>
        </div>
    )

}

export default App;
