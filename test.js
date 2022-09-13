const axios = require('axios').default
const url = 'https://ffxivcollect.com/api/'

function apiCall() {
    axios.get(`${url}mounts?limit=10`)
        .then(response => {
            console.log(response.data.results[0])
        })
        .catch(error => {
            console.log(error.response)
        })
}

apiCall()