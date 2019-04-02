var database = firebase.database();
let USER_ID = window.location.search.match(/\?id=(.*)/)[1];

$(document).ready(function () {
    database.ref("/posts/" + USER_ID).once('value')
        .then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
                $('#list').append(`
                <li><button type="button" data-delete-post=${childKey}>Excluir</button><p>${childData.message}</p></li>`);
                $(`button[data-delete-post="${childKey}"]`).on('click', function () {
                    let confirmation = confirm("Tem certeza que deseja excluir");
                    if (confirmation === true) {
                        database.ref("/posts/" + USER_ID + "/" + childKey).remove();
                        $(this).parent().remove();
                    }                    
                });
            });
        });

    $('#btn-share').on('click', function () {
        let newPost = $('#text-area').val();
        let messageFromDB = database.ref('posts/' + USER_ID).push({
            user: USER_ID,
            message: newPost
        });

        $('#list').append(`
        <li>
            <button type="button" data-delete-post=${messageFromDB.key}>Excluir</button>
            <button type="button"id="edit" data-edit-post=${messageFromDB.key}>Editar</button>  
            <button type="button"id="save" data-save-post=${messageFromDB.key}>Salvar</button>              
            <p data-post=${messageFromDB.key}>${newPost}</p>
        </li>`);

        $(`button[data-delete-post="${messageFromDB.key}"]`).on('click', function () {
            let confirmation = confirm("Tem certeza que deseja excluir");
            if (confirmation === true) {
                database.ref("/posts/" + USER_ID + "/" + messageFromDB.key).remove();
                $(this).parent().remove();
            }
        });
    });
});