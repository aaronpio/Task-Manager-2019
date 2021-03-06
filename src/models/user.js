const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid dummy')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error('Password can\'t contain \"password\", dog')
            }
        }

    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be positive')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

//---------- for relationship between user and task file -----------

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner' 
})

//----------------- schema method to not return private user data -----------------
userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

//----------------- schema method to create authentication tokens -----------------

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, 'thisismynewcourse')
    
    user.tokens = user.tokens.concat({token: token})
    await user.save() 

    return token
}


//---------- schema Method to find email and verify password is correct ----------
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email: email})

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('unable to login')
    }

    return user

}


//-----------  middleware to save to mongoDB (hash the pw) ----------
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()  //needed to end function
})

//----------- middleware to delete tasks when user removed -----------

userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    
    next()
})

//----------------------------------------------------------

const User = mongoose.model('User', userSchema)

module.exports = User