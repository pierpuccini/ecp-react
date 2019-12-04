import axios from 'axios';

// Master url
const instance = axios.create({
    baseURL: 'https://api-educoins.educoins.now.sh/'
});
//Development
// const instance = axios.create({
//     baseURL: 'https://api-educoins-6zcuwfgv4.now.sh/'
// });
//Local host
// const instance = axios.create({
//     baseURL: 'http://127.0.0.1:3333/'
// });


export default instance;