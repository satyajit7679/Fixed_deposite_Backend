const express= require('express');
const router = express.Router();
router.get('/users1',async (req, res) => {
    try {
      console.log("printed")
      const userList= await User.find({});
      console.log("userList",userList)
      res.status(201).json(userList);
      
    } catch (error) {
      
    }finally{
      console.log("printed again")
    }
});
module.exports=router
