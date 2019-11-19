import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://api-educoins-git-master.educoins.now.sh/'
});

export default instance;