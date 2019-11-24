import axios from 'axios';

// Master url
// const instance = axios.create({
//     baseURL: 'https://api-educoins-git-master.educoins.now.sh/'
// });

//TODO: classroom api, remove once in master
const instance = axios.create({
    baseURL: 'https://api-educoins-git-classroomcrud.educoins.now.sh/'
});

export default instance;