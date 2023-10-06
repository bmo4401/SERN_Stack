// import file
import doctorService from '../services/doctorService';
let getTopDoctorHome = (req, res) => {
    console.log(req.query);
    let limit = req.query.limit;
    if (!limit) {
        limit = 10;
    }
    let response = doctorService
        .getTopDoctorHome(+limit)
        .then((resp) => {
            console.log('From doctorController: ', resp);
            return res.status(200).json(resp);
        })
        .catch((e) => {
            {
                console.log(e);
                return res.status(200).json({ errorCode: -1, errorMessage: 'Error from server' });
            }
        });
};

let getAllDoctors = (req, res) => {
    try {
        doctorService
            .getAllDoctors()
            .then((resp) => {
                res.status(200).json(resp);
            })
            .catch((e) => {
                console.log(e);
                res.status(200).json(e);
            });
    } catch (error) {
        res.status(200).json({
            errorCode: -1,
            errorMessage: 'Error from server',
        });
    }
};

let postInfoDoctor = async (req, res) => {
    // console.log('from doctorController', req.body);
    try {
        let response = await doctorService.postInfoDoctor(req.body);
        console.log(response);

        return res.status(200).json(response);
    } catch (error) {
        console.log(error);

        res.status(200).json({
            errorCode: -1,
            errorMessage: 'Error from server',
        });
    }
};

let getDetailDoctorByType = async (req, res) => {
    console.log(req.query);
    try {
        if (!req.query.type) {
            return res.status(200).json({
                errorCode: 1,
                errorMessage: 'Missing parameter',
            });
        } else {
            let response = await doctorService.getDetailDoctorByType(req.query.type, req.query.dataType);
            return res.status(200).json(response);
        }
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errorCode: -1,
            errorMessage: 'Error from server',
        });
    }
};

let postBulkCreateSchedule = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(200).json({
                errorCode: 1,
                errorMessage: 'Missing parameter',
            });
        } else {
            let response = await doctorService.postBulkCreateSchedule(req.body);
            return res.status(200).json(response);
        }
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errorCode: -1,
            errorMessage: 'Error from server',
        });
    }
};

let getScheduleByDate = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(200).json({
                errorCode: 1,
                errorMessage: 'Missing parameter',
            });
        } else {
            let response = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date);
            return res.status(200).json(response);
        }
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errorCode: -1,
            errorMessage: 'Error from server',
        });
    }
};

let getDoctorInfor = async (req, res) => {
    try {
        if (!req.query) {
            return res.status(200).json({
                errorCode: 1,
                errorMessage: 'Missing parameter',
            });
        } else {
            let response = await doctorService.getDoctorInfor(req.query.doctorId);

            return res.status(200).json(response);
        }
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errorCode: -1,
            errorMessage: 'Error from server',
        });
    }
};
export default {
    getTopDoctorHome,
    getAllDoctors,
    postInfoDoctor,
    getDetailDoctorByType,
    postBulkCreateSchedule,
    getScheduleByDate,
    getDoctorInfor,
};
