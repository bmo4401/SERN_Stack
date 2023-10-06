import userServices from '../services/userServices';
let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    let userData = await userServices.handleUserLogin(email, password);

    return res.status(200).json({ userData });
};

let handleGetAllUser = async (req, res) => {
    let userId = req.query.id; //All, Single
    let data;
    if (userId) {
        data = await userServices.getAllUser(userId);
        return res.status(200).json({
            errorCode: 0,
            errorMessage: 'ok',
            data,
        });
    } else {
        return res.status(200).json({
            errorCode: 1,
            errorMessage: 'ID not found',
            data,
        });
    }
};

let handleCreateNewUser = async (req, res) => {
    let message = await userServices.createNewUser(req.body);
    return res.status(200).json(message);
};

let handleEditUser = async (req, res) => {
    console.log('From userController', req.body);
    let message = await userServices.updateNewUser(req.body);
    return res.status(200).json(message);
};
let handleDeleteUser = async (req, res) => {
    let message = await userServices.deleteNewUser(req.body.id);
    return res.status(200).json(message);
};

// Allcode db
let getAllCode = async (req, res) => {
    try {
        let data = await userServices.getAllCode(req.query.type);
        return res.status(200).json(data);
    } catch (e) {
        return res.status(200).json({
            errorCode: -1,
            errorMessage: 'Error from server',
        });
    }
};
export default {
    handleLogin,
    handleGetAllUser,
    handleCreateNewUser,
    handleEditUser,
    handleDeleteUser,
    getAllCode,
};
