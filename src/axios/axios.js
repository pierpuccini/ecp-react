import axios from 'axios';

// Master url
const instance = axios.create({
    baseURL: 'https://api-educoins.now.sh/'
});
//Development
// const instance = axios.create({
//     baseURL: 'https://api-educoins-e140l1bdv.now.sh/'
// });
// Local host
// const instance = axios.create({
//     baseURL: 'http://127.0.0.1:3333/'
// });


export default instance;