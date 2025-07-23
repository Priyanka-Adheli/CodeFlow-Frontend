import axios from "axios"

const axiosClient =  axios.create({
    baseURL: 'https://codeflow-backend-h8se.onrender.com',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});


export default axiosClient;

