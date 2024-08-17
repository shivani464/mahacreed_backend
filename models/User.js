const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

    role: {
        type: String,
        enum: ['Super Admin', 'Company', 'Dealer', 'Retailer'],
        default: null
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,

    },
    password: {
        type: String,
        required: true,

    },
  
// validate our license number and cinNumber based on role
    licenseNumber: {
        type: String,
        validate: {
            validator: function(v) {
                if (this.role === 'Dealer' || this.role === 'Retailer') {
                    return v != null && v.trim().length > 0; // License Number is required
                }
                return true; // No validation if role is not Dealer or Retailer
            },
            message: props => `${props.path} is required when role is Dealer or Retailer`
        }
    },
    cinNumber: {
        type: String,
        validate: {
            validator: function(v) {
                if (this.role === 'Company') {
                    return v != null && v.trim().length > 0; // CIN Number is required
                }
                return true; // No validation if role is not Company
            },
            message: props => `${props.path} is required when role is Company`
        }
    },



    natureOfBusiness: {
        type: String,
        enum: ['Manufacture', 'Services', 'Others'],
        required: true,
    },
    profileCompleted: {
        type: Boolean,
        default: false,
    },
    isVerfied: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    deactivatedBy: {
        type: mongoose.Schema.ObjectId, ref: 'User'
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }

});
module.exports = mongoose.model("User", UserSchema);