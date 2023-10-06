// import database
import { db } from '../models';
import * as dotenv from 'dotenv';
import _ from 'lodash';
dotenv.config();
let MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;
let getTopDoctorHome = (limit) => {
    let users = db.User.findAll({
        limit: limit,
        order: [['createdAt', 'DESC']],
        attribute: {
            exclude: ['password'],
        },
        include: [
            { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
            { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
        ],
        raw: false,
        // mest: true
    });
    return users
        .then((res) => {
            /* console.log("From doctorService: ", res); */ return { errorCode: 0, data: res };
        })
        .catch((e) => {
            console.log('From doctorService Error: ', e);
            return e;
        });
};

let getAllDoctors = () => {
    try {
        let users = db.User.findAll({
            where: { roleid: 'R2' },
            attribute: {
                exclude: ['password'],
            },
        });
        console.log(users);
        return users
            .then((resp) => {
                console.log('From doctorService', resp);
                let response = {};
                console.log();

                if (resp) {
                    response = {
                        errorCode: 0,
                        data: resp,
                    };
                } else {
                    response = {
                        errorCode: 2,
                        errorMessage: 'User not found with this condition',
                    };
                }
                return response;
            })
            .catch((e) => {
                return;
                ({
                    errorCode: 1,
                    errorMessage: 'User not found',
                });
            });
    } catch (e) {
        console.log(e);
        res.status(200).json({
            errorCode: -1,
            errorMessage: 'Error from server',
        });
    }
};

let postInfoDoctor = async (input) => {
    // console.log('from doctorService', input);
    try {
        // validate
        for (let key in input) {
            if (!input[key]) {
                return {
                    errorCode: 1,
                    errorMessage: `Missing parameter ${key}`,
                };
            }
        }
        //  Save to markdown
        let users = await db.Markdown.findOne({
            where: { doctorId: input.doctorId },
            raw: false,
        });
        let textMarkdown = {};
        let textDoctorInfo = {};

        if (users) {
            users.update({
                contentMarkdown: input.contentMarkdown,
                contentHTML: input.contentHTML,
                description: input.description,
                doctorId: input.doctorId,
            });

            await users.save();
            textMarkdown = {
                errorCode: 0,
                errorMessage: 'User saved successfully from markdown',
            };
        } else {
            await db.Markdown.create({
                contentMarkdown: input.contentMarkdown,
                contentHTML: input.contentHTML,
                description: input.description,
                doctorId: input.doctorId,
            });

            textMarkdown = {
                errorCode: 0,
                errorMessage: 'A new user has been created successfully from markdown',
            };
        }
        // save to doctor infor
        let doctor = await db.Doctor_infor.findOne({
            where: { doctorId: input.doctorId },
            raw: false,
        });
        if (doctor) {
            doctor.update({
                paymentId: input.paymentId,
                provinceId: input.provinceId,
                priceId: input.priceId,
                doctorId: input.doctorId,
                addressClinic: input.addressClinic,
                nameClinic: input.nameClinic,
                note: input.note,
            });

            await users.save();
            textDoctorInfo = {
                errorCode: 0,
                errorMessage: 'User saved successfully from doctor_info',
            };
        } else {
            await db.Doctor_infor.create({
                paymentId: input.paymentId,
                provinceId: input.provinceId,
                priceId: input.priceId,
                doctorId: input.doctorId,
                addressClinic: input.addressClinic,
                nameClinic: input.nameClinic,
                note: input.note,
            });

            textDoctorInfo = {
                errorCode: 0,
                errorMessage: 'A new user has been created successfully from doctor_info',
            };
        }
        console.log('Text', textDoctorInfo, textMarkdown);

        return { errorCode: 0, errorMessage: [textDoctorInfo.errorMessage, textMarkdown.errorMessage] };
    } catch (e) {
        console.log(e);
        return {
            errorCode: -1,
            errorMessage: 'Error from server',
        };
    }
};

let getDetailDoctorByType = async (type, dataType) => {
    let typeFind = type === 'id' ? 'findOne' : 'findAll';
    try {
        let data = await db.User[typeFind]({
            where: {
                [type]: dataType,
            },
            attributes: {
                exclude: ['password'],
            },
            include: [
                {
                    model: db.Markdown,
                    attributes: ['description', 'contentMarkdown', 'contentHTML', 'doctorId'],
                },
                {
                    model: db.Allcode,
                    as: 'positionData',
                    attributes: ['valueEn', 'valueVi'],
                },
            ],

            raw: false,
            nest: true,
        });

        if (data) {
            if (data.image) {
                let imageBase64 = new Buffer(data.image, 'base64').toString('binary');
                data.image = imageBase64;
            }
            console.log(data);

            return {
                errorCode: 0,
                data: data,
            };
        } else {
            return {
                errorCode: 2,
                errorMessage: 'User not found',
            };
        }
    } catch (error) {
        console.log(error);
        return {
            errorCode: -1,
            errorMessage: 'Error from server',
        };
    }
};

let postBulkCreateSchedule = async ({ scheduleSave, doctorId, dateSelected }) => {
    try {
        console.log('From doctorService', scheduleSave);

        let dataRv = scheduleSave.map((x) => ({
            timeType: x.timeType,
            maxNumber: MAX_NUMBER_SCHEDULE,
            date: x.date,
            doctorId: x.doctocId,
        }));

        let existing = await db.Schedule.findAll({
            where: {
                doctorId: doctorId,
                date: dateSelected,
            },
            attribute: ['timeType', 'maxNumber', 'date', 'doctorId'],
        });
        console.log('existing', existing);

        if (existing && existing.length > 0) {
            existing = existing.map((x) => {
                x.date = new Date(x.date).getTime();
                return x;
            });
        }
        console.log('existing', existing);

        let diff = _.differenceWith(dataRv, existing, (a, b) => {
            return a.timeType === b.timeType && a.date === b.date;
        });
        console.log('diff', diff.length);

        if (diff && diff.length > 0) {
            await db.Schedule.bulkCreate(diff);
            return {
                errorCode: 0,
                errorMessage: 'Schedule have been updated',
            };
        } else {
            return {
                errorCode: 2,
                errorMessage: 'Schedule have been available, please choose another time',
            };
        }
    } catch (error) {
        console.log(error);
        return {
            errorCode: -1,
            errorMessage: 'Error from server',
        };
    }
};

let getScheduleByDate = async (doctorId, date) => {
    try {
        let data = await db.Schedule.findAll({
            where: {
                doctorId: doctorId,
            },
            attributes: {
                exclude: [],
            },

            raw: false,
            nest: true,
        });
        let repData = data.filter((x) => {
            let asd = new Date(x.date).getTime().toString();
            return asd === date;
        });
        if (repData) {
            return {
                errorCode: 0,
                data: repData,
            };
        } else {
            return {
                errorCode: 2,
                data: [],
            };
        }
    } catch (error) {
        console.log(error);
        return {
            errorCode: -1,
            errorMessage: 'Error from server',
        };
    }
};

let getDoctorInfor = async (doctorId) => {
    try {
        let data = await db.Doctor_infor.findOne({
            where: {
                doctorId: doctorId,
            },
            attributes: {
                exclude: ['id', 'doctorId'],
            },
            include: [
                {
                    model: db.Allcode,
                    as: 'priceIdData',
                    attributes: ['valueEn', 'valueVi'],
                },
                {
                    model: db.Allcode,
                    as: 'provinceIdData',
                    attributes: ['valueEn', 'valueVi'],
                },
                {
                    model: db.Allcode,
                    as: 'paymentIdData',
                    attributes: ['valueEn', 'valueVi'],
                },
            ],

            raw: false,
            nest: true,
        });

        if (data) {
            return {
                errorCode: 0,
                data: data,
            };
        } else {
            return {
                errorCode: 2,
            };
        }
    } catch (error) {
        console.log(error);
        return {
            errorCode: -1,
            errorMessage: 'Error from server',
        };
    }
};
export default {
    getTopDoctorHome,

    postInfoDoctor,

    getAllDoctors,

    getDetailDoctorByType,
    postBulkCreateSchedule,
    getScheduleByDate,
    getDoctorInfor,
};
