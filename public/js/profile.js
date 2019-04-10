const database = firebase.database();

let USER_ID = sessionStorage["USER_ID"];
if (!USER_ID) window.location.href = "sign-in.html";

$(document).ready(function () {
  database.ref("users/" + USER_ID).once("value")
    .then(function (snapshot) {
      let userInfo = snapshot.val();
      $(".your-name").text("Nome: " + userInfo.ownerName);
      $(".your-email").text("Email: " + userInfo.email);
      $(".pet-image").html(userInfo.picture);
      $(".pet-name").text("Nome: " + userInfo.petName);
      $(".pet-bday").text("Aniversário: " + userInfo.birthday);
      $(".pet-species").text("Espécie: " + userInfo.species);
    })

  database.ref("users").once("value")
    .then(function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        let childKey = childSnapshot.key;
        let childData = childSnapshot.val();
        createFriendList(childData.petName, childKey)
      });
    })

  $(".sign-out-btn").click(signOut);
  $(".timeline-btn").click(timeline);
})

function signOut() {
  database.signOut;
  window.location = "sign-in.html"
}

function timeline() {
  window.location = "home.html"
}

function createFriendList(name, key) {
  if (key !== USER_ID) {
    $(".friends-list").append(`
    <li>
    <span>${name}</span>
    <button data-user-id="${key}">Adicionar</button>
    </li>
    `);
  }
  $(`button[data-user-id="${key}"]`).click(function() {
    database.ref("users/" + USER_ID + "/friends").push({
      friendId: key
    })
  })
}