const mongoose = require("mongoose");
const { stringify } = require("querystring");

const pyqSchema = new mongoose.Schema(
  {
    filename: { 
      type: String, 
      required: true 
    },
    fileUrl: { 
      type: String, 
      required: true 
    },
    unit : { 
      type: String, 
      required: true 
    },
    subject: { 
      type: String, 
      required: true 
    },
    subjectCode:{
      type: String, 
      required: false
    },
    semester: { 
      type: String, 
      required: true 
    },
    keyword: { 
      type: String, 
      required: true 
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
        required: true,
      },
    ],
    exam:{
      enum :[mst1,mst2.endsem]
    },
    year:{
      type:string,
      required:true
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Pyq", pyqSchema)