import {get, ref} from "firebase/database";
import db from "../firebaseConfigs";
import * as React from "react";
import {useEffect} from "react";
import {Line} from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement } from "chart.js/auto";
export default function History({user, currentProgramName}) {

    ChartJS.register(ArcElement, Tooltip, Legend, LineElement);

    // const [history, setHistory] = React.useState([]);
    const [historyData, setHistoryData] = React.useState({});
    const getHistory = () => {
        console.log("users/" + user.uid + "/programs/" + currentProgramName + "/history")
        get(ref(db, "users/" + user.uid + "/programs/" + currentProgramName + "/history")).then(res => {
            console.log(res.val())
            getDataFromHistory(Object.values(res.val()))
        })
    }

    useEffect(() => {
        console.log(user,currentProgramName)
        if(user && currentProgramName){
            getHistory();
        }
    },[user, currentProgramName])

    const getDataFromHistory = (history) => {

        let transformedData = [];

        // Create a map to store sets grouped by exercise name
        let exerciseSetsMap = new Map();

        // Iterate through the workoutData object
        for (const workoutId in history) {
            const workout = history[workoutId];

            // Iterate through exercises
            for (const muscleGroup in workout.exercises) {
                const exercises = workout.exercises[muscleGroup];

                // Iterate through exercise instances
                for (const exerciseId in exercises) {
                    const exercise = exercises[exerciseId];

                    const exerciseName = exercise.exerciseName;
                    const date = workout.date;
                    const sets = exercise.sets;

                    // Check if exerciseName is already in the map
                    if (!exerciseSetsMap.has(exerciseName)) {
                        exerciseSetsMap.set(exerciseName, {
                            exerciseName,
                            sets: [],
                        });
                    }

                    // Add the current sets and date to the exercise in the map
                    exerciseSetsMap.get(exerciseName).sets.push({
                        sets,
                        date,
                    });
                }
            }
        }

        // Convert the map values to an array
        transformedData = Array.from(exerciseSetsMap.values());
        // console.log(transformedData);
        getDataForGraph(transformedData)
        // console.log()
    }

    const getDataForGraph = (workoutData) => {

        let uniqueDates = [];
        let datasets = [];

// Extract unique dates
        workoutData.forEach(exercise => {
            exercise.sets.forEach(set => {
                const date = set.date;
                if (!uniqueDates.includes(date)) {
                    uniqueDates.push(date);
                }
            });
        });

// Create datasets array
        workoutData.forEach(exercise => {
            const maxWeights = [];

            uniqueDates.forEach(date => {
                const setsForDate = exercise.sets.filter(set => set.date === date);
                const nonZeroWeights = setsForDate[0].sets.map(set => set.weight).filter(weight => weight !== 0);
                console.log(setsForDate)
                const maxWeight = nonZeroWeights.length > 0 ? Math.max(...nonZeroWeights) : 0;
                maxWeights.push(maxWeight);
            });

            datasets.push({
                label: exercise.exerciseName,
                data: maxWeights,
            });
        });

// Create the final object
        const finalObject = {
            labels: uniqueDates,
            datasets: datasets,
        };

        console.log(finalObject);
        setHistoryData(finalObject);

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


    return !historyData.datasets ? <></> : (<div>
        {console.log(historyData)}
        <Line options={options} data={historyData}  />
    </div>)
}