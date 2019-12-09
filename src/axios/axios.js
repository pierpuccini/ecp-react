import axios from 'axios';

// Master url
const instance = axios.create({
    baseURL: 'https://educoins.herokuapp.com/'
});

// Local host
// const instance = axios.create({
//     baseURL: 'http://127.0.0.1:3333/'
// });


export default instance;