import express from "express";
import bcrypt from "bcrypt";
import mockUsers from "./data.js";

const app = new express();
app.use(express.json());

app.post("/register", async (req, res) => {
  try {
    const data = req.body;
    const { username, email, pass } = data;

    if (pass.length < 4)
      return res
        .status(400)
        .json({
          success: false,
          message: "password must be greater than 4 characters",
        });

        
    const regex = "/S+@S+.S+/";
    if (regex.test(email))
      return res
        .status(400)
        .json({ success: false, message: "Incorrect Email Format" });

    for (let user of mockUsers)
      if (user.email == email)
        return res
          .status(400)
          .json({ success: false, message: "email already exist" });
      else if (user.username == username)
        return res
          .status(400)
          .json({ success: false, message: "username already exist" });

    const hashPass = await bcrypt.hash(pass, 10);
    const newUser = { ...data, id: mockUsers.length + 1, pass: hashPass };
    mockUsers.push(newUser);
    console.log("updatedUsers: ", mockUsers);
    res
      .status(201)
      .json({
        success: true,
        id: newUser.id,
        message: "user registered succesfully",
      });
  } catch (error) {
    res.send(500).json({ success: false, message: error.message });
  }
});

app.listen(3000, () => console.log("server is running"));
