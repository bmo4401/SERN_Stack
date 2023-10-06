import bcrypt from 'bcryptjs';
import { db } from '../models/index';

const salt = bcrypt.genSaltSync(10);
let createUser = async ({ data }) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashUserPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashUserPasswordFromBcrypt,
                firstname: data.firstname,
                lastname: data.lastname,
                address: data.address,
                gender: data.gender === '1' ? true : false,
                roleid: data.roleid,
                phonenumber: data.phonenumber,
                // positionId: data.positionId,
                // image: data.image,
            });
            resolve('/get-crud');
        } catch (e) {
            reject(e);
        }
    });
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

let getAllUsers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({ raw: true });
            resolve(users);
        } catch (e) {
            reject(e);
        }
    });
};
let getUsersInforById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findOne({ where: { id }, raw: true });
            resolve(users);
        } catch (e) {
            reject(e);
        }
    });
};

let updateUserInfor = (newData) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Khong dc raw data neu ko se ko save dc
            let user = await db.User.findOne({ where: { id: newData.id }, raw: false });
            if (user) {
                user.update(newData);
                await user.save();
            }
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

let deleteUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = await db.User.findOne({ where: { id: userId }, raw: false });
            if (userData) {
                resolve(userData);
            } else {
                resolve();
            }
        } catch (e) {
            reject(e);
        }
    });
};
module.exports = { createUser, getAllUsers, getUsersInforById, updateUserInfor, deleteUserById };
