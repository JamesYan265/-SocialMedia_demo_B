const router = require("express").Router();
const User = require('../models/User');

//CRUD (create - read - update - delete)
//User info Update
router.put('/:id', async(req, res) => {
    if( req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("User Info Updated !");

        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("Update Failed !, you no premission")
    }
})

//User info Delete
router.delete('/:id', async(req, res) => {
    if( req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("User Info Delete !");

        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("Delete Failed !, you no premission")
    }
})

// User info Get
// router.get('/:id', async(req, res) => {
//         try {
//             const user = await User.findById(req.params.id);
//             // 排除password, updatedAt
//             const { password, updatedAt, ...other} = user._doc
//             return res.status(200).json(other);
//         } catch (err) {
//             return res.status(500).json(err);
//         }

// })

//Current User Info Get
router.get('/', async(req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;
    try {
        const user = userId
        ? await User.findById(userId) 
        : await User.findOne({username:username});
        // 排除password, updatedAt
        const { password, updatedAt, ...other} = user._doc
        return res.status(200).json(other);
    } catch (err) {
        return res.status(500).json(err);
    }

});

//User Follower
// params = website address path的目標
router.put("/:id/follow", async(req, res) => {
    if(req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            //判斷是否已經Follower狀態,檢查是否可以Follow
            if(!user.followers.includes(req.body.userId)) {
                await user.updateOne({
                    $push: {
                        followers: req.body.userId,
                    },
                });
                // Following的數量
                await currentUser.updateOne({
                    $push: {
                        followings: req.params.id,
                    },
                });
                return res.status(200).json("Follow Success");
            } else {
                return res.status(403).json("You followed !");
            }
        } catch {
            return res.status(500).json(err);
        }
    } else {
        return res.status(500).json("can't follow yourself !")
    }
})

//User unfollow
router.put("/:id/unfollow", async(req, res) => {
    if(req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            //判斷是否已經Follower狀態,檢查是否可以UnFollow
            if(user.followers.includes(req.body.userId)) {
                await user.updateOne({
                    $pull: {
                        followers: req.body.userId,
                    },
                });
                // Following的數量
                await currentUser.updateOne({
                    $pull: {
                        followings: req.params.id,
                    },
                });
                return res.status(200).json("UnFollow Success");
            } else {
                return res.status(403).json("You followed !");
            }
        } catch {
            return res.status(500).json(err);
        }
    } else {
        return res.status(500).json("can't Unfollow this params user !")
    }
})




// router.get("/", (req, res) => {
//     res.send("user Router");
// })

module.exports = router;