/** Schema for users */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

var UserSchema = new Schema({
    firstName: {
        type: String,
        trim:true,
        required: [true, "Please provide first name"]
    },
    lastName: {
        type: String,
        trim:true,
        required: [true, "Please provide last name"]
    },
    email: {
        type: String,
        trim:true,
        required: [true, "Please provide email"]
    },
    password: {
        type: String,
        trim:true,
        required: [true, "Please provide password"]
    },
    token: {
        type: String,
        trim:true
    },
    gender: {
        type: String,
        trim:true
    },
    profileImage: {
        type: String
    },
    dob: {
        type: Date
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE', 'DELETED'],
        default: 'INACTIVE',
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    modifiedDate: {
        type: Date
    },
    salt: {
        type: String
    }
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function (next) {
    var modelData = this;
    if (!modelData.salt && modelData.password && modelData.isModified('password')) {
        modelData.salt = crypto.randomBytes(16).toString('base64');
        modelData.password = modelData.hashPassword(modelData.password);
        next();
    }else{
        next();
    }
});


/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function (password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64,'sha512').toString('base64');
    } else {
        return password;
    }
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function (password) {
    return this.password === this.hashPassword(password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('user', UserSchema);