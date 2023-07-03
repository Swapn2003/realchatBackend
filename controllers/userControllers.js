// const asyncHandler = require("express-async-handler")
// const User = require("../models/userModel")
// const registerUser =asyncHandler(async (req,res)=>{
//     const {name, email,username, password} = req.body;

//     if(!name || !username || !email || !password){
//         res.status(400);
//         throw new Error("Please enter all the fields");
//     }

//     const userExists = await User.findOne({email});
//     const usernameAvailable = await User.findOne({username});
//     if(userExists){
//         res.status(400);
//         throw new Error("User already Exists");
//     }else if(usernameAvailable){
//         res.status(400);
//         throw new Error("Username already in use");
//     }

//     const user = await User.create({
//         name,
//         username,
//         email,
//         password,
//     });

//     if(user){
//         res.status(201).json({
//             _id: user._id,
//             name: user.name,
//             email: user.email,
//             username:user.username
//         })
//     }else{
//         res.status(400);
//         throw new Error("Failed to create user");
//     }
// })

// const authUser = asyncHandler(async (req,res)=>{
//     const {username, password} =req.body;
//     const user = await User.findOne({username}) ;
//     if(user && (await user.matchPassword(password))){
//         res.status(201).json({
//             _id: user._id,
//             name: user.name,
//             email:user.email,
//             username:user.username
//         })
//     }else{
//         res.status(401);
//         throw new Error("Invalid Email or Password");
//     }
// })
// //rather than post request use queries instead
// // /api/user?search=swapn
// const allUsers = asyncHandler( async(req,res)=>{
//     //to get search variable from query
//     const keyword = req.query.search?{
//         $or:[{ name: { $regex: req.query.search, $options: "i" } },
//         { email: { $regex: req.query.search, $options: "i" } },]
//     }:{}
//     const users = await User.find(keyword)
//     res.send(users);
//     // console.log(users);
    
// })

// const addContact = asyncHandler(async(req,res)=>{
//     const {myId,contactName, recipients} =req.body;
//     if(!contactName || !recipients){
//         res.status(400);
//         throw new Error("Please enter all the fields");
//     }

//     const contactExists = await User.findOne({myId});
//     // const usernameAvailable = await User.findOne({username});
//     if(contactExists){
//         res.status(400);
//         throw new Error("Contact already Exists change name and proceed");
//     }


// })
// module.exports ={registerUser,authUser,allUsers};




const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const registerUser =asyncHandler(async (req,res)=>{
    const {name, email,username, password} = req.body;

    if(!name || !username || !email || !password){
        res.status(400);
        throw new Error("Please enter all the fields");
    }

    const userExists = await User.findOne({email});
    const usernameAvailable = await User.findOne({username});
    if(userExists){
        res.status(400);
        throw new Error("User already Exists");
    }else if(usernameAvailable){
        res.status(400);
        throw new Error("Username already in use");
    }

    const user = await User.create({
        name,
        username,
        email,
        password,
        userContacts:[]
    });

    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username:user.username
        })
    }else{
        res.status(400);
        throw new Error("Failed to create user");
    }
})

const authUser = asyncHandler(async (req,res)=>{
    const {username, password} =req.body;
    const user = await User.findOne({username}) ;
    if(user && (await user.matchPassword(password))){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email:user.email,
            username:user.username
        })
    }else{
        res.status(401);
        throw new Error("Invalid Email or Password");
    }
})
//rather than post request use queries instead
// /api/user?search=swapn
const allUsers = asyncHandler( async(req,res)=>{
    //to get search variable from query
    const keyword = req.query.search?{
        $or:[{ name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },]
    }:{}
    const users = await User.find(keyword)
    res.send(users);
    // console.log(users);
    
})



const addContact = asyncHandler(async (req, res) => {
    const { myId, contactName, recipients ,isGroupChat} = req.body;
    if (!contactName || !recipients) {
      res.status(400);
      console.log("see here::",contactName,recipients,isGroupChat);
      throw new Error("Please enter all the fields",contactName,recipients,isGroupChat);
    }
  
    const user = await User.findOne({ username: myId });
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    } 
    const newContact = {
      contactName: contactName,
      recipients: recipients,
      messages: [],
      isGroupChat:isGroupChat
    };
      
    user.userContacts.push(newContact);
    const updatedUser = await user.save();
    if(!isGroupChat){
      res.status(200).json(updatedUser);
    }else{
      recipients.forEach(async(member)=>{
        if(member!==myId){
          
          const mem = await User.findOne({ username: member });
          mem.userContacts.push(newContact);
          const updatedUsermem = await mem.save();
          res.status(200).json(updatedUsermem);
        }
      })
    }
  });

  const accessContacts =asyncHandler(async (req,res)=>{
    const keyword = req.query.myId?{
        username: { $regex: req.query.myId} 
    }:{}
    const user = await User.findOne(keyword)
    res.send(user.userContacts);
    // console.log("aayi");
    // console.log(user.userContacts);
  })
  
  
  const accessRecipients = asyncHandler(async (req, res) => {
      const { contactName, myId } = req.query;
      
      const keyword = contactName && myId ? {
          username: { $regex: req.query.myId}
          
          
        } : {};
        
        const user = await User.find(keyword);
        // res.send(user[0].userContacts);
        const contact = await user[0].userContacts.find((c) => c.contactName === contactName);
        res.send(contact.recipients);
        // console.log(contact);
    });
    
    const addMessage = asyncHandler(async (req,res)=>{
      // console.log(228,req.body.myId,req.file);
      const {myId,contactName,message,locn} =req.body;
      // console.log("message::",message);
      if (!contactName) {
        res.status(400);
        throw new Error("Please enter Contact name");
      }
    
      const user = await User.findOne({ username: myId });
      if (!user) {
          res.status(404);
          throw new Error("User not found");
        }
        const contact = await user.userContacts.find((c)=>c.contactName===contactName);
        if (!contact) {
            res.status(404);
            throw new Error("Enter Valid contact name");
        }
        // if(message.type==='file'){
        //   message.body=req.file.path;
        // }
        // console.log(249,message);
      contact.messages.push(message);
      const updatedUser = await user.save();
    
      res.status(200);
    })
    
    const addFile=asyncHandler(async(req,res)=>{
      // console.log(257,req.file,req.body);

      console.log(259,req.file);
      const {myId,contactName,message_sender,message_content} =req.body;
      // console.log("message::",message);
      if (!contactName) {
        res.status(400);
        throw new Error("Please enter Contact name");
      }
    
      const user = await User.findOne({ username: myId });
      if (!user) {
          res.status(404);
          throw new Error("User not found");
        }
        const contact = await user.userContacts.find((c)=>c.contactName===contactName);
        if (!contact) {
            res.status(404);
            throw new Error("Enter Valid contact name");
        }
          const message = {
            'sender':message_sender,
            'content':message_content,
            'type':'file',
            'body':req.file.path,
          }
        

      contact.messages.push(message);
      const updatedUser = await user.save();
      res.status(200);

      
    })
    const accessMessage = asyncHandler(async (req, res) => {
        const { contactName, myId } = req.query;
        
        const keyword = contactName && myId ? {
            username: { $regex: req.query.myId}
          } : {};
          
          const user = await User.find(keyword);
        //   res.send(user[0].userContacts);
          const contact = await user[0].userContacts.find((c) => c.contactName === contactName);
          res.send(contact.messages);
          // console.log(contact);
      });
    const getName = asyncHandler(async (req, res) => {
        const { senderId ,myId} = req.query;
        
        const keyword = senderId && myId? {
            username: { $regex: req.query.myId}
          } : {};
          
          const user = await User.find(keyword);
          console.log(user[0].userContacts);
          const contact = await user[0].userContacts.find((c) => c.recipients[0]===senderId && !c.isGroupChat );
          // console.log(contact.contactName);
          res.send(contact.contactName);
      });

      const addMember =asyncHandler(async(req,res)=>{
        const { myId, contactName, recipient} = req.body;

        if (!contactName || !recipient) {
          res.status(400);
          throw new Error("Please enter all the fields");
        }
        
        const user = await User.findOne({ username: myId });
        if (!user) {
          res.status(404);
          throw new Error("User not found");
        }

        const contact = await user.userContacts.find((c)=>c.contactName===contactName);
        if (!contact) {
            res.status(404);
            throw new Error("Enter Valid contact name");
        }

        contact.recipients.push(recipient);
        const updatedUser = await user.save();
        
        
        contact.recipients.forEach(async(member)=>{
          if(member!==myId && member!=recipient){
            
            const mem = await User.findOne({ username: member });
            const memContact = await mem.userContacts.find((c)=>c.contactName===contactName);
            memContact.recipients.push(recipient);
            const updatedUsermem = await mem.save();
          }
        })
        
        // console.log(contact.recipients);
        const newMem = await User.findOne({username:recipient});

        newMem.userContacts.push({
          contactName:contactName,
          recipients:contact.recipients,
          messages:[],
          isGroupChat:contact.isGroupChat
        })
        const updatedNewMem = await newMem.save();
        res.status(200).json(updatedNewMem);
      })

    module.exports = { registerUser, authUser, allUsers, addContact,accessContacts,accessRecipients,addMessage,accessMessage,getName,addMember,addFile};
  