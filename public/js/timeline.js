var database = firebase.database();
//let USER_ID = window.location.search.match(/\?userId=(.*)/)[1];
let USER_ID = sessionStorage["USER_ID"];

if(!USER_ID) window.location.href = "authentication.html";

$(document).ready(function () {
    $('#logout').click(logoutClick);

    database.ref("posts/" + USER_ID).once('value')
        .then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
                
                $('#list').append(`
                <li>
                    <button type="button" data-delete-post=${childKey}>Excluir</button>
                    <button type="button" data-edit-post=${childKey}>Editar</button>
                    <button type="button" data-delete-post=${childKey}>Salvar</button>
                    <p>${childData.message}</p>
                </li>`);

                $(`button[data-delete-post="${childKey}"]`).click(
                    (event) => deletePostClick(event.target, childKey)
                );
            });
        });

    
    $('#btn-share').on('click', function () {
        let newPost = $('#text-area').val();
        let visibility = $('#visibility option:selected').val();

        let messageFromDB = database.ref('posts/' + USER_ID).push({
            user: USER_ID,
            message: newPost,
            type: visibility,
            likes: []
        });

        $('#list').append(`
        <li>
            <button type="button" data-delete-post=${messageFromDB.key}>Excluir</button>
            <button type="button"id="edit" data-edit-post=${messageFromDB.key}>Editar</button>  
            <button type="button"id="save" data-save-post=${messageFromDB.key}>Salvar</button>              
            <p data-post=${messageFromDB.key}>${newPost}</p>
        </li>`);

        $(`button[data-delete-post="${messageFromDB.key}"]`).click(
            (event) => deletePostClick(event.target, messageFromDB.key)
        ); 
        
        
    });
});

function logoutClick(event) {
    event.preventDefault();

    firebase
        .auth()
        .signOut()
        .then(function () {
            sessionStorage.clear();
            window.location = '../authentication.html';
        }, function (error) {
            console.error(error);
        });
}

function deletePostClick(self, x){
    let confirmation = confirm("Tem certeza que deseja excluir");
    if (confirmation === true) {
        database.ref("posts/" + USER_ID + "/" + x).remove();
        $(self).parent().remove();
    }
}

function getDateAsString() {
    let date = new Date();
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let month = months[date.getMonth()];
    let day = date.getDate();
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();

    return `${hours}:${minutes} - ${day} ${month} ${year}`;
}