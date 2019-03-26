const email = $('#email');
const password = $('#password');
const createUser = $('#createUser');
const login = $('#login');
const logout = $('#logout');
const authFacebook = $('#authFacebook');


createUser.on('click', function () {
    firebase
        .auth()
        .createUserWithEmailAndPassword($(email).val(), $(password).val())
        .then(function () {
            alert('Bem vindo ' + $(email).val());
        })
        .catch(function (error) {
            console.error(error.code);
            console.error(error.message);
            alert('Falha ao cadastrar, verifique o erro no console.')
        });
});

login.on('click', function () {
    firebase
        .auth()
        .signInWithEmailAndPassword($(email).val(), $(password).val())
        .then(function (result) {
            console.log(result);
            alert('Autenticado ' + $(email).val());
        })
        .catch(function (error) {
            console.error(error.code);
            console.error(error.message);
            alert('Falha ao autenticar, verifique o erro no console.')
        });
});

logout.on('click', function () {
    firebase
        .auth()
        .signOut()
        .then(function () {
            alert('Você se deslogou');
        }, function (error) {
            console.error(error);
        });
});

authFacebook.on('click', function () {
    var provider = new firebase.auth.FacebookAuthProvider();
    signIn(provider);
});

function signIn(provider) {
    firebase.auth()
        .signInWithPopup(provider)
        .then(function (result) {
            console.log(result);
            var token = result.credential.accessToken;
        }).catch(function (error) {
            console.log(error);
            alert('Falha na autenticação');
        });
}