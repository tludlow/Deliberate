import axios from 'axios'
import router from 'next/router'

//The URL for the API which is the standard part, all endpoints are additions to this API
//const LOCAL_TESTING = "http://localhost:6789"
const API_BASE_URL = 'http://localhost:5000'

//Request/response default settings
let config = {
    baseURL: API_BASE_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
    // withCredentials: true,
}

//Create a new instance of the axios library using these settings configured.
let instance = axios.create(config)

//Intercept not auth middleware and send the user to the auth page
// Add a 401 response interceptor
instance.interceptors.response.use(
    (response) => {
        return response
    },
    function (error) {
        //Unauthorized
        if (error.response.status == 401) {
            console.log("Invalid auth token")
            router.push("/account/sign-in")
        } else {
            return Promise.reject(error)
        }
    }
)
export default instance
