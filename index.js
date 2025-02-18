// Initializing an express js for application
const express=require('express');
const app=express();

const dotenv = require("dotenv");

// initializing jswt and cookie parser for session management

const jwt=require('jsonwebtoken');
const cookieParser=require('cookie-parser');
const bcrypt=require('bcrypt');

const path=require("path");
app.set("view engine", "ejs");  // ejs for frontend
app.use(express.static(path.join(__dirname, "public")));  // for public files like css folder , javascript folder as well as for images



//  json response and urlencoded will help in session management 
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({extended:true}));
require("dotenv").config();
const secret = process.env.SECRET_JWT;


// Create HTTP server and initialize Socket.io
const http=require('http');
const server = http.createServer(app);
const socketIo=require('socket.io');
const io = socketIo(server);
const { v4: uuidv4 } = require('uuid'); 

// In-memory meeting store (will replace with database later)
const meetings = {};

const userModel=require('./models/user');

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.redirect("/login");
  
    jwt.verify(token, secret, (err, user) => {
      if (err) return res.redirect("/login");
      req.user = user;
      next();
    });
  };

app.get("/",verifyToken,function(req,res){
    res.render("index");
});

app.get("/signup",function(req,res){
    res.clearCookie("token");
    res.render("signup");
});


app.get("/login",function(req,res){
    res.clearCookie("token");
    res.render("login")
});

app.get("/logout", (req, res) => {
    res.clearCookie("token"); // Clear the JWT stored in cookies
    res.redirect("/");
});

app.post("/signup/create",function(req,res){
    let{name,phone,email,password}=req.body;

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, async function(err, hash) {
            let createdUser=await userModel.create({
                name:name,
                phone:phone,
                email:email,
                password:hash
            });
            var token = jwt.sign({email : email },secret,{ expiresIn: "1h" });
            res.cookie("token",token, { httpOnly: true, secure: false });
            res.redirect("/");
        });
    });

    
    res.redirect("/");
});

app.post("/login/read",async function(req,res){
    let{email,password}=req.body;

    let user= await userModel.findOne({email:email});
    if(!user) return res.redirect("/signup");

    console.log("hello");
    await bcrypt.compare(password,user.password,function(err,result){
        
        if (result){
            res.clearCookie("token");
            var token = jwt.sign({email : email },secret,{ expiresIn: "1h" });
            res.cookie("token",token, { httpOnly: true, secure: false });
            return res.redirect("/");
        
        } 
            

        else return res.send("Incorrect password!!")
    });

    // return res.send("something went wrong!!");

});

app.post("/create-meeting", verifyToken, (req, res) => {
    const meetingId = uuidv4();  // Generate a unique ID for the meeting
    const admin = req.user.email;
  
    meetings[meetingId] = {
      admin,
      participants: [admin],  // Initially, the admin is the first participant
    };
  
    res.redirect(`/meeting/${meetingId}`);  // Redirect to the meeting space (admin page)
  });

// Join a meeting
app.post("/join-meeting", verifyToken, (req, res) => {
    const { meetingId } = req.body;
  
    if (!meetings[meetingId]) {
      return res.send("Meeting not found!");
    }
  
    // If meeting exists, join as a participant
    meetings[meetingId].participants.push(req.user.email);
    res.redirect(`/meeting/${meetingId}`);  // Redirect to the meeting space (view-only for participants)
  });

app.get("/meeting/:meetingId", verifyToken, (req, res) => {
    const { meetingId } = req.params;
    const meeting = meetings[meetingId];
  
    if (!meeting) {
      return res.send("Meeting not found!");
    }
  
    const isAdmin = meeting.admin === req.user.email;
    console.log(req.user.email);
    console.log(isAdmin);
    res.render("meeting", { meetingId:meetingId, isAdmin:isAdmin });
  });

// Server and Socket.io Setup
// Inside the 'connection' event of Socket.io
let meetingWhiteboards = {}; // Store whiteboard data per meeting

io.on('connection', (socket) => {
    socket.on('joinMeeting', (meetingId) => {
        socket.join(meetingId);

        // Send existing whiteboard content to the new participant
        if (meetingWhiteboards[meetingId]) {
            socket.emit('loadCanvas', meetingWhiteboards[meetingId]);
        } else {
            meetingWhiteboards[meetingId] = []; // Initialize if not exists
        }
    });

    socket.on('endMeeting', (meetingId) => {
        io.to(meetingId).emit('endMeeting');  
      });

    socket.on('draw', (data) => {
        // Store the drawn actions
        meetingWhiteboards[data.meetingId].push(data);

        // Broadcast to all participants
        socket.to(data.meetingId).emit('draw', data);
    });

    socket.on('clear', (meetingId) => {
        // Clear stored whiteboard data
        meetingWhiteboards[meetingId] = [];

        // Broadcast clear event to all participants
        io.to(meetingId).emit('clear');
    });

    socket.on('colorChange', (data) => {
        io.to(data.meetingId).emit('colorChange', data);
      });
    
      // Broadcast Line Width Change
      socket.on('lineWidthChange', (data) => {
        io.to(data.meetingId).emit('lineWidthChange', data);
      });
    
      // Broadcast Clear Canvas
      socket.on('clearCanvas', (meetingId) => {
        meetingWhiteboards[meetingId] = [];
        io.to(meetingId).emit('clearCanvas');
      });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});



server.listen(3000, () => {
    console.log("Server running on port 3000");
  });
  







