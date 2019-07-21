var database = firebase.database();
let USER_ID = sessionStorage["USER_ID"];
if (!USER_ID) window.location.href = "sign-in.html";

$(document).ready(async function() {
  const db = new Repository(database);
  const user = await db.getUserById(USER_ID);
  const users = await db.getUsers();
  const friends = await db.getFriendsByUserId(USER_ID);
  const friendIds = friends.map(x=>x.friendID);
  const posts = await db.getPostsByUserId(USER_ID);
    
  toggleShareButton();
  $('[data-profile-pic]').attr('src', user.picture);
  $('[data-profile-petname]').html(user.petName); 
  $('#logout').on('click', logout);
  $('#btn-publish').on('click', createPost);

  for(friendID of friendIds){
    const friend = await db.getUserById(friendID);
    const html = friendsToHtml(friend);
    $('#friends-list').append(html);

    const friendPosts = await db.getPostsByUserId(friendID);
    for (post of friendPosts) {
      const likes = await db.getLikesByPostID(post.id);
       $('#posts').append(postToHtml(friend, post, likes));
    }
  }

  for (post of posts) {
    const likes = await db.getLikesByPostID(post.id);
    $('#posts').append(postToHtml(user, post, likes));
  }

  $('#posts').on('click', 'li button[data-delete-post]', function () {
    const postID = $(this).data('delete-post');
    deletePost(postID);
  });

  $('#posts').on('click', 'li button[data-edit-post]', async function () {
    const postID = $(this).data('edit-post');
    const action = $(this).data('action');
    if (action === 'edit') {
      $(this).data('action', 'save');
      $(this).find('i').removeClass('fa-pencil-alt');
      $(this).find('i').addClass('fa-save');
      editPost(postID);
    }
    else {
      const ok = await savePost(postID);
      if (ok) {
        $(this).data('action', 'edit');
        $(this).find('i').removeClass('fa-save');
        $(this).find('i').addClass('fa-pencil-alt');
      }
    }
  });

  $('#posts').on('click', 'li button[data-like-post]', async function () {
    const postID = $(this).data('like-post');
    const action = $(this).data('action');

    if (action === 'like') {
      const likes = await like(postID);
      $(this).find('i').removeClass('far').addClass('fas');
      $(this).parent().find('.likes-counter').text((likes || []).length);
      $(this).data('action', 'unlike');
    }
    else {
      const likes = await unlike(postID);
      $(this).find('i').removeClass('fas').addClass('far');
      $(this).parent().find('.likes-counter').text((likes || []).length);
      $(this).data('action', 'like');
    }
  });

  for (friendToBe of users) {
    friendsSuggestion(friendToBe, friends);
  }

  $('.friend-suggestion-list').on('click', 'button[data-add-friend]', async function () {
    const id = $(this).data('add-friend');
    const db = new Repository(database);
    const friends = await db.getFriendsByUserId(USER_ID);
    const friendIds = friends.map(x => x.friendID);
    if (!friendIds.includes(id)) db.insertFriend(USER_ID, id);
    window.location.reload();
  });
  
});

function deletePost(postID) {
  const db = new Repository(database);
  let confirmation = confirm("Tem certeza que deseja excluir");
  if (confirmation === true) {
    db.deletePost(postID);
    $('li#' + postID).remove();
  }
}

function getDateAsString() {
  let date = new Date();
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let month = months[date.getMonth()];
  let day = date.getDate();
  let year = date.getFullYear();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} - ${day} ${month} ${year}`;
}

function toggleShareButton() {
  $('#text-area').on('keyup', function() {
    const str = $('#text-area').val();
    if (str.length > 0) {
      $('#btn-publish').removeAttr('disabled');
    } else {
      $('#btn-publish').setAttribute('disabled', 'disabled');
    }
  });
}

function editPost(postID) {
  const displaySelector = '[data-post-message=' + postID + ']';
  const editSelector = '[data-post-message-edit=' + postID + ']';
  const desiredHeight = $(displaySelector).css('height');
  
  $(editSelector).css('height', desiredHeight);
  $(displaySelector).hide();
  $(editSelector).show().focus();
}

async function savePost(postID) {
  try {
    const displaySelector = '[data-post-message=' + postID + ']';
    const editSelector = '[data-post-message-edit=' + postID + ']';
    const message = $(editSelector).val();

    const db = new Repository(database);
    let post = await db.getPostByID(postID, USER_ID);
    post.message = message;
    db.updatePost(postID, post);

    $(displaySelector).text(post.message);
    $(editSelector).hide();
    $(displaySelector).show();

    return true;
  } catch (ex) {
    console.log('erro ao salvar', ex);
    return false;
  }
}

function postToHtml(user, post, likes) {
  const liked = (likes || []).filter(x => x.userID === USER_ID).length > 0;
  const likeCounter = (likes || []).length;
  const template =
    `<li class="row p-2" id="${post.id}">
      <article class="col-12">
        <div class="row">
          <div class="col-1 p-0">
            <img class="post-profile-pic rounded-circle" src="images/${user.species}.png">
          </div>
          <div class="col-9">                    
            <h4>${user.petName || "Anonimous"}</h4>
            <time>${post.date}</time>
          </div>
          <div class="col-2 text-right mt-2 ${user.id != USER_ID ? 'd-none' : 'd-block'}">                    
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
            <span class="likes-counter">${likeCounter > 0 ? likeCounter : ''}</span>                                                                           
            <button class="bg-white shadow-none" type="button" data-like-post-user="${user.id}" data-like-post="${post.id}" data-action="${liked ? 'unlike' : 'like'}">
              <i class="bg-white text-danger fa${liked ? 's' : 'r'} fa-heart"></i></i>
            </button>
          </div>
        </div>
      </article>
    </li>`;
  return template;
}

async function createPost() {
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

  const post = await db.getPostByID(newPostId, USER_ID);
  const likes = await db.getLikesByPostID(post.id);
  const user = await db.getUserById(USER_ID);
  $('#posts').prepend(postToHtml(user, post, likes));
  $('#text-area').val('');
  $('#btn-publish').setAttribute('disabled', 'disabled');
}

async function like(postID) {
  const db = new Repository(database);
  const user = await db.getUserById(USER_ID);
  const petName = user.petName;
  const liker = { userID: USER_ID, name: petName };
  likes = (await db.getLikesByPostID(postID)) || [];

  if (!likes.includes(liker)) db.insertLike(postID, liker);
  return await db.getLikesByPostID(postID);
}

async function unlike(postID) {
  const db = new Repository(database);
  const likes = await db.getLikesByPostID(postID);
  let like = likes.filter(x => x.userID === USER_ID);
  if (like.length > 0) {
    like = like[0];
    db.removeLike(postID, like.id);
  }
  return await db.getLikesByPostID(postID);
}

function friendsToHtml(friend) {
  function replaceAll(str, from, to) {
    return str.split(from).join(to);
  }

  let friendTemplate = $('#friends-list').find('template').html();
  friendTemplate = replaceAll(friendTemplate, '{{ID}}', friend.id);
  friendTemplate = replaceAll(friendTemplate, '{{NAME}}', friend.petName);
  friendTemplate = replaceAll(friendTemplate, '{{PIC}}', friend.picture);
  return friendTemplate;
}

function friendsSuggestion(user, friends) {
  const friendIds = friends.map(x=>x.friendID);
  if (user.id !== USER_ID && !friendIds.includes(user.id)) {
    $('.friend-suggestion-list').append(`
    <li class="m-2">
      <img class="rounded-circle post-profile-pic friend-list-image" src="${user.picture}"/>
      <span class="d-block">${user.petName}</span>
      <button type="button" data-add-friend="${user.id}">Adicionar</button>
    </li>
    `);
  }
}