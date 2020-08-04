const path=require("path");
const express=require("express");
const http=require("http");
const formatMessage=require("./utils/messages")
const {userJoin,getCurrentUser,userLeave,getRoomUsers}=require("./utils/users")
const PORT =process.env.PORT || 1234;
// requiring socket.io 
const socketio=require("socket.io");
const botname=" chat bot";

const app=express();
// creating server using http to handle requests and responses 
const server=http.createServer(app);
// initialize a variable named io and set it to socketio and pass the server 
const io=socketio(server);
// static files setup
app.use(express.static(path.join(__dirname,"public")))
// run only when the client is connected 
io.on("connection",socket=>{
    // whenever cleint is connected do this 

    // we will use the username and room grabed by the qs library 
    socket.on("joinroom",({username,room})=>{
          const user=userJoin(socket.id,username,room);
          socket.join(user.room);
          // welcome the current user 
socket.emit("message", formatMessage(botname,"welcome to the real time chat app"));

// broadcasting when the user is connected 
socket.broadcast.to(user.room).emit("message",formatMessage(botname,` ${user.username} has joined the chat `));
    // lets us send users and room info
    io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });

    });
    
  






// runs when the user  is disconnected 

// listen for the chat message 
socket.on("chatmessage",(msg)=>{
    // get the current user
    const user=getCurrentUser(socket.id);
  // we need to shosw this message on the client side 
  io.to(user.room).emit("message",formatMessage(user.username,msg));
});
socket.on("disconnect",()=>{
    const user=userLeave(socket.id);
    if (user){
        io.to(user.room).emit("message",formatMessage(botname,`${user.username} has left the chat`));
        
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
          });
    }
   
});
});



// after creating server we can replace the app.listen to server.listen
server.listen(PORT,()=>{
  console.log(`Server is running on Port ${PORT}`)
})
