import express from 'express';
import homeController from '../controllers/homeController';
import userController from '../controllers/userController';
import doctorController from '../controllers/doctorController';

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/create-crud', homeController.createCRUD);
    router.get('/get-crud', homeController.displayCRUD);
    router.get('/edit-crud', homeController.editCRUD);
    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);
    router.post('/post-crud', homeController.postCRUD);
    // Use by ReactJs
    // Login
    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleGetAllUser);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);
    router.get('/api/allcode', userController.getAllCode);

    // Get home api
    router.get('/api/top-home-controller', doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctors', doctorController.getAllDoctors);
    router.post('/api/save-info-doctors', doctorController.postInfoDoctor);
    router.get('/api/get-detail-doctor-by-type', doctorController.getDetailDoctorByType);
    router.post('/api/bulk-create-schedule', doctorController.postBulkCreateSchedule);
    // Detal doctor
    router.get('/api/get-schedule-by-date', doctorController.getScheduleByDate);
    router.get('/api/get-doctor-infor', doctorController.getDoctorInfor);

    return app.use('/', router);
};

module.exports = initWebRoutes;
