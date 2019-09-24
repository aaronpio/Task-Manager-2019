require('../src/db/mongoose')
const User = require('../src/models/user')


// User.findByIdAndUpdate('5d83c55dd7b729058016b49f', { age: 1}).then((user) => {
//     console.log(user)
//     return User.countDocuments({age:1})
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })


const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, {age: age})
    const count = await User.countDocuments({age: age})
    return count
}

updateAgeAndCount('5d83c55dd7b729058016b49f', 2).then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})
