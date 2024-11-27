import * as React from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import {InputNumber} from "primereact/inputnumber";
import {useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import {Grid} from "@mui/material";
import { storage } from "../firebaseConfigs";
import { ref, listAll, getDownloadURL  } from "firebase/storage";


export default function MuscleGroupItem({
                                            chosenWeight,
                                            kgSlider,
                                            chosenExercise,
                                            exerciseName,
                                            onSave,
                                            onChangeReps,
                                            onChangeWeight,
                                            onChangeExerciseName,
                                            onDeleteExercise,
                                            onAddSet,
                                            onRemoveSet
                                        }) {
        return (
        <Card sx={{marginBottom: 2, padding: 1}}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                }}
            >

                <Typography  sx={{marginX: 2, marginY: 0}} variant="h6">{exerciseName}</Typography>
                <IconButton
                    aria-label="delete"
                    color="error"
                    onClick={() =>
                        onDeleteExercise(chosenExercise)
                    }
                >
                    <DeleteIcon/>
                </IconButton>
            </Box>
            <Box sx={{width: "100%", display: "flex"}}>
                <Stack
                    sx={{m: 1}}
                    direction="column"
                    flexWrap="wrap"
                    justifyContent="space-around"
                    alignContent="center"
                >
                    {chosenExercise?.sets?.map((setNumber, index) => (
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                my: 1,
                            }}
                            key={`${setNumber}` + index}
                        >
                            <InputNumber
                                key={`${setNumber}` + index}
                                inputId="horizontal"
                                value={setNumber.reps}
                                onValueChange={(event) => (onChangeReps(
                                    event.value,
                                    chosenExercise,
                                    index
                                ))}
                                showButtons
                                buttonLayout="horizontal"
                                step={1}
                                decrementButtonClassName="p-button-danger p-0 w-3"
                                incrementButtonClassName="p-button-info p-0 w-3 bg-green-100"
                                incrementButtonIcon="pi pi-plus"
                                decrementButtonIcon="pi pi-minus"
                                inputClassName="w-full text-sm p-2 text-center"
                                className="w-auto"
                                suffix=" reps"
                            />
                        </Box>
                    ))}
                </Stack>

                <Stack
                    sx={{m: 1}}
                    direction="column"
                    flexWrap="wrap"
                    justifyContent="space-around"
                    alignContent="center"
                >
                    {chosenExercise?.sets?.map((setNumber, index) => (
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                my: 1,
                            }}
                            key={`${setNumber}` + index}
                        >
                            <InputNumber
                                key={`${setNumber}` + index}
                                inputId="horizontal"
                                value={setNumber.weight}
                                onValueChange={(event) => onChangeWeight(
                                    event.value,
                                    chosenExercise,
                                    index
                                )}
                                showButtons
                                buttonLayout="horizontal"
                                step={kgSlider}
                                decrementButtonClassName="p-button-danger p-1 w-3"
                                incrementButtonClassName="p-button-info p-1 w-3"
                                incrementButtonIcon="pi pi-plus"
                                decrementButtonIcon="pi pi-minus"
                                inputClassName="w-full text-sm p-2 text-center"
                                className="w-auto"
                                suffix=" kg"

                            />
                        </Box>
                    ))}
                </Stack>
            </Box>
            <CardActions sx={{display: "flex", justifyContent: "space-between"}}>
                <Button
                    size="small"
                    startIcon={<RemoveIcon/>}
                    variant="outlined"
                    sx={{width: "142px"}}
                    onClick={() => onRemoveSet(chosenExercise)}
                >
                    Remove Set
                </Button>
                <Button
                    size="small"
                    startIcon={<AddIcon/>}
                    variant="outlined"
                    sx={{width: "142px"}}
                    onClick={() => onAddSet(chosenExercise)}
                >
                    Add Set
                </Button>

            </CardActions>
        </Card>
    )
}
