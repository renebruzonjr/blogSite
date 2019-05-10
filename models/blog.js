var mongoose = require("mongoose");

var BlogSchema = new mongoose.Schema({
  title: String,
  image: String,
  author: {
    id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
  },
  post: String,
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Blog", BlogSchema);