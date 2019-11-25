import axios from 'axios';

// Master url
const instance = axios.create({
    baseURL: 'https://api-educoins-git-master.educoins.now.sh/'
});
//TODO: Revise with DAD to make sure which url we're going to use
// const instance = axios.create({
//     baseURL: 'https://serverless-educoins.educoins.now.sh/'
// });

export default instance;