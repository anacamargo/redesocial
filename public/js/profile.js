const database = firebase.database();
const USER_ID = window.location.search.match(/\?id=(.*)/)[1];

$(document).ready(function () {
 database.ref("users/" + USER_ID).once("value")
   .then(function (snapshot) {
     let userInfo = snapshot.val();
     $(".your-name").text("Nome: " + userInfo.name + " " + userInfo.surname);
     $(".your-email").text("Email: " + userInfo.email);
   })

 database.ref("users").once("value")
   .then(function (snapshot) {
     snapshot.forEach(function (childSnapshot) {
       var childKey = childSnapshot.key;
       var childData = childSnapshot.val();
       createFriendList(childData.name, childKey)
     });
   })

 $(".sign-out-btn").click(signOut);
 $(".timeline-btn").click(timeline);
 $(".save-btn").click(saveAtDB);
})

function signOut() {
 database.signOut;
 window.location = "index.html"
}

function timeline() {
 database.ref("/timeline/" + USER_ID + "/")
 window.location = "timeline.html?id=" + USER_ID;
}

function saveAtDB(event) {
 event.preventDefault();
 let petName = $(".pet-name").val();
 let petType = $(".pet-type").val()
 let petDescription = $(".pet-description").val()
 createPet(petName, petType, petDescription);
}

function createPet(petName, petType, petDescription) {
 database.ref("/profile/" + USER_ID).set({
   petName: petName,
   petType: petType,
   petDescription: petDescription
 });
};

function createFriendList(name, key) {
 if (key !== USER_ID) {
   $(".friends-list").append(`
   <li>
   <span>${name}</span>
   <button data-user-id="${key}">Adicionar</button>
   </li>
   `);
 }
 $(`button[data-user-id="${key}]`).click(function(){
   database.ref("friends/" + USER_ID).push({
     friendId: key
   })
 })
}