const router = require("express").Router();
const Post = require('../models/Post');
const User = require('../models/User');

// POST create 
router.post("/", async(req, res) => {
    const newPost = new Post(req.body);
    try {
        const savePost = await newPost.save();
        return res.status(200).json(savePost)
    } catch (err) {
        return res.status(500).json(err);
    }
});

// Post Update /:id = POST ID
router.put("/:id", async(req, res)=> {
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId) {
            await post.updateOne({
                $set: req.body,
            });
            return res.status(200).json("Success Edit your POST")
        } else {
            return res.status(403).json("This is not your post.")
        }

    } catch (err) {
        return res.status(403).json(err);
    }
})

// Post Delete /:id = POST ID
router.delete("/:id", async(req, res)=> {
    const post = await Post.findById(req.params.id);
    if (req.body.userId === post.userId) {
        try {
            await Post.deleteOne();
            res.status(200).json("Post Delete Successed !");
        } catch(err) {
            res.status(403).json(err);
        }

    } else {
        res.status(500).json("You no premission to delete this Post")
    }

});

// Get one post
router.get('/:id', async(req, res) =>{
    try {
        const post = await Post.findById(req.params.id)
        return res.status(200).json(post);
    } catch(err) {
        return res.status(403).json(err);
    }
});

//Like one post
router.put('/:id/like', async(req, res)=> {
    try {
        const post = await Post.findById(req.params.id);

        //判斷是否已經like,檢查是否可以like
        if(!post.likes.includes(req.body.userId)) {
            await post.updateOne({
                $push: {
                    likes:req.body.userId,
                },
            });
            return res.status(200).json("you like this post");
        } else {
            await post.updateOne({
                $pull:{
                    likes:req.body.userId,
                }
            });
            return res.status(200).json("you cancel your like");
        }
    } catch(err) {
        return res.status(403).json(err);
    }
});

//取得綜合性貼文 - Follow/Like的
router.get("/timeline/:userId", async(req, res)=> {
    try{
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({userId: currentUser._id});
        //get follower post
        //Promise 是要求隨時聽取currentUser
        const friendPosts = await Promise.all(
            currentUser.followings.map((frinedId) => {
                return Post.find({userId: frinedId});
            })
        );

        //concat 是將Array組合
        return res.status(200).json(userPosts.concat(...friendPosts))
    } catch(err) {
        return res.status(500).json(err);
    }
});

//Profile自己的貼文 - Self
router.get("/profile/:username", async(req,res)=> {
    try {
        const user = await User.findOne({username:req.params.username});
        const posts = await Post.find({userId:user._id})
        return res.status(200).json(posts);
    } catch (err) {
        return res.status(500).json(err);
    }
});



// router.get("/", (req, res) => {
//     res.send("post Router");
// })

module.exports = router;