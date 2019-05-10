var passportLocalMongoose = require("passport-local-mongoose"),
   mongoose               = require("mongoose");

var UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);
