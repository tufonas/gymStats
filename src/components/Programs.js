import React, {useEffect, useState} from "react";
import Stack from "@mui/material/Stack";
import {styled} from "@mui/material";
import Paper from "@mui/material/Paper";
import {get, ref} from "firebase/database";
import db from "../firebaseConfigs";
import endpoints from "../constants";
import {useNavigate} from "react-router-dom";

export default function Programs({user, currentProgramName}) {

    const [programs, setPrograms] = useState([]);
    let navigate = useNavigate();

    useEffect(() => {
        if (user) {
            console.log("asdasdas", user.uid)
            get(ref(db, "users/" + user.uid + "/programs"))
                .then((res) => {
                    console.log(res)
                    let response = res.val() ? res.val() : "";
                    console.log(Object.keys(response))
                    setPrograms(Object.keys(response))
                })
                .catch((error) => {
                    console.log(error);
                });
        }

    }, [user])

    const Item = styled(Paper)(({theme}) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(3),
        textAlign: 'center',
        width: "90%",
        color: theme.palette.text.secondary,
    }));

    return programs?.length === 0 ? <div/> : (<div>
        <h5 style={{textAlign: "center", margin: "15px"}}>Choose your current program</h5>
        <Stack spacing={2} sx={{
            marginTop: "15px",
            display: "flex",
            alignItems: "center"
        }}>
            {
                programs.map(program => (
                    <Item onClick={() => navigate('/home')}
                          sx={{backgroundColor: currentProgramName === program ? "#1976d24a" : "white"}}
                          key={program}>{program}</Item>
                ))

            }
        </Stack>
    </div>)
}