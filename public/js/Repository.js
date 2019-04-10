class Repository{
    constructor(database, userID){
        this.database = database;
        this.userID = userID;
    }

    async getUserById(id){
        const ref = database.ref("users/" + id);
        const snap = await ref.once('value');
        const user = snap.val();
        return user;
    }

    async getPostsByUserId(userId){
        const ref = database.ref("posts/" + userId);
        const snaps = await ref.once('value');
        let posts = [];
        snaps.forEach((child) => {
            let post = child.val();
            post['id'] = child.key;
            posts.push(post);
        });
        return posts.reverse();
    }

    async getPostByID(id, userID){

        const ref = this.database.ref('posts/' + userID + "/" + id);
        const snap = await ref.once('value');
        const key = snap.key;
        const post = snap.val();            
        post['id'] = key;

        return post;

    }

    insertPost(post){
        const message = this.database.ref('posts/' + USER_ID).push(post);
        return message.key;
    }

    async getLikesByPostID(postID){
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

    insertLike(postID, liker){
        this.database.ref('likes/' + postID).push(liker);
    }

    removeLike(postID, likeID){
        this.database.ref('likes/' + postID + "/" + likeID).remove();
    }

    deletePost(id){
        this.database.ref('posts/' + USER_ID + '/' + id).remove();
    }

    updatePost(id, newPost, userID){
        this.database.ref('posts/' + (userID || USER_ID) + '/' + id).update(newPost);
    }
}