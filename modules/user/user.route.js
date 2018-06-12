/** Schema for users */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

var UserSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "Please provide first name"]
    },
    lastName: {
        type: String,
        required: [true, "Please provide last name"]
    },

    email: {
        type: String,
        unique: true,
        required: [true, "Please provide email"]
    },
    password: {
        type: String,
        required: [true, "Please provide password"]
    },
    token: {
        type: String
    },
    gender: {
        type: String
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
    if (modelData.password && modelData.isModified('password')) {
        modelData.salt = crypto.randomBytes(16).toString('base64');
        modelData.password = modelData.hashPassword(modelData.password);
    }
    if (modelData.roles == 'CALLCENTERAGENT') {
        if (modelData && !modelData.empId) {
            counter.findByIdAndUpdate({ _id: 'entityId' }, { $inc: { seq: 1 } }, function (error, counterData) {
                if (error)
                    return next(error);
                modelData.empId = "EMP" + counterData.seq;
                next();
            });
        } else {
            next();
        }

    } else {
        next();
    }

});


/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function (password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64).toString('base64');
    } else {
        return password;
    }
};
/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function (password) {
    console.log(this.hashPassword(password))
    return this.password === this.hashPassword(password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('user', UserSchema);