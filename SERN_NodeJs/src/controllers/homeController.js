import { db } from '../models/index';
import * as crudServices from '../services/crudServices.js';
let getHomePage = async (req, res) => {
    // setup trong view engine
    try {
        const data = await db.User.findAll();
        return res.render('homePage.ejs', {
            data: JSON.stringify(data),
        });
    } catch (e) {
        console.log(e);
    }
};

let createCRUD = async (req, res) => {
    // setup trong view engine
    try {
        const data = await db.User.findAll({ raw: true });
        return res.render('createCRUD.ejs', {
            data: JSON.stringify(data),
        });
    } catch (e) {
        console.log(e);
    }
};

let displayCRUD = async (req, res) => {
    let data = await crudServices.getAllUsers();
    return res.render('displayCRUD.ejs', { data });
};
let editCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        let userData = await crudServices.getUsersInforById(userId);
        if (userData) {
            return res.render('editCRUD.ejs', { userData });
        }
    } else {
        return res.send('User not found');
    }
};
let putCRUD = async (req, res) => {
    let newData = req.body;
    await crudServices.updateUserInfor(newData);
    res.redirect('/get-crud');
};
let deleteCRUD = async (req, res) => {
    let userId = req.query.id;
    let userData = await crudServices.deleteUserById(userId);
    if (userData) {
        await userData.destroy();

        return res.redirect('/get-crud');
    }
};
let postCRUD = async (req, res) => {
    let message = await crudServices.createUser({ data: req.body });
    res.redirect(message);
};

module.exports = {
    getHomePage,
    createCRUD,
    postCRUD,
    displayCRUD,
    editCRUD,
    deleteCRUD,
    putCRUD,
};
