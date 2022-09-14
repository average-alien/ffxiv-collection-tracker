const axios = require('axios').default
const url = 'https://ffxivcollect.com/api/'
const db = require('./models')

function apiCall() {
    axios.get(`${url}mounts?limit=10`)
        .then(response => {
            console.log(response.data.results[0])
        })
        .catch(error => {
            console.log(error.response)
        })
}

// apiCall()

async function dbTest() {
    const user = await db.user.findOne({
        where: { email: 'a@t.com' },
    })

    await user.createMinion({
        apiId: 12,
        name: 'dunno',
        userId: user.id,
        obtained: false
    })
    console.log(user)
}

// dbTest()

async function findUser() {
    const user = await db.user.findByPk(2)
    // console.log(user)
    const mount = await db.mount.findAll()
    const has = await user.hasMount(mount)
    console.log(has)
}

findUser()