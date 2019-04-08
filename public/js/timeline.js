var database = firebase.database();

let USER_ID = sessionStorage["USER_ID"];
if(!USER_ID) window.location.href = "sign-in.html";

$(document).ready(async function () {
    $('#logout').click(logout);
    toggleShareButton();
<<<<<<< HEAD
    $(".profile-btn").click(profile);
=======
    
    const db = new Repository(database);
    const user = await db.getUserById(USER_ID);

    $('[data-profile-pic]').attr('src', user.picture);
    $('[data-profile-petname').html(user.petName);
>>>>>>> 70da485107de435cfdcdcadc5410ddf2f6491cb5

    const posts = await db.getPostsByUserId(USER_ID);
    
    //const filteredPosts = posts.filter(x=>x.type.toLowerCase() === 'public');

    for(post of posts){
        $('#posts').append(postToHtml(user, post));
    }

    $('#posts').on('click', 'li button[data-delete-post]', function(){
        const postID = $(this).data('delete-post');
        deletePost(postID);
    });
    
    $('#posts').on('click', 'li button[data-edit-post]', async function(){
        const postID = $(this).data('edit-post');
        const action = $(this).data('action');
        if(action === 'edit'){
            $(this).data('action', 'save');
            $(this).find('i').removeClass('fa-pencil-alt');
            $(this).find('i').addClass('fa-save');
            editPost(postID);
        }
        else{
            const ok = await savePost(postID);
            if(ok){
                $(this).data('action', 'edit');
                $(this).find('i').removeClass('fa-save');
                $(this).find('i').addClass('fa-pencil-alt');
            }
        }
    });

    $('#btn-share').on('click', createPost);
});

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

function deletePost(postID){
    const db = new Repository(database);
    let confirmation = confirm("Tem certeza que deseja excluir");
    if (confirmation === true) {
        db.deletePost(postID);
        $('li#' + postID).remove();
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

function toggleShareButton(){
    $('#text-area').keyup(function(){
        const str = $('#text-area').val();
        if(str.length > 0){
            $('#btn-share').removeAttr('disabled');
        }
        else {
            $('#btn-share').prop('disabled',true);
        }
    });
}

function editPost(postID){

    const displaySelector = '[data-post-message='+postID+']';
    const editSelector = '[data-post-message-edit='+postID+']';

    const desiredHeight = $(displaySelector).css('height');
    $(editSelector).css('height', desiredHeight);

    $(displaySelector).hide();
    $(editSelector).show().focus();
}

async function savePost(postID){
    try{
        console.log('save');
        const displaySelector = '[data-post-message='+postID+']';
        const editSelector = '[data-post-message-edit='+postID+']';
        const message = $(editSelector).val();

        const db = new Repository(database);
        let post = await db.getPostByID(postID);
        post.message = message;
        db.updatePost(postID, post);

        $(displaySelector).text(post.message);

        $(editSelector).hide();
        $(displaySelector).show();
        return true;
    }
    catch(ex){
        console.log('erro ao salvar',ex);
        return false;
    }
}

function postToHtml(user, post){
    const template = 
        `<li class="row p-2" id="${post.id}">
            <article class="col-12">
                <div class="row">
                    <div class="col-1 p-0">
                        <img class="post-profile-pic rounded-circle" src="${user.picture || "images/perfil_2.png"}">
                    </div>
                    <div class="col-9">                    
                        <h4>${user.petName || "Anonimous"}</h4>
                        <time>${post.date}</time>
                    </div>
                    <div class="col-2 text-right mt-2">                    
                    <button type="button" data-edit-post="${post.id}" data-action="edit">
                        <i class="fas fa-pencil-alt"></i>
                    </button>              
                    <button type="button" data-delete-post="${post.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                    </div>
                </div>
                <hr>
                <div>
                    <p data-post-message="${post.id}">${post.message}</p>
                    <textarea class="message-edit" data-post-message-edit="${post.id}" >${post.message}</textarea>
                </div>
                <hr>
                <div class="row text-right">
                    <div class="col-12">
                        <button type="button"id="like" data-like-post="${post.id}">
                            <i class="far fa-heart"></i></i>
                        </button>              
                        <button type="button"id="like" data-like-post="${post.id}">
                            <i class="fas fa-heart"></i>
                        </button>                                                              
                        <button type="button" id="comment" data-comment-post="${post.id}">
                            <i class="far fa-comment-alt"></i></i>
                        </button>
                        <span id="count-likes"></span>
                        <button type="button" id="comment" data-comment-post="${post.id}">
                            <i class="fas fa-comment-alt"></i>
                        </button>
                    </div>
                </div>
            </article>
        </li>`;
        return template; 
}

async function createPost(){
    let newPost = $('#text-area').val();
    let visibility = $('#visibility option:selected').val();
    
    const db = new Repository(database);

    const newPostId = db.insertPost({
        date: getDateAsString(),
        user: USER_ID,
        message: newPost,
        type: visibility,
        likes: []

    });

    const post = await db.getPostByID(newPostId);
    const user = await db.getUserById(USER_ID);

    $('#posts').prepend(postToHtml(user, post));
    
    $('#text-area').val('');
}

function profile() {
    database.ref("/profile/" + USER_ID + "/")
    window.location = "profile.html?id=" + USER_ID;
   }