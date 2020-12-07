import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
})

userSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null)
}

userSchema.methods.validPassword = function (password) {
    console.log(" ~ password-------", this)
    return bcrypt.compareSync(password, this.password)
}
module.exports = mongoose.model('User', userSchema);