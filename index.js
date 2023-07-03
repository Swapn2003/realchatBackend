const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const cors = require('cors');
const dotenv = require("dotenv")
const connectDB = require('./config/db')
const path = require('path');
const bodyParser = require('body-parser');



const userRoutes = require('./Routes/userRoutes')

dotenv.config();
connectDB();

const app = express();
console.log('CORS middleware applied');


app.use(cors()); // Enable CORS for all routes

app.use(express.json())




app.use('/api/user',userRoutes);


app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// app.get('/ping',(req,res)=>{
//   res.json({
//     messsage: "pong",
//   })
// })
// app.post('/chat',(req,res)=>{
//   const question = req.body.question;
//   console.log(question);
//   res.json({
//     answer:"pong",
//     question,
//   })
// })
// app.use('/api/chat',chatRoutes);

// const __dirname1 = path.resolve();
// const frontendPath = path.join(__dirname1, '../frontend/build');
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(frontendPath)));

//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(frontendPath, "index.html"))
//   );
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is running..");
//   });
// }

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT,console.log(`server started on port : ${PORT}`));

// const io = new Server(server, {
//   pingTimeout: 60000,

//     cors: {
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST"],
//       }
//     })

app.get("/", (req, res) => {
      res.send("Hello I am Server");
    });
const io = require("socket.io")(server, {
  // pingTimeout: 60000,
  cors: {
    origin: process.env.BASE_URL,
    // credentials: true,
  },
});

io.on('connection', socket => {
  console.log("socket io connected")
  const id = socket.handshake.query.id;
  socket.join(id);
  console.log(id)
  
  socket.on('send-message', ({ recipients, text,contactName,isGroupChat,type,locn}) => {
    console.log(recipients,text,type,locn);
    recipients.forEach(recipient => {
      const newRecipients = recipients.filter(r => r !== recipient);
      newRecipients.push(id);
      socket.broadcast.to(recipient).emit('receive-message', {
        recipients: newRecipients,
        sender: id,
        text,
        contactName,
        isGroupChat,
        type,
        locn:locn
      });
    });
  });
});
    
