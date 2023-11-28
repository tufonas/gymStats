import {onValue, ref, set} from "firebase/database";
import db from "./firebaseConfigs";
import {of} from "rxjs";

export async function getPrograms() {
    return new Promise(resolve => {
        onValue(ref(db, "programs"), (res) => {
            resolve({ programs: res.val() ? res.val() : [] })
        });
    })
}