var database = firebase.database();

$(document).ready(function () {
    $(".sign-up-button").click(signUpClick);
    $(".sign-in-button").click(signInClick);
});

function signUpClick(event) {
    event.preventDefault();

    let namePet = $(".sign-up-name").val();
    let nameOwner = $(".sign-up-nameOwner").val();
    let email = $(".sign-up-email").val();
    let password = $(".sign-up-password").val();

    createUser(namePet, nameOwner, email, password);
}

function signInClick(event) {
    event.preventDefault();

    var email = $(".sign-in-email").val();
    var password = $(".sign-in-password").val();

    loginUserAuth(email, password);
}

function createUser(namePet, nameOwner, email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function (response) {
            if (response.operationType === "signIn") {
                var userId = response.user.uid;

                createUserInDB(userId, namePet, nameOwner, email);
                signInRedirect(userId);
            }
        })
        .catch(function (error) { handleError(error); });
}

function loginUserAuth(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function (response) {
            if (response.operationType === "signIn") {
                var userId = response.user.uid;
                sessionStorage["USER_ID"] = userId;
                signInRedirect(userId);
            }
        })
        .catch(function (error) { handleError(error); });
}

function createUserInDB(id, namePet, nameOwner, email) {
    database.ref('users/' + id).set({
        namePet: namePet,
        nameOwner: nameOwner,
        email: email
    });
}

function signInRedirect(userId) {
    window.location = '../timeline.html?userId=' + userId;
}

function handleError(error) {
    alert(error.message);
    console.log(error.code, error.message);
}
