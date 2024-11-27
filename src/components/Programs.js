import React, {useEffect, useState} from "react";
import Stack from "@mui/material/Stack";
import {IconButton, Typography, styled} from "@mui/material";
import Paper from "@mui/material/Paper";
import {get, onValue, ref, set} from "firebase/database";
import {db} from "../firebaseConfigs";
import endpoints from "../constants";
import {useNavigate} from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import ProgramDetailsDialog from "../dialogs/programDetailsDialog";
import ResponseResults from "../enums/responseResult";
import AddNewProgramDialog from "../dialogs/addNewProgramDialog";

export default function Programs({user, currentProgramName}) {

    const [programs, setPrograms] = useState([]);
    const [programsNames, setProgramsNames] = useState([]);
    const [openProgramDetailsDialog, setOpenProgramDetailsDialog] = React.useState(false);
    const [chosenProgramName, setChosenProgramName] = React.useState();
    const [openNewProgram, setOpenNewProgram] = React.useState(false);

    let navigate = useNavigate();

    useEffect(() => {
        if (user) {
            onValue(ref(db, "users/" + user.uid + "/programs"), (res) => {
                let response = res.val() ? res.val() : "";
                setPrograms(response)
                setProgramsNames(Object.keys(response))
            })
        }

    }, [user])

    const Item = styled(Paper)(({theme}) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        width: "90%",
        color: theme.palette.text.secondary,
        marginRight: "10px"
    }));

    const onAddNewProgram = () => {
        setOpenProgramDetailsDialog(false);
        setOpenNewProgram(true);
    }

    function createUpdateCurrentProgram(currentProgramName) {
        console.log(currentProgramName, user);
        set(ref(db, "users/"  + user.uid + endpoints.CURRENT_PROGRAM), currentProgramName);
    }

    function closeNewProgramDialog(response, error) {
        setOpenNewProgram(false);
        switch (response) {
            case ResponseResults.SUCCESS:
                // setOpenSuccessSnackBar(true)
                break;
            case ResponseResults.ERROR:
                // setOpenErrorSnackBar(true)
                break;
            default:
                break;
        }
    }

    function closeNewProgramDetailsDialog(response, data) {
        console.log(data);
        setOpenProgramDetailsDialog(false);
        switch (response) {
            case ResponseResults.SUCCESS:
                createUpdateCurrentProgram(data.name)
                onSave(data);
                // setCurrentProgram(data);
                // setOpenSuccessSnackBar(true)
                break;
            case ResponseResults.ERROR:
                // setOpenErrorSnackBar(true)
                break;
            default:
                break;
        }
        // onNavigateToHome()
    }

    const onSave = (data) => {
        set(ref(db, "users/" + user.uid + "/programs/" + data.name), data)
    }


    return programs?.length === 0 ? 
    <div>
      <Typography variant="body1" fontWeight="bold" alignContent={"center"} align="center" marginTop={"30px"}>
        Add new program by clicking the + 
      </Typography>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}
      >
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
    : (<div>
        <h5 style={{textAlign: "center", margin: "15px"}}>Choose your program</h5>
        <Stack spacing={2} sx={{
            marginTop: "15px",
            display: "flex",
            alignItems: "center",
            margin: "15px"
        }}>
            {
               Object.values(programs).map(program => (
                <div key={program.name + "parent"} style={{width:"100%"}}>
                    <div style={{display: "flex", width: "100%"}} key={program.name + "div"}>
                        <Item onClick={() => { createUpdateCurrentProgram(program.name); navigate('/home'); }}
                          sx={{border: currentProgramName === program.name ? "2px solid #1976d24a" : "white"}}
                          key={program.name}> 
                          <span style={{fontWeight:"bold"}}>{program.name}</span>
                        </Item>
                        <IconButton className="editIcon" color="primary" key={program.name + "1"} onClick={() =>{setChosenProgramName(program.name); setOpenProgramDetailsDialog(true)}}>
                          <EditIcon/>
                        </IconButton>
                    </div>  

                </div>
                ))

            }
        </Stack>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
            <IconButton className="addButton" color="primary" onClick={() => setOpenNewProgram(true)}>
            <AddIcon />
            </IconButton>
        </div>
        <ProgramDetailsDialog
                openProgramDetailsDialog={openProgramDetailsDialog}
                onCloseProgramDetailsDialog={ (res,data) => closeNewProgramDetailsDialog(res, data)}
                programs={programs}
                currentProgram={programs[chosenProgramName]}
                onAddNewProgram={onAddNewProgram}
            >
        </ProgramDetailsDialog>

        <AddNewProgramDialog
                programs={programs}
                openNewProgramDialog={openNewProgram}
                onCloseProgramDialog={(res, error) =>
                    closeNewProgramDialog(res, error)
                }
            />

    </div>)
}