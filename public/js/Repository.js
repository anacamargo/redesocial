class Repository{
    constructor(database){
        this.database = database;
    }

    async getPostsByUserId(userId){
        const ref = database.ref("posts/" + USER_ID)
        const snaps = await ref.once('value');
        let posts = [];
        snaps.forEach((child) => {
            let post = child.val();
            post['id'] = child.key;
            posts.push(post);
        });
        return posts.reverse();
    }

    async getPostByID(id){

        const ref = this.database.ref('posts/' + USER_ID + "/" + id);
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

    removePost(id){
        this.database.ref("posts/" + USER_ID + "/" + id).remove();
    }
}