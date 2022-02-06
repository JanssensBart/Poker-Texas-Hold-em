const User = require("../model/User");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
  const allUsers = await User.find();
  if (!allUsers)
    return res.status(204).json({ message: "No users found in database" });
  res.json(allUsers);
};

const createNewUser = async (req, res) => {
  if (!req.body?.username)
    return res.status(400).json({ message: "Please provide a username" });
  if (!req.body?.password)
    return res.status(400).json({ message: "Please provide a password" });

  // check for duplicate usernames in the db
  const duplicate = await User.findOne({ username: req.body?.username }).exec();
  if (duplicate)
    return res
      .status(409)
      .json({ message: "Username is allready taken, try again" }); // 409 = Conflict

  const preferredUsername = req.body.username;
  const preferredPassword = req.body.password;
  const hashedPassword = await bcrypt.hash(preferredPassword, 10);

  try {
    const newUser = await User.create({
      username: preferredUsername,
      password: hashedPassword,
    });
    res.status(201).json({ message: `User created ${newUser.username}` });
  } catch (error) {
    console.error(error);
  }
};

const deleteUserByID = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: "Please provide a user ID" });

  // search db for user
  const idToSearchFor = req.body.id;
  const foundUser = await User.findById(idToSearchFor).exec();
  if (!foundUser)
    return res
      .status(204)
      .json({ message: `User ID: ${idToSearchFor} is not found in database` });
  // delete user in db
  const deletedUser = User.findByIdAndDelete(idToSearchFor).exec();
  res.json({ message: `User was deleted ${foundUser.username}` });
};

const updateUserByID = async (req, res) => {
  // must provide id & data to update
  if (!req?.body?.id)
    return res.status(400).json({ message: "Please provide a user ID" });
  if (!req.body)
    return res.status(400).json({ message: "Please provide data to update" });

  // search db for user
  const idToSearchFor = req.body.id;
  const foundUser = await User.findById(idToSearchFor).exec();
  if (!foundUser)
    return res
      .status(204)
      .json({ message: `User ID: ${idToSearchFor} is not found in database` });

  // update user
  !req.body?.username ? foundUser.username = foundUser.username : foundUser.username = req.body.username
  !req.body?.password ? foundUser.username = foundUser.username : foundUser.username = req.body.password
  !req.body?.roles ? foundUser.username = foundUser.username : foundUser.username = req.body.roles
};

const getUserByID = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Please provide a user ID" });

  const idToSearchFor = req.params.id;
  const foundUser = await User.findById(idToSearchFor).exec();
  if (!foundUser)
    return res
      .status(204)
      .json({ message: `User ID: ${idToSearchFor} is not found in database` });

  res.json(foundUser);
};

module.exports = {
  createNewUser,
  getAllUsers,
  getUserByID,
  deleteUserByID,
  updateUserByID,
};
