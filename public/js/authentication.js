$('#createUser').on('click', function () {
    firebase
        .auth()
        .createUserWithEmailAndPassword($('#email').val(), $('#password').val())
        .then(function (response) {
            window.location = 'timeline.html?id=' + response.user.uid;
            console.log(response.user.uid);
        })
        .catch(function (error) {
            console.error(error.code);
            console.error(error.message);
            alert('Falha ao cadastrar, verifique o erro no console.')
        });
});

$('#login').on('click', function () {
    firebase
        .auth()
        .signInWithEmailAndPassword($('#email').val(), $('#password').val())
        .then(function (response) {
            window.location = 'timeline.html?id=' + response.user.uid;
        })
        .catch(function (error) {
            console.error("Code " + error.code);
            console.error(error.message);
            alert('Falha ao autenticar, verifique o erro no console.')
        });
});

$('#logout').on('click', function () {
    firebase
        .auth()
        .signOut()
        .then(function () {
            alert('Você se deslogou');
        }, function (error) {
            console.error(error);
        });
});

$('#authFacebook').on('click', function () {
    var provider = new firebase.auth.FacebookAuthProvider();
    signIn(provider);
});

function signIn(provider) {
    firebase.auth()
        .signInWithPopup(provider)
        .then(function (result) {
            console.log(result);
            var token = result.credential.accessToken;
            console.log(token);
        }).catch(function (error) {
            console.log(error);
            alert('Falha na autenticação');
        });
}