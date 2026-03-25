import AppUser from "../model/userModel.js";
import bcrypt from 'bcrypt'








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
            return res.status(200).json({message:'New user created successfully'})
        }
        return res.status(400).json({message:'User based error.'})


    } catch (error) {
        console.log(error)
    }
}