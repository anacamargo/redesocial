const database = firebase.database();

let USER_ID = sessionStorage["USER_ID"];
if (!USER_ID) window.location.href = "sign-in.html";

$(document).ready(async function () {

  const db = new Repository(database);
  const user = await db.getUserById(USER_ID);
  const users = await db.getUsers();
  const friends = await db.getFriendsByUserId(USER_ID);

  const bdayParts = user.birthday.split('-');

  $(".your-name").text("Nome: " + user.ownerName);
  $(".your-email").text("Email: " + user.email);
  $(".pet-image").html(user.picture);
  $(".pet-name").text("Nome: " + user.petName);
  $(".pet-bday").text(`Aniversário: ${bdayParts[2]}/${bdayParts[1]}/${bdayParts[0]}`);
  $(".pet-species").text("Espécie: " + user.species);

  for (friendToBe of users) {
    createFriendList(friendToBe, friends);
  }

});

function createFriendList(user, friends) {
  const friendIds = friends.map(x=>x.friendID);
  if (user.id !== USER_ID) {
    $(".friends-list").append(`
    <li>
      <span>${user.petName}</span>
      <button class="${!friendIds.includes(user.id) ? 'd-inline-block' : 'd-none'}" data-add-friend="${user.id}">Adicionar</button>
    </li>
    `);
  }
}

$('.friends-list').on('click', 'button[data-add-friend]', async function () {
  const id = $(this).data('add-friend');
  const db = new Repository(database);
  const friends = await db.getFriendsByUserId(USER_ID);
  const friendIds = friends.map(x => x.friendID);
  if (!friendIds.includes(id)) db.insertFriend(USER_ID, id);
});

$('#logout').on('click', logout);

function logout(event) {
  event.preventDefault();

  firebase
      .auth()
      .signOut()
      .then(function () {
          sessionStorage.clear();
          window.location = '../sign-in.html';
      }, function (error) {
          console.error(error);
      });
}