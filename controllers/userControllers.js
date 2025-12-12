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
            res.json({
                message: "User created successfully"
            })

        }
    ).catch(
        () => {
            res.json({
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

                const isPasswordValid = bcrypt.compareSync(req.body.password , User.password)

                if(isPasswordValid){

                    const token = jwt.sign(
                        {
                    
                            email : User.email,
                            firstName : User.firstName,
                            lastName : User.lastName,
                            role : User.role,
                            image : User.image1,
                            isemailverified : User.isemailverified
                        },
                        "your-secret-key-here",
                        { expiresIn: "1h" }
                    )

                    res.json(
                        {
                            message : "Login sucsess",
                            token : token
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