import axios from 'axios';
const API_URL = "http://localhost:3000/api";
export const getChallengeById = (id) => {
    const token = localStorage.getItem("token") ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImVtYWlsIjoiYWxpY2Uucm9iZXJ0QGxhcGxhdGVmb3JtZS5pbyIsInBzZXVkbyI6IkFsaWNlQXJ0Iiwicm9sZSI6InVzZXIiLCJjaXR5IjoiUGFyaXMiLCJwcm9tbyI6MjAyNCwiaWF0IjoxNzY1NDYzODI2LCJleHAiOjE3NjU1NTAyMjZ9.thvJIkmtCciv9RrbVzzLyi4PKEOD-kUU_KvSJCONeR4"
    console.log("URL llamada:", `${API_URL}/${id}`);
    return axios.get(`${API_URL}/challenges/${id}`, {
        headers: { Authorization: `Bearer ${token}` },

    });
};