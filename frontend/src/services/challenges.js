import axios from 'axios';
const API_URL = "http://localhost:3000/api";
export const getChallengeById = (id) => {
    const token = localStorage.getItem("token") ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoibHVjYXMubWFydGluQGxhcGxhdGVmb3JtZS5pbyIsInBzZXVkbyI6Ikx1Y2FzR2FtZXIiLCJyb2xlIjoidXNlciIsImNpdHkiOiJMeW9uIiwicHJvbW8iOjIwMjMsImlhdCI6MTc2NTM3MzcxNiwiZXhwIjoxNzY1NDYwMTE2fQ.baCE5F-haVuIVwwA_Wwmsv985etLwDXntM68kAhxJMc"
    console.log("TOKEN:", token);
    console.log("URL llamada:", `${API_URL}/${id}`);
    return axios.get(`${API_URL}/challenges/${id}`, {
        headers: { Authorization: `Bearer ${token}` },

    });
};