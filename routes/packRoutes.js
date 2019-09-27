const express = require("express");

const router = express.Router();
const packController = require("./../controllers/packController");
const authController = require("./../controllers/authController");

router
<<<<<<< HEAD
.route('/')
.get(packController.getAllPacks) //authController.protect 
.post(packController.createPack);
=======
  .route("/")
  .get(packController.getAllPacks)
  .post(packController.createPack);
>>>>>>> 61c21fae0be6f8086d15bb449cf2a3feffb0a583

router
  .route("/:id")
  .get(packController.getPack)
  .patch(packController.updatePack)
  .delete(
    authController.protect,
    authController.restrictTo("admin", "packer"),
    packController.deletePack
  );

// router.route('/pack-stats').get(packController.getPackStats);

module.exports = router;
