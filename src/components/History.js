import {get, ref} from "firebase/database";
import {db} from "../firebaseConfigs";
import * as React from "react";
import {useEffect} from "react";
import {Bar, Line} from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement } from "chart.js/auto";
import { Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import MuscleGroups from "../enums/muscleGroupEnum";
export default function History({user, currentProgramName}) {

    ChartJS.register(ArcElement, Tooltip, Legend, LineElement);

    // const [history, setHistory] = React.useState([]);
    const [historyData, setHistoryData] = React.useState({});
    const [chosenMuscleGroup, setChosenMuscleGroup] = React.useState('');
    const [chosenExercise, setChosenExercise] = React.useState('');
    const [uniqueExercises, setUniqueExercises] = React.useState([]);
    const [chartData, setChartData] = React.useState(null);
    const getHistory = () => {
        // console.log("users/" + user.uid + "/programs/" + currentProgramName + "/history")
        get(ref(db, "users/" + user.uid + "/programs/" + currentProgramName + "/history")).then(res => {
            console.log(res.val())
            setHistoryData(Object.values(res.val()));
            setUniqueExercises(getUniqueExercises(Object.values(res.val())));
            // getDataFromHistory(Object.values(res.val()))
        })
    }

    useEffect(() => {
        // console.log(user,currentProgramName)
        if(user && currentProgramName){
            getHistory();

        }
    },[user, currentProgramName])

    const getDataFromHistory = (history, exerciseId) => {

        // console.log(history)

        let transformedData = [];

        // Create a map to store sets grouped by exercise name
        let exerciseSetsMap = new Map();

        // Iterate through the workoutData object
        for (const workoutId in history) {
            const workout = history[workoutId];

            // Iterate through exercises
            for (const muscleGroup in workout.exercises) {
                const exercises = workout.exercises[muscleGroup];
                // console.log(workout.exercises[muscleGroup])
                // Iterate through exercise instances
                for (const exerciseId in exercises) {
                    const exercise = exercises[exerciseId];
                    // console.log(exercise)
                    const exerciseName = exercise.exerciseName;
                    const date = workout.date;
                    const sets = exercise.sets;

                    // Check if exerciseName is already in the map
                    if (!exerciseSetsMap.has(exerciseId)) {
                        exerciseSetsMap.set(exerciseId, {
                            exerciseName,
                            sets: [],
                        });
                    }

                    // Add the current sets and date to the exercise in the map
                    exerciseSetsMap.get(exerciseId).sets.push({
                        sets,
                        date,
                    });
                }
            }
        }

        // Convert the map values to an array
        transformedData = Array.from(exerciseSetsMap.values());
        console.log(transformedData, exerciseSetsMap);
        getDataForGraph(exerciseSetsMap.get(exerciseId))
        // console.log()
    }


    const getUniqueExercises = (history) => {
        const uniqueExercises = [];
        history.forEach( workoutData => {
            // Iterate through the main categories (Back, Biceps, Chest, Core, Legs, Shoulders, Triceps)
            Object.keys(workoutData.exercises).forEach( category => {
                Object.values(workoutData.exercises).forEach( exercisesPerDay => {
                    // console.log(objToArray(exercisesPerDay))
                     // exercise = workoutData.exercises[category][exerciseId].exerciseName;
                    objToArray(exercisesPerDay).forEach( exercise => {
                        // console.log(exercise)
                        const keyValueObj = objToKeyValue(exercise);
                        // console.log(keyValueObj)

                        if (!uniqueExercises.find(x => objToKeyValue(x).key === keyValueObj.key)) {
                            uniqueExercises.push(exercise);
                        }
                    })
                })
            })
        })

        console.log(uniqueExercises)

        return uniqueExercises;
    };

    const objToArray = (obj) => {
        return Object.entries(obj).map(([key, value]) => ({ [key]: value }));
    }

    const objToKeyValue = (obj) => {

        const newObj = {
            key: Object.entries(obj)[0][0],
            value: Object.entries(obj)[0][1]
        }
        return newObj;
    }

    const getDataForGraph = (exerciseData) => {

        let uniqueDates = [];
        let datasetsMap = new Map();
        let datasets = [];
        let weights = [];
        let dataArr = [];

        console.log(exerciseData)

        exerciseData.sets.forEach( setsForDate => {
            uniqueDates.push(setsForDate.date);
            weights.push(setsForDate.sets)
            let data = 0;
            setsForDate.sets.forEach( (set,index) => {
                data = data + set.weight * set.reps;
            })
            dataArr.push(data);
        })
        datasets = [{
            label: "1o set 12x30\n, 2o set 12x40\n, 3o set 10x20\n",
            data: dataArr
        }]
        console.log(datasets)

        const finalObject = {
            labels: uniqueDates,
            datasets: datasets,
        };
//
        console.log(finalObject);
        setChartData(finalObject);

    }

    const data = {
        labels: ['Jun', 'Jul', 'Aug'],
        datasets: [
            {
                id: 1,
                label: '',
                data: [5, 6, 7],
            },
            {
                id: 2,
                label: '',
                data: [3, 2, 1],
            },
        ],
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Back exercises',
            },
        },
    };

    const createChartData = (exerciseId) => {
        getDataFromHistory(historyData, exerciseId);
    }


    return (
        <div style={{ display: "flex", flexWrap: "wrap"}}>

                <FormControl sx={{margin: 2}} fullWidth  size="small">
                    <InputLabel id="demo-simple-select-label">
                        Choose exercise
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Current program"
                        value={chosenExercise}
                        multiple={false}
                        onChange={(event) => {
                            console.log(event.target.value)
                            setChosenExercise(event.target.value);
                            createChartData(event.target.value);
                        }}
                    >

                        { uniqueExercises && Object.values(uniqueExercises).map(x => objToKeyValue(x)).map((group) => (
                            <MenuItem
                                value={group.key}
                                key={group.key}
                                sx={{display: "flex", justifyContent: "space-between"}}
                            >
                                {group.value.exerciseName}
                            </MenuItem>

                        ))}
                    </Select>
                </FormControl>
            { chartData ? <Line options={options} data={chartData}  /> : <div></div>}
        </div>)
}