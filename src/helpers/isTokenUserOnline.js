import {api} from 'helpers/api';

const isDefined = (value) => {
    return value !== undefined && value !== null;
};

async function callAPI(token, id) {
    const message = {
        headers: {
            "authorization": token
        }
    };

    await api.get(`/users/${id}/loginStatus`, message).then(res => {
        // check if user is online and matches the token
        if (res === "online") {
            return true;
        } else {
            return false;
        }
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
        try {
            return callAPI(token, id).valueOf();
        } catch (error) {
            // remove token and id from local storage if the token and id don't match a user in the database, or if the user is not logged in, or if the user is not found
            localStorage.removeItem("token");
            localStorage.removeItem("id");
            return false;
        }
    }
    // if no token or id is stored in the local storage, the user is not logged in
    return false;
}