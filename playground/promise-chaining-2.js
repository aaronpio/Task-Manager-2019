require('../src/db/mongoose')
const Task = require('../src/models/task')

// Task.findByIdAndDelete('5d82d0109281bf4eb8acb53e').then((task) => {
//     console.log(task)
//     return Task.countDocuments({completed: false})
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

const deleteTaskAndCount = async (id) => {
    const del = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed: false})
    return count
}

deleteTaskAndCount('5d83e739a6482e39740103fb')
.then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})