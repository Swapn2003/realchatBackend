// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const userSchema = mongoose.Schema(
//   {
//     name: { type: "String", required: true },
//     username: {type: "String" ,unique: true ,required: true},
//     email: { type: "String", unique: true, required: true },
//     password: { type: "String", required: true },
//     // pic: {
//     //   type: "String",
//     //   required: true,
//     //   default:
//     //     "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
//     // },
//     isAdmin: {
//       type: Boolean,
//       // required: true,
//       default: false,
//     },
//   },
//   { timestaps: true }
// );

// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// userSchema.pre("save", async function (next) {
//   if (!this.isModified) {
//     next();
//   }

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// const User = mongoose.model("User", userSchema);

// module.exports = User;



// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const userSchema = mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     username: { type: String, unique: true, required: true },
//     email: { type: String, unique: true, required: true },
//     password: { type: String, required: true },
//     isAdmin: {
//       type: Boolean,
//       default: false,
//     },
//     userContacts: [
//       {
//         contactName: {
//           type: String,
//           default: "NewGroup",
//           index: {
//             unique: true,
//             partialFilterExpression: {
//               "userContacts.contactName": { $ne: null }
//             }
//           }
//         },
//         // recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//         recipients: [{ type: String }],//type is wrong change it to above
//         messages: [
//           {
//             // sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//             sender: { type: String },
//             content: { type: String },
//           },
//         ],
//         isGroupChat :{type: Boolean,
//           default: false,}
//       },
//     ],
//   },
//   { timestamps: true }
// );

// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     next();
//   }

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// const User = mongoose.model("User", userSchema);

// module.exports = User;




const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    userContacts: {
      type: [
        {
          contactName: {
            type: String,
            default: "NewGroup",
            // unique: true,
          // sparse: true,
          },
          recipients: [{ type: String }],
          messages: [
            {
              sender: { type: String },
              content: { type: String },
              type:{ type: String },
              locn:{ type: String,
                default: "", },
            },
          ],
          isGroupChat: {
            type: Boolean,
            default: false,
          },
        },
      ],
      default: [],
      
    },
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;



// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const userSchema = mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     username: { type: String, unique: true, required: true },
//     email: { type: String, unique: true, required: true },
//     password: { type: String, required: true },
//     isAdmin: {
//       type: Boolean,
//       default: false,
//     },
//     userContacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserContact" }],
//   },
//   { timestamps: true }
// );

// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     next();
//   }

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// const User = mongoose.model("User", userSchema);

// module.exports = User;
