import {api} from "./api";
import {useEffect} from "react";
import {useHistory} from "react-router-dom";

const Demo = () => {
    const history = useHistory()
    useEffect(() => {
        const addDemoUsers = async () => {
            console.log("Creating users")
            try {
                await api.post('/users/demo')
            }
            catch (error) {
                window.alert("Error: " + error.response.data.message);
            }
        }
        addDemoUsers()
        history.push("/login")
    }, [])
    return null
}
export default Demo