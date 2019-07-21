class Repository {
  constructor(database, userID) {
    this.database = database;
    this.userID = userID;
  }

  async getUsers() {
    const ref = database.ref('users/');
    const snaps = await ref.once('value');
    let users = [];
    snaps.forEach((child) => {
      let user = child.val();
      user['id'] = child.key;
      users.push(user);
    });
    return users;
  }

  async getUserById(id) {
    const ref = database.ref('users/' + id);
    const snap = await ref.once('value');
    const user = snap.val();
    user['id'] = id;
    return user;
  }

  async getPostsByUserId(userId) {
    const ref = database.ref('posts/' + userId);
    const snaps = await ref.once('value');
    let posts = [];
    snaps.forEach((child) => {
      let post = child.val();
      post['id'] = child.key;
      posts.push(post);
    });
    return posts.reverse();
  }

  async getPostByID(id, userID) {

    const ref = this.database.ref('posts/' + userID + '/' + id);
    const snap = await ref.once('value');
    const key = snap.key;
    const post = snap.val();
    post['id'] = key;

    return post;

  }

  async getLikesByPostID(postID) {
    const ref = this.database.ref('likes/' + postID);
    const snaps = await ref.once('value');
    let likes = [];
    snaps.forEach((child) => {
      let like = child.val();
      like['id'] = child.key;
      likes.push(like);
    });
    return likes;
  }

  async getFriendsByUserId(userId) {
    const ref = this.database.ref('friends/' + userId);
    const snaps = await ref.once('value');
    let friends = [];
    snaps.forEach((child) => {
      let friend = child.val();
      friend['registerId'] = child.key;
      friends.push(friend);
    });
    return friends;
  }

  insertPost(post) {
    const message = this.database.ref('posts/' + USER_ID).push(post);
    return message.key;
  }

  insertLike(postID, liker) {
    this.database.ref('likes/' + postID).push(liker);
  }

  insertFriend(userID, friendID) {
    this.database.ref('friends/' + userID).push({ friendID });
  }

  removeLike(postID, likeID) {
    this.database.ref('likes/' + postID + '/' + likeID).remove();
  }

  deletePost(id) {
    this.database.ref('posts/' + USER_ID + '/' + id).remove();
  }

  updatePost(id, newPost, userID) {
    this.database.ref('posts/' + (userID || USER_ID) + '/' + id).update(newPost);
  }
  
  updateUser(id, newUser, userID) {
		this.database.ref('users/' + (userID || USER_ID)).update(newUser);
	}
}