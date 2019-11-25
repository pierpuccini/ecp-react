import axios from 'axios';

// Master url
const instance = axios.create({
    baseURL: 'https://serverless-educoins.educoins.now.sh/'
});
// const instance = axios.create({
//     baseURL: 'https://educoins.herokuapp.com/'
// });

export default instance;