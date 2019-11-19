import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://api-educoins-git-classroomcrud.educoins.now.sh/'
});

export default instance;