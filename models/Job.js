const mongoose = require('mongoose')

const JobSchema = new mongoose.Schema({
    company: { type: String, required: true },
    position: { type: String, required: true },
    status: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  });

// const JobSchema = new mongoose.Schema({
//     company:{
//         type:String,
//         required:[true, 'Please provide company name'],
//         maxlength:50
//     },
//     position:{
//         type:String,
//         required:[true, 'Please provide position'],
//         maxlength:100
//     },
//     status:{
//         type:String,
//         enum:['interview','declined','pending'],
//         default: 'pending',
//     },
//     createdBy:{
//         type:mongoose.Types.ObjectId,
//         ref:'User',
//         required:[true,'Please provide user']
//     }
// },
// { timestamps: true }
// )

module.exports = mongoose.model('Job', JobSchema)