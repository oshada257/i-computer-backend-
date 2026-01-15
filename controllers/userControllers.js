import user from '../models/user.js';
import jwt from 'jsonwebtoken';

import bcrypt from 'bcrypt';
export function createUser(req, res) {

    const HashedPassword = bcrypt.hashSync(req.body.password, 10);  

    const newUser = new user({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: HashedPassword,

    });

    newUser.save()
    .then(
        () => {
            res.status(201).json({
                message: "User created successfully"
            })

        }
    ).catch(
        () => {
            res.status(500).json({
                message: "Error creating user"
            })
        }
    )
}

export function loginUser(req,res){
    user.findOne(
        {
            email : req.body.email
        }
    ).then(
        (User)=>{
            if(User== null){
                res.json(
                    {
                        message : "User not found"
                    }
                )
            }else{
                
                if(User.isBlocked){
                    return res.status(403).json({
                        message: "Your account has been blocked. Please contact support."
                    });
                }

                const isPasswordValid = bcrypt.compareSync(req.body.password , User.password)

                if(isPasswordValid){

                    const token = jwt.sign(
                        {
                            id : User._id,
                            email : User.email,
                            firstName : User.firstName,
                            lastName : User.lastName,
                            role : User.role,
                            image : User.image1,
                            isemailverified : User.isemailverified
                        },
                        process.env.JWT_SECRET,
                        { expiresIn: "1h" }
                    )

                    res.json(
                        {
                            message : "Login successful",
                            token : token,
                            role : User.role,




                        }
                    )
                }else{
                    res.status(401) .json(
                        {
                            message : "Passsword is invalid"
                        }
                    )
                }
            }
        }
    )
}

export function isAdmin(req){
    if(req.user == null){
        return false;
    }
    if(req.user.role !== 'admin'){
        return false;
    }else{
        return true;
    }
}


export function getAllUsers(req, res) {
    if (!isAdmin(req)) {
        return res.status(403).json({ message: "Access denied. Admin only." });
    }

    user.find({}, '-password')
        .then((users) => {
            res.json(users);
        })
        .catch((err) => {
            res.status(500).json({ message: "Error fetching users", error: err.message });
        });
}

export function toggleBlockUser(req, res) {
    if (!isAdmin(req)) {
        return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const userId = req.params.id;

    user.findById(userId)
        .then((foundUser) => {
            if (!foundUser) {
                return res.status(404).json({ message: "User not found" });
            }

            foundUser.isBlocked = !foundUser.isBlocked;
            return foundUser.save();
        })
        .then((updatedUser) => {
            res.json({
                message: `User ${updatedUser.isBlocked ? 'blocked' : 'unblocked'} successfully`,
                isBlocked: updatedUser.isBlocked
            });
        })
        .catch((err) => {
            res.status(500).json({ message: "Error updating user", error: err.message });
        });
}

