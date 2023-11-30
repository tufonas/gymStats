import Button from "@mui/material/Button";

import {getAuth, signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import {get, ref, set} from "firebase/database";
import db from "../firebaseConfigs";

export default function Login() {

    let provider = new GoogleAuthProvider();
    let navigate = useNavigate();

    const signInWithGoogleFromLoginPage = () => {


        provider.setCustomParameters({prompt: 'select_account', 'access_type': 'offline'});
        signInWithPopup(getAuth(), provider).then(result => {

            get(ref(db, "users/" + result.user.uid)).then( res => {
                console.log(res.val())
                if(!res.val()) {
                    set(ref(db, "users/" + result.user.uid), {programs: "", current_program: ""});
                }
            }).catch(error => {
                console.log("error", error);
            })

            // get(ref(db, "users/")).then(users => {
            //     console.log(result, users.val())
            //     // console.log(Array.from(users.val()))
            //     // console.log();
            //     let userExistsInDb = Object.keys(users.val()).includes(result.user.uid);
            //     if (!userExistsInDb) {
            //         set(ref(db, "users/" + result.user.uid), {programs: "", current_program: ""});
            //     }
            // })

            navigate('/home');

        }).catch((error) => {
            // Handle Errors here.
            let errorCode = error.code;
            let errorMessage = error.message;
            // The email of the user's account used.
            let email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            let credential = error.credential;
            console.log(error)
            // ...
        });


    }


    return (
        <div className="text-center mt-8">
            <button type="button" className="login-with-google-btn" onClick={signInWithGoogleFromLoginPage}>
                Sign in with Google
            </button>
        </div>
    )
}