import {api} from 'helpers/api';

const isDefined = (value) => {
    return value !== undefined && value !== null;
};

async function callAPI(id) {

    await api.get(`/users/${id}/loginStatus`).then(res => {
        // check if user is online and matches the token
        return res.data === "online"
    }).catch(error => {
        console.error("Details:", error);
        return false;
    });

    return false;
}

// check if the token and the id match a user in the data base that is currently logged in
export function isTokenUserOnline() {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");


    if (isDefined(token) && isDefined(id)) {
        // call api to check if the token and id match a user in the database and check if that user is logged in
        return callAPI(id).valueOf();
    } else {
        // if no token or id is stored in the local storage, the user is not logged in
        return false;
    }
}