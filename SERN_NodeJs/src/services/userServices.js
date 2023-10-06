import { db } from '../models/index';
import bcrypt from 'bcryptjs';
import emailService from './emailService';
const salt = bcrypt.genSaltSync(10);

let handleUserLogin = async (email, password) => {
    let userData = {};

    if (!email || !password) {
        userData.errorCode = 1;
        userData.message = 'Missing inputs parameter';
        return userData;
    }
    try {
        let isUserExit = await checkUserMail(email);
        // check user is exit
        if (isUserExit) {
            // user email already exits
            // compare password
            let user = await db.User.findOne({
                where: { email },
                attributes: ['email', 'password', 'firstname', 'lastname', 'roleid'],
                raw: true,
            });
            let userPaswordFromDb = user.password;
            let isTruePassword = checkUserPassword(userPaswordFromDb, password);
            //check user is still available
            if (user) {
                if (isTruePassword) {
                    userData.errorCode = 0;
                    userData.message = 'Login succesfull!';
                    userData.data = { ...user, password: undefined };
                    return userData;
                } else {
                    userData.errorCode = 2;
                    userData.message = 'Wrong password, plz check your password again!';
                    return userData;
                }
            } else {
                userData.errorCode = 3;
                userData.message = 'User not found';
                return userData;
            }
        } else {
            userData.errorCode = 1;
            userData.message = 'Your mail isnt exit in our server, plz try anothor email.';
            return userData;
        }
    } catch (e) {
        return e;
    }
};
let checkUserMail = async (userEmail) => {
    // return new Promise(async (resolve, reject) => {
    //     try {
    //         let user = await db.User.findOne({ where: { email: userEmail }, raw: true });
    //         if (user) {
    //             resol ve(true);
    //         } else {
    //             resolve(false);
    //         }
    //     } catch (e) {
    //         reject(e);
    //     }
    // });

    let user = await db.User.findOne({ where: { email: userEmail }, raw: true });
    try {
        // !!user -> convert to boolean
        return !!user;
    } catch (e) {
        return e;
    }
};

let checkUserPassword = (userPasswordFromDb, userPassword) => {
    let isTruePassword = bcrypt.compareSync(userPassword, userPasswordFromDb);
    return isTruePassword;
};

let getAllUser = async (userId) => {
    try {
        let userData = '';
        if (userId) {
            if (userId === 'ALL') {
                userData = await db.User.findAll({ attributes: { exclude: ['password'] } });
            } else {
                userData = await db.User.findOne({ where: { id: userId }, attributes: { exclude: ['password'] } });
            }
        }
        return userData;
    } catch (e) {
        return e;
    }
};

let createNewUser = async (data) => {
    console.log(data);

    await emailService(data.email);

    console.log('From userService Nodejs: ', data);
    try {
        if (data) {
            let isEmailUsed = await db.User.findOne({ where: { email: data.email } });
            if (!isEmailUsed) {
                console.log('isEmailUser', isEmailUsed);
                let hashUserPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashUserPasswordFromBcrypt,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    address: data.address,
                    phonenumber: data.phonenumber,
                    gender: data.gender,
                    roleid: data.roleid,
                    positionId: data.positionid,
                    image: data.avatar,
                    // positionId: data.positionId,
                    // image: data.image,
                });
                return {
                    errorCode: 0,
                    errorMessage: 'A new user have been created successfully!',
                };
            } else {
                return {
                    errorCode: 2,
                    errorMessage: 'Email is already used, please use another email!',
                };
            }
        } else {
            return {
                errorCode: 1,
                errorMessage: 'Data not found',
            };
        }
    } catch (e) {
        return e;
    }
};

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    });
};
let updateNewUser = async (newData) => {
    console.log('newData: ', newData);
    try {
        if (newData.id) {
            let userData = await db.User.findOne({ where: { id: newData.id }, raw: false });
            console.log('Old Data: ', userData);
            if (userData) {
                userData.update({ ...newData, positionId: newData.positionid });
                await userData.save();
                return {
                    errorCode: 0,
                    errorMessage: 'User have been updated successfully',
                };
            } else {
                return {
                    errorCode: 2,
                    errorMessage: 'User dont exist, please try again',
                };
            }
        } else {
            return {
                errorCode: 1,
                errorMessage: 'Data not found',
            };
        }
    } catch (e) {
        return e;
    }
};
let deleteNewUser = async (userId) => {
    if (userId) {
        let userData = await db.User.findOne({ where: { id: userId }, raw: false });
        if (userData) {
            await userData.destroy();
            return {
                errorCode: 0,
                errorMessage: 'User had been deleted successfully!',
            };
        } else {
            return {
                errorCode: 2,
                errorMessage: 'User not found',
            };
        }
    } else {
        return {
            errorCode: 1,
            errorMessage: 'Please enter id need to remove',
        };
    }
};

// AllCode db
let getAllCode = async (type) => {
    try {
        let res = {};
        if (type) {
            let data = await db.Allcode.findAll({ where: { type: type } });
            res.errorCode = 0;
            res.data = data;
        } else {
            res.errorCode = 1;
            res.errorMessage = 'Wrong type';
        }
        return res;
    } catch (e) {
        return e;
    }
};

let postBulkCreateSchedule = () => {};
export default {
    handleUserLogin,
    getAllUser,
    createNewUser,
    updateNewUser,
    deleteNewUser,
    // allcode db
    getAllCode,
    postBulkCreateSchedule,
};
