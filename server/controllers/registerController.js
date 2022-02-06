const User = require("../model/User");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password)
    return res
      .status(400)
      .json({ message: '"name" and "password" are required.' });
  // check for duplicate usernames in the db
  const findDuplicate = await User.findOne({ username: name }).exec();
  console.log(findDuplicate);
  if (findDuplicate)
    return res
      .status(409)
      .json({ message: "Username is allready taken, try again" });

  try {
    // encrypts the password from user
    const hashedPassword = await bcrypt.hash(password, 10);

    // create & stores new user to DB
    const result = await User.create({
      username: name,
      password: hashedPassword,
    });

    console.log(result);
    res.status(201).json({ succes: `New user ${name} created in db.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
