import AppUser from "../model/userModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()








//GETTING ALL THE USERS
export const getUsers = async (req, res)=>{
    try {
        const users = await AppUser.find().select('-password').lean()

    if(!users?.length){
        return res.status(400).json({message:'There are no users in the database yet'})
    }
    res.status(200).json( users)
    } catch (error) {
        console.log("This is a server based error", error)
    }
}




//AGGREGATOR OR ADMIN CREATING SUBORDINATES



export const creatingSubordinates = async (req, res) => {
    try {
        const { username, password, email, roles } = req.body;
        const { _id } = req.params;
    

        // 1. Strict Validation: Ensure ALL required fields are present
        if (!username || !email || !password || !roles) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // 2. Check for existing user to prevent duplicates
        // const existingUser = await AppUser.findOne({ $or: [{ username }, { email }] });
        // if (existingUser) {
        //     return res.status(409).json({ message: "Username or Email already exists" });
        // }

        // 3. Secure Password Hashing
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 4. Create and Save Subordinate
        const newSubordinate = new AppUser({
            username,
            email,
            password: hashedPassword,
            roles:'Buyer', // Store the hash, never the plain text
    
            controlledBy: _id
        });
    //    return  res.json(_id)

        const savedSubordinate = await newSubordinate.save();

        // 5. Response (Don't send the password back in the response)
        const responseData = savedSubordinate.toObject();
        delete responseData.password;

        return res.status(201).json({
            message: `New subordinate created for manager: ${_id}`,
            data: responseData
        });

    } catch (error) {
        // 6. Error Handling
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};






//GETTING USERS UNDER A SPECIFIC AGGREGATOR OR ADMIN
export const getSubordinates = async (managerId) => {
  try {
    const subordinates = await User.find({ controlledBy: managerId });
    return subordinates;
  } catch (error) {
    console.error("Error fetching team:", error);
  }
};




//CREATING A SINGLE USER
export const createUser = async(req, res)=>{
    const {username, email, password, roles} = req.body

    try {
        if(!(username || email || password || roles)){
            return res.status(400).json({message:'All fields are required'})
        }
        //looking for duplicates in the database requires tha we await the data
        const duplicate =await  AppUser.findOne({username}).lean()
        if(duplicate){
            return res.status(400).json({message:`User with username: ${username} already exists. Try usng another username.`})
        }

        //we hash the password for security purposes. we have to await the original password before hashing it.
        const hashedPassword = await bcrypt.hash(password, 10)

        //this is a new user object with the hashed pasword for security purposes
        const newUserObject = {
            username,
            password: hashedPassword,
            email,
            roles
        }

        //here the new useer is created
        const newUser = await AppUser.create(newUserObject)

        //checking for the viability of the new user created
        if(newUser){
            return res.status(200).json({message:`New user, ${newUser.username} , created successfully`})
        }
        return res.status(400).json({message:'User based error.'})


    } catch (error) {
        console.log(error)
    }
}



//LOGIN IN AND ACCEPTING THE JWT
export const login = async(req,res)=>{
   let token;
    try {
     const {username, password} = req.body
    
    if(!username || !password) return res.status(400).json({message:'All the fields are required for logins'})
    //used to get the object document
    const user = await AppUser.findOne({username})
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const verifyPwd  = await bcrypt.compare(password, user.password)
    
    if(!verifyPwd) return res.status(400).json({message:'incorrect user credentialS'})
        
        // res.json(verifyPwd)
        
     token = jwt.sign(
    { 
        id: user._id, 
        roles: user.roles 
    }, 
    process.env.ACCESS_TOKEN_SECRET, // Use a more descriptive variable name
    { 
        expiresIn: '30d',
        algorithm: 'HS256' // Explicitly defining the algorithm is a security best practice
    }
);
        
        // res.json(user)
    return res.status(200).json({
      _id: user._id,
      username: user.username,
      roles: user.roles,
      token,
      message:`user with username ${user.username} is logged in successfully`
    });
   } catch (error) {
    // 5. Always log the actual error for debugging, but send a generic message
    console.error("Login Error:", error);
    res.status(500).json({ message: 'Internal server error'});
  }
}




export const createUserInAdminOrSuperAdmin = async (req, res) => {
  try {
    const { username, email, password, roles } = req.body;
    const creator = req.user; // Assuming you have an auth middleware

    // Rule 1: Only Super Admin can create Super Admins or Admins
    if (roles === 'super-admin' || roles === 'admin') {
      if (creator.role !== 'super-admin') {
        return res.status(403).json({ message: "Unauthorized to create this role" });
      }
    }

    const newUser = new AppUser({
      username,
      email,
      password,
      roles,
      createdBy: creator._id
    });

    const savedUser = await newUser.save();

    // If an Admin creates a User, add that user to the Admin's subordinates
    if (creator.roles === 'admin' && roles === 'user') {
      await AppUser.findByIdAndUpdate(creator._id, { $push: { subordinates: savedUser._id } });
    }

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};









export const updateUserStatus = async (req, res) => {
  try {
    const { userId, isActive } = req.body;
    const admin = req.user;
    const targetUser = await AppUser.findById(userId);

    if (!targetUser) return res.status(404).json({ message: "User not found" });

    // Rule 2: Admins can only toggle their own subordinates
    if (admin.role === 'admin') {
      if (targetUser.createdBy.toString() !== admin._id.toString()) {
        return res.status(403).json({ message: "You can only manage your subordinates" });
      }
    }

    // Rule 3: Super Admins can toggle anyone (except maybe themselves, depending on your UI)
    targetUser.isActive = isActive;
    await targetUser.save();

    res.json({ message: `User is now ${isActive ? 'active' : 'inactive'}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};






export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    // const actor = req.user; // The person trying to delete
    const target = await AppUser.findById(id);

    // if (actor.roles !== 'super-admin') {
    //   return res.status(403).json({ message: "Only Super Admins can delete users" });
    // }

    // Rule 4: If target is a Super Admin, only their creator can delete them
    // if (target.roles === 'super-admin') {
    //   if (target.createdBy.toString() !== actor._id.toString()) {
    //     return res.status(403).json({ message: "Only the original creator can delete this Super Admin" });
    //   }
    // }

    await AppUser.findByIdAndDelete(id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};