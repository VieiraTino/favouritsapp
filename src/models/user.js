const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Favourite = require('./favourite');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minLength: 7,
            trim: true
            // validate(value) {
            //     if(value === 'pass' || value.includes('pass')) {
            //         throw new Error('A password não é valida')
            //     }
            // }
        },
        email: {
            type: String,
            required: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Introduza um email válido');
                };
            },
            lowercase: true
        },
        tokens: [{
            token: {
                type: String,
                required: true
            }
        }]
    }, 
    {
        timestamps: true
    }
);

userSchema.virtual('favourites', {
    ref: 'Favourite',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.generateToken = async function() {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, 'myFavouriteApp');
    user.tokens = user.tokens.concat({token});
    await user.save();
    
    return token;
};

userSchema.statics.findByCredentials = async (username, password) => {
    const user = await User.findOne({ username });
    if(!user){
        throw new Error('O utilizador não existe');
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if(!isMatch){
        throw new Error('A password não está correta');
    }

    return user;
}

userSchema.pre('save', async function(next) {
    const user = this;

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

userSchema.pre('remove', async function(next){
    const user = this;

    await Favourite.deleteMany({owner: user._id});

    next();
})


const User = mongoose.model('User', userSchema);

module.exports = User;