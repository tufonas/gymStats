import TabPanel from "@mui/lab/TabPanel";
import {Grid} from "@mui/material";
import MuscleGroupItem from "./MuscleGroupItem";
import * as React from "react";
import {ref, remove} from "firebase/database";
import {db} from "../firebaseConfigs";

export default function TabContent ({   muscleGroup,
                                        currentProgram,
                                        allExercises,
                                        setCurrentProgram,
                                        chosenMuscleGroup,
                                        onSave,
                                        onDeleteExercise
    }) {

    const [selectedExercise, setSelectedExercise] = React.useState();
    const [chosenWeight, setChosenWeight] = React.useState(0);
    const [kgSlider, setKgSlider] = React.useState(0.5);

    const onChangeExerciseName = (exerciseName, exercise, muscleGroup) => {
        let program = currentProgram;
        Object.values(program.exercises[muscleGroup])
            .filter((x) => x.name === exercise.name)
            .pop().name = exerciseName;
        setCurrentProgram(program)
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

    const onChangeWeight = (weight, exercise, index, muscleGroup) => {
        let program = {...currentProgram};
        Object.values(program.exercises[muscleGroup])
            .filter((x) => x.exerciseName === exercise.exerciseName)
            .pop().sets[index].weight = Number(weight);
        setCurrentProgram(program);
    }

    const onAddSet = (exercise, muscleGroup) => {
        var program = {...currentProgram};
        // var program;
        // program = Object.assign(program, currentProgram);
        Object.values(program.exercises[muscleGroup])
            .filter((x) => x.exerciseName === exercise.exerciseName)
            .pop()
            .sets.push({reps: 0, weight: 0});

        setCurrentProgram(program);
    }

    // const onDeleteExercise = (exercise, muscleGroup) => {
    //     var exerciseIdToBeDeleted = Object.entries(
    //         currentProgram.exercises[muscleGroup]
    //     )
    //         .filter((x) => x[1].exerciseName === exercise.exerciseName)
    //         .pop()[0];
    //     remove(
    //         ref(
    //             db,
    //             "users/" + user.uid +
    //             "/programs/" +
    //             currentProgram.name +
    //             "/exercises/" +
    //             muscleGroup +
    //             "/" +
    //             exerciseIdToBeDeleted
    //         )
    //     );
    //
    //     if (Object.keys(currentProgram.exercises[muscleGroup]).length === 1) {
    //         currentProgram.exercises[muscleGroup] = [];
    //     }
    //
    //     var index = chosenMuscleGroup.findIndex(
    //         (x) => x === muscleGroup
    //     );
    //     if (currentProgram.exercises[muscleGroup].length === 0) {
    //         chosenMuscleGroup.splice(index, 1);
    //         setChosenTab(chosenMuscleGroup[0]);
    //     }
    //     if (chosenMuscleGroup.length === 0)
    //         setChosenMuscleGroup([])
    // }


    return (<TabPanel value={muscleGroup}
                  sx={{padding:2, marginBottom: "90px"}}
        >
            <Grid container spacing={0} sx={{  marginBottom: "40px" }}>
                { currentProgram.exercises[muscleGroup] && Object.values(
                    currentProgram.exercises[muscleGroup]
                ).map((exercise, key) => (
                    <Grid item xs={3} >

                        {allExercises ? (
                            <div className="flex flex-column" style={{ width: '70px', margin: '5px' }}>
                                <img src={allExercises[muscleGroup][exercise.exerciseId].photoUrl} width={'70px'} height={'70px'} className="border-1 border-round-sm p-2 shadow-6" onClick={() => setSelectedExercise(exercise)}></img>
                                {/*<label className="text-center">{allExercises[muscleGroup][exercise.exerciseId].exerciseName}</label>*/}
                            </div>
                        ) : (<p>asd</p>)}

                    </Grid>
                ))}
            </Grid>
            {
                selectedExercise ? (
                    <MuscleGroupItem
                        chosenWeight={chosenWeight}
                        kgSlider={kgSlider}
                        chosenExercise={selectedExercise}
                        exerciseName={allExercises[muscleGroup][selectedExercise.exerciseId]?.exerciseName}
                        onSave={(event) =>
                            onSave(event, this.state.currentProgram)
                        }
                        onChangeReps={(...params) =>
                        {
                            onChangeReps(...params, muscleGroup)
                            onSave();
                        }
                        }
                        onChangeWeight={(...params) =>
                        {
                            onChangeWeight(...params, muscleGroup)
                            onSave();
                        }
                        }
                        onChangeExerciseName={(...params) =>
                        {onChangeExerciseName(...params, muscleGroup); onSave();  }
                        }
                        onDeleteExercise={(...params) =>
                        { onDeleteExercise(...params, muscleGroup); }
                        }
                        onAddSet={(...params) =>
                        {onAddSet(...params, muscleGroup); onSave();  }
                        }
                        onRemoveSet={(...params) =>
                        { onRemoveSet(...params, muscleGroup); onSave();  }
                        }
                    />
                ) : (<p></p>)
            }

        </TabPanel>
    )
}