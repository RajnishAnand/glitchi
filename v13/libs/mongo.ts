import mongoose from 'mongoose';
const {Schema} = mongoose;
const uri = `mongodb+srv://glitchi:${process.env.MONGO}@glitchicluster1.ms9pa.mongodb.net/db1?retryWrites=true&w=majority`;

mongoose.connect(uri)
  .then(()=>console.log('connected to mongodb!'));

const userSchema = new Schema({
  _id : {
    type: Number,
    required : true
  }, //discord id
  sl_id: Number, //sololearn id
});

export const User = mongoose.model('user',userSchema);
