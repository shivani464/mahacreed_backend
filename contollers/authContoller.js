const User = require('../models/User');
const Teams = require('../models/Teams');

const { generateJwtToken } = require('../helpers/JwtTokenHelper');
const { hashPassword, comparePassword } = require('../helpers/HashPassword')
require('dotenv').config();

const { validationResult } = require('express-validator');


//Register User 
const registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(200).json({
                success: false,
                msg: 'Errors',
                errors: errors.array()
            });
        }
        const { name, email, password, role, cinNumber, licenseNumber, natureOfBusiness } = req.body;
        const isExistUser = await User.findOne({ email });

        if (isExistUser) {
            return res.status(200).json({
                success: false,

                msg: "Email already exist !"
            })
        }
        // const hashPassword = await bcrypt.hash(password, 10);
        const hashPasswords = await hashPassword(password);
        const user = new User({
            name,
            email,
            password: hashPasswords,
            role,
            natureOfBusiness,



        });
        if (role === 'Company') {
            user.cinNumber = cinNumber;
        } else if (role === 'Dealer' || role === 'Retailer') {
            user.licenseNumber = licenseNumber;
        }

        const userData = await user.save();

        return res.status(200).json({
            success: true,
            msg: 'registered successfully !',
            data: userData
        })

    }

    catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }
}

//login user and employee
// const loginUser = async (req, res) => {
//     try {

//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(200).json({
//                 success: false,
//                 msg: 'Errors',
//                 errors: errors.array()
//             });
//         }
//         const { email, password } = req.body;
//         //checking email

        
//         const userData = await User.findOne({ email });
        
//         if (!userData) {
//             return res.status(400).json({
//                 success: false,
//                 msg: "Email & password is incorrect !"
//             })
//         }
//         //check the password
//        // const isPasswordMatch = await bcrypt.compare(password, userData.password);
//         const isPasswordMatch = comparePassword(password,userData.password);
//         if (!isPasswordMatch) {
//             return res.status(400).json({
//                 success: false,
//                 msg: "Email & password is incorrect !"
//             })
//         }

//         const accessToken = generateJwtToken(
//             {
//                 user:
//                 {
//                     _id: userData._id,
//                     role: userData.role,
//                     email: userData.email,

//                 }
//             });

//         return res.status(200).json({
//             success: true,
//             msg: 'Login successfully !',
//             accessToken: accessToken,
//             tokenType: 'Bearer',
//             data: {
//                 _id: userData._id,
//                 role: userData.role,
//                 name: userData.name,
//                 email: userData.email,
//                 natureOfBusiness: userData.natureOfBusiness,
//                 profileCompleted: userData.profileCompleted,
//                 isVerified: userData.isVerified,
//                 isActive: userData.isActive,
//                 createdAt: userData.createdAt,
//                 updatedAt: userData.updatedAt
//             },
//         })

//     } catch (error) {
//         return res.status(400).json({
//             success: false,
//             msg: error.message
//         });
//     }
// }

//same login for admin and employee

const loginUser = async(req, res) => {
  const   { email, password } = req.body;
  try {
    //check if the request body has any validation error
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(200).json({
            success:false,
            msg:'Errors',
            error:errors.array()
        });
    }
    //check is user table admin or super admin
    let user = await User.findOne({ email });
    if(user){
        const isMatch = await comparePassword(password, user.password);
        if(!isMatch) {
            return res.status(400).json({
                success: false,
                msg : "Email and Password is Incorrect !!"
            });
            
        }
        const accessToken = generateJwtToken(
            {user: {
                    id: user._id,
                    role: user.role,
                    email: user.email,
            }}
        )
        res.setHeader('Authorization', `Bearer ${accessToken}`);
        return res.status(200).json({
            success: true,
            msg: 'Login successfully !',
            // accessToken: accessToken,
            // tokenType: 'Bearer',
            data: {
                _id: user._id,
                role: user.role,
                name: user.name,
                email: user.email,
                natureOfBusiness: user.natureOfBusiness,
                profileCompleted: user.profileCompleted,
                isVerified: user.isVerified,
                isActive: user.isActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
        })

    }

    let employee = await Teams.findOne( {email});
    if(employee){
        const isMatch = await comparePassword(password, employee.password);
        if(!isMatch) {
            return res.status(400).json({
                success: false,
                msg : "Email and Password is Incorrect !!"
            });
            
        }
        const accessToken = generateJwtToken(
            {
                employee: {
                    id: employee._id,
                    designation: employee.designation,
                    email: employee.email,
            }}
        )
        res.setHeader('Authorization', `Bearer ${accessToken}`);

        return res.status(200).json({
            success: true,
            msg: 'Login successfully !',
            // accessToken: accessToken,
            // tokenType: 'Bearer',
            data: {
                _id: employee._id,
                adminID :employee.leaderId,
                name: employee.name,
                email: employee.email,
                employeeId:employee. employeeId,
                designation: employee.designation,
                // profileCompleted: employee.profileCompleted,
                // isVerified: employee.isVerified,

                isActive: employee.isActive,
                createdAt: employee.createdAt,
                updatedAt: employee.updatedAt
            },
        });
    }
//if not admin and empoyee
return res.status(400).json({
    success: false,
    msg: "Email and Password is Incorrect !!"
});
    
  } catch (error) {
    res.status(500).json({
        success:false,
        msg:error.message,
        msgggg:"here we broke our server"
    });
  }
}



//complete profile status

const completeProfile = async (req, res) => {
    const userId = req.params.userId;


    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }
    try {
        const updatedUser = await User.findById(userId);
        console.log("is that user mate", updatedUser);


        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the profileCompleted field to true
        updatedUser.profileCompleted = true;
        await updatedUser.save();

        return res.status(200).json({
            message: "Profile completed successfully",
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


module.exports = {
    registerUser,
    loginUser, completeProfile
}