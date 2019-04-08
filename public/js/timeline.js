var database = firebase.database();

let USER_ID = sessionStorage["USER_ID"];
if(!USER_ID) window.location.href = "sign-in.html";

$(document).ready(async function () {
    $('#logout').click(logoutClick);
    toggleShareButton();
    $(".profile-btn").click(profile);

    const posts = await new Repository(database).getPostsByUserId(USER_ID);
    
    //const filteredPosts = posts.filter(x=>x.type.toLowerCase() === 'public');

    for(post of posts){
        $('#posts').append(postToHtml({}, post));
    }

    $('#posts').on('click', 'li button[data-delete-post]', function(){
        const postID = $(this).data('delete-post');
        deletePostClick(postID);
    });

    $('#btn-share').on('click', createPost);
});

function logoutClick(event) {
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

function deletePostClick(postID){
    const db = new Repository(database);
    let confirmation = confirm("Tem certeza que deseja excluir");
    if (confirmation === true) {
        db.removePost(postID);
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
    let text = $('p');
    console.log(text);
}

function postToHtml(user, post){
    const template = 
        `<li id='${post.id}'>
            <article>
                <div>
                    <img class="post-profile-pic rounded-circle" src="${user.profilePicture || 'images/perfil_2.png'}" alt="">
                    <h5></h5>
                    <time>${post.date}</time>
                    <button type="button" data-edit-post="${post.id}">
                        <i class="fas fa-pencil-alt"></i>
                    </button>              
                    <button type="button" data-delete-post="${post.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
                <div>
                    <p>${post.message}</p>
                </div>
                <div>
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

    $('#posts').prepend(postToHtml({}, post));
    
    $('#text-area').val('');
}

function profile() {
    database.ref("/profile/" + USER_ID + "/")
    window.location = "profile.html?id=" + USER_ID;
   }