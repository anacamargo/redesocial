var database = firebase.database();

$(document).ready(function() {
  $('.sign-up-button').on('click', signUpClick);
  $('.sign-in-button').on('click', signInClick);
  $('#logout').on('click', signOut);
});

function signUpClick(event) {
  event.preventDefault();

  let petName = $('.sign-up-petName').val();
  let birthday = $('.sign-up-birthday').val();
  let species = $('.sign-up-select option:selected').val();
  let ownerName = $('.sign-up-ownerName').val();
  let email = $('.sign-up-email').val();
  let password = $('.sign-up-password').val();

  createUser(petName, birthday, species, ownerName, email, password);
}

function signInClick(event) {
  event.preventDefault();

  const email = $('.sign-in-email').val();
  const password = $('.sign-in-password').val();
  loginUserAuth(email, password);
}

function createUser(petName, birthday, species, ownerName, email, password) {
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function(response) {
      if (response.operationType === 'signIn') {
        const userId = response.user.uid;

        createUserInDB(userId, petName, birthday, species, ownerName, email);
        sessionStorage['USER_ID'] = userId;
        signInRedirect(userId);
      }
    })
    .catch(function(error) { handleError(error); });
}

function loginUserAuth(email, password) {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(response) {
      if (response.operationType === 'signIn') {
        const userId = response.user.uid;
        sessionStorage['USER_ID'] = userId;
        signInRedirect(userId);
      }
    })
    .catch(function(error) { handleError(error); });
}

function createUserInDB(id, petName, birthday, species, ownerName, email) {
  database.ref('users/' + id).set({
    petName: petName,
    birthday: birthday,
    species: species,
    ownerName: ownerName,
    email: email,
    picture: `images/${species}.png`
  });
}

function signInRedirect() {
  window.location = '../index.html';
}

function handleError(error) {
  alert(error.message);
  console.log(error.code, error.message);
}

function signOut(event) {
  event.preventDefault();

  firebase
    .auth()
    .signOut()
    .then(function() {
      sessionStorage.clear();
      window.location = '../sign-in.html';
    }, function(error) {
      console.error(error);
    });
}

