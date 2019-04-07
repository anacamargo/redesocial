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

let i = 0;
 $('#incrementa').click(function(){ 
       
    if (i < 20 ) {
            i++;
        } else if (i = i++) {
            i = 0;
        }
        document.getElementById("display").innerHTML = i;
 })

 $('#disminuye').click(function(){ 
 
  if (i > 0) {--i;} 
        document.getElementById("display").innerHTML = i;
 })











/**
     * BOTÕES DO CARD
     
    let inner = document.createElement("div");
    inner.classList.add('row')

    // Botão adicionar
    let button_add = document.createElement("button");
    button_add.classList.add('btn', 'btn-link', 'col-3');
    button_add.setAttribute('onclick', "curtir('" + id + "')");
    button_add.innerText = 'curtir';
    inner.appendChild(button_add);

    // Contador de curtidas
    let counter = document.createElement("span");
    counter.innerHTML = informacao.curtidas;
    counter.classList.add('col-3', 'text-center', 'count-number');
    inner.appendChild(counter);

    // Botão de subtrair
    let button_sub = document.createElement("button");
    button_sub.classList.add('btn', 'btn-link', 'col-3');
    button_sub.setAttribute('onclick', "descurtir('" + id + "')");
    button_sub.innerText = 'descurtir';
    inner.appendChild(button_sub);

    $('#btn-share').on('click', function () {
        let newPost = $('#text-area').val();
        let messageFromDB = database.ref('posts/' + USER_ID).push({
            user: USER_ID,
            message: newPost
        });*/