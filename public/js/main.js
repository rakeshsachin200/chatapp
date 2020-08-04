//accessing the html form which is inside the chat.html file 
const chatForm=document.getElementById("chat-form");
// adding the scrolling functionality ,select the div first
const chatMessages=document.querySelector(".chat-messages");
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
// get username and room from the url by  using qs library 
const {username,room}=Qs.parse(location.search,{
  // to avoid any prefix we will use this 
  ignoreQueryPrefix: true
});
console.log(username,room);
//============================================
// this is retrieving the message from the server 
//============================================
// we have got  the access of the variable named io just by enabling the script tag in the chat.html
const socket=io();
// catching the message from the server side to clientr side 
// join chat room 
socket.emit("joinroom",{username,room});
// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
  });
  // get message from the server
socket.on("message",message=>{
   console.log(message);
   //passing the message through output message 
   outputMessage(message);
   // adding scrolling facility so that we get to the message which have been recently published 
   chatMessages.scrollTop=chatMessages.scrollHeight;
   
});
// now handling the message submission
// adding the event listener function to acheive this 
chatForm.addEventListener("submit", (e) =>{
    // we do this to  prevent the  form from submitting to a file which it does by deafault 
    e.preventDefault();

    // grabbing the message from the form  
    const msg =e.target.elements.msg.value;
    // but we need to add this message to the server 
    socket.emit("chatmessage",msg);
    // here i will clear the input messages section once the message has been added 
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
});
// output message to Dom 
function outputMessage(message){
     const div =document.createElement("div");
     div.classList.add("message");
     div.innerHTML=`<p class="meta">   ${message.username} <span>  ${message.time}</span></p>
     <p class="text">
       ${message.text}
     </p>`;
     // now we will send this message to the parent div in the chat html
     document.querySelector(".chat-messages").appendChild(div);
}


// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
  }
  
  // Add users to DOM
  function outputUsers(users) {
    userList.innerHTML = `
      ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
  }