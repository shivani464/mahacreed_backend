const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({

    companyName : {
        type: String,
        required: true
    },
    gstin : {
        type:String,
        required: true,
        unique: true
    },
    licenseNumber:{
        type:String,
        required: true,
        unique:true
    },
    cinNumber: {
        type: String,
        required: true,
        unique: true
    },
    panCardNumber : {
        type:String,
        required: true,
        unique: true
    },
    aadharCardNumber:{
        type:String,
        unique: true,
        default: null,
    },
    contactPersonEmail:{
        type: String,
        required: true,
        unique: true 
    },
    state: {
        type: String,
        required: true
    },
    district:{
        type:String,
        required:true
    },
    taluka:{
        type:String,
        required: true
    },
    village:{
        type : String,
        default: null
    },companyAddress: {
        type: String,
        required: true
    },
    pinCode: {
        type: String,
        required: true
    },
    invAlphabetSeries: {
        type: String,
        required: true
    },
    openingBalance: {
        type: Number,
        required: true,
        default: 0
    },
   
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    isActive: { 
        type: Boolean,
        default: true
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


module.exports = mongoose.model('Company', CompanySchema);