const users=[];
// functionality for joining user to the chat 
function userJoin(id,username,room){
     const user={id,username,room};
     users.push(user);
     return user;
}
// another function to get the currentuser
function getCurrentUser(id){
    return users.find(user=>user.id===id)
}
// function to remove the users
function userLeave(id){
    const index=users.findIndex(user=>user.id===id);
    if (index!==-1){
       return  users.splice(index,1)[0];
    }
}
// get room userrs 
function getRoomUsers(room){
    return users.filter(user=>user.room=== room);
}
module.exports={
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};