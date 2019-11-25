import axios from 'axios';

// Master url
const instance = axios.create({
    baseURL: 'https://serverless-educoins.educoins.now.sh/'
});

export default instance;