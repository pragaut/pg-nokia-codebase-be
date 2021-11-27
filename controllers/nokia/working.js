const { db } = require('../../models');
const dal = require('../../dal');
const Op = require('sequelize').Op;
const util = require('../../util');
const responseHelper = require('../../util/response.helper');
const config = require('../../config').config;
const encryptionHelper = require('../../util/encryption.helper');
const codes = require('../../util/codes').codes;
const constants = require('../../util/constants');
const emailService = require('../../util/email');
const { json } = require('express');

//#region Notification Helper //To be used in Audit notification

const sendNotification = async (invoice, notificationCode, userId) => {
    try {
        //  console.log("sendNotification invoice ; ", invoice);
        //console.log("notificationCode", notificationCode);
        db.sequelize.query('call Asp_ICR_NotificationDetails_Get_UserDetails(:invoiceId, :plantMasterId, :notificationCode)', {
            replacements: {
                invoiceId: invoice.id ? invoice.id : '',
                plantMasterId: invoice.toPlantMasterId,
                notificationCode: notificationCode
            }
        }).then(async results => {
            //console.log("results : ", results);
            let MediaDetails = '';
            const MediaDetailsresult = await getMediaDetailsBYInvoiceDetailsIdAndPaymentDetailsID(undefined, invoice.id)
            // let FullURL = "http://erp4org.com/images/EmployeeMedia/FullSize/6d6eb53a-d669-4947-af92-4c7a4de1c58e/20191212_210048.jpg"

            if (MediaDetailsresult) {
                let URL = "http://localhost:56224/api/images/";
                for (let img of MediaDetailsresult) {
                    if (img.mediaFullsizeAddress.indexOf('https://') > -1) {
                        MediaDetails = MediaDetails + '<a href="' + img.mediaFullsizeAddress + '" target="_blank" > <img src="' + img.mediaFullsizeAddress + '" style="height: 100px;"> </a> <br />';
                    }
                    else {
                        MediaDetails = MediaDetails + '<a href="' + URL + '' + img.mediaFullsizeAddress + '" target="_blank" > <img src="' + URL + '' + img.mediaFullsizeAddress + '" style="height: 100px;"> </a> <br />';
                    }
                }
            }
            //   MediaDetails = MediaDetails + '<a href="' + FullURL + '" target="_blank" > <img src=" ' + FullURL + '" style="height: 100px;"> </a>';

            let requestType = constants.TEMPLATES.TYPES.Invoice_Generated.EMAIL;
            for (let item of results) {
                const emailResult = item && await emailService.sendEmailWithTemplate(undefined, `${requestType}`, {
                    emailSubject: item.subject, emailBody: item.bodyContent,
                    MediaDetails: MediaDetails,
                    mainRemarks: (item.isInvoiceCancelled === true || item.isInvoiceCancelled === 1) && notificationCode === 'Cancel_Invoice' ? (item.cancelRemarks ? item.cancelRemarks : 'N/A') : item.description,
                    name: item.userName, invoiceNumber: item.invoiceNumber, recordNumber: item.recordNumber, rPlantName: item.rPlantName,
                    invoiceDate: item.invoiceDate, totalAmount: item.totalAmount, glCode: item.glCode, description: item.description, Vouchertype: item.Vouchertype, NatureOftransaction: item.NatureOftransaction, bodyContent: item.bodyContent
                }, item.email, 'Invoice Generated');
                //console.log("Email result : ", emailResult);
            }
            return "success";

        }).catch(err => {
            console.log("results err : ", err);
            return undefined;
        });
    }
    catch (error) {
        console.log("results error : ", error);
        return undefined;
    }
};
//#endregion

//#region  media Details  
const getMediaDetailsMasterById = async (req, res) => {
    try {
        const result = await dal.findById(db.invoiceDetails, req.query.id);

        responseHelper.success(res, codes.SUCCESS, result);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting invoice Details');
    }
};
/**
* 
* @param {*} req 
* @param {*} res 
* 
* by defaut gives last one month data.
*/
const getMediaDetails = async (req, res) => {
    try {
        let where = [];
        where.push(util.constructWheresForSequelize('active', 1));
        if (req.query.id) {
            return getMediaDetailsMasterById(req, res);
        }
        if (req.query.auditPlanDetailsId) {
            where.push(util.constructWheresForSequelize('auditPlanDetailsId', req.query.auditPlanDetailsId));
            console.log("log media where ", where)
            await dal.getList({ model: db.mediaDetails, where, order: [['createdAt', 'desc']], include: true, rowsToReturn: req.query.rows, pageIndex: req.query.pageIndex, res });

        }
        else if (req.query.scopeMasterId) {
            where.push(util.constructWheresForSequelize('scopeMasterId', req.query.scopeMasterId));
            await dal.getList({ model: db.mediaDetails, where, order: [['createdAt', 'desc']], include: true, rowsToReturn: req.query.rows, pageIndex: req.query.pageIndex, res });

        }
        else {
            await dal.getList({ model: db.mediaDetails, where, order: [['createdAt', 'desc']], include: true, rowsToReturn: req.query.rows, pageIndex: req.query.pageIndex, res });
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting Invoice Details');
    }
};
/**
* 
* @param {*} req 
* @param {*} res 
*/
const saveMediaDetails = async (req, res) => {
    try {
        const mediaDetails = req.body;
        if (util.missingRequiredFields('mediaDetails', mediaDetails, res) === '') {

            await dal.saveData(db.mediaDetails, mediaDetails, res, req.user.id);
        }
        else {
            console.log("Backend media Details Data else condition", req)
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'saving  Invoice   details');
    }
};
const saveMediaDetailsFromMultipleData = async (item, userid) => {
    try {
        await dal.saveData(db.mediaDetails, item, null, userid);

    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'saving  Invoice   details');
    }
};
const saveMultipleMediaDetails = async (req, res) => {
    try {
        const mediaDetails = req.body;
        let Notificationcode = "Invoice_Creation";
        let UserId = req.user.id ? req.user.id : '';
        const userid = req.user.id;
        const resultData = await dal.bulkCreate(db.mediaDetails, mediaDetails, UserId);
        if (mediaDetails && mediaDetails.length > 0) {
            mediaDetails.forEach(element => {
                SendMailWhenUploadingMultiFiles(element)
            })
        }
        responseHelper.success(res, 200, resultData, 'Save Supporting Document Details', resultData.id, 1);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'saving  Invoice   details');
    }
};
const deleteMediaDetails = async (req, res) => {
    try {
        if (!req.query.id) {
            throw util.generateWarning(`Please provide  media details id`, codes.ID_NOT_FOUND);
        }
        dal.deleteRecords(db.mediaDetails, req.query.id, req.user.id, res);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'deleting  Invoice Details');
    }
};
//#endregion 

//#region AISU Anteena Details

const getAntennaRotataionDetails = async (req, res) => {
    try {
        console.log("getAntennaRotataionDetails backend :", req.query)
        db.sequelize.query('call asp_nk_antenna_rotation_get_antenna_rotation_details(:p_antenna_rotation_details_id, :p_tower_antenna_id, :p_tower_id, :p_mac_or_antenna_code)',
            {
                replacements: {
                    p_antenna_rotation_details_id: req.query.id ? req.query.id : '',
                    p_tower_antenna_id: req.query.tower_antenna_id ? req.query.tower_antenna_id : '',
                    p_tower_id: req.query.tower_id ? req.query.tower_id : '',
                    p_mac_or_antenna_code: req.query.mac_or_antenna_code ? req.query.mac_or_antenna_code : ''
                }
            }).then(results => {
                responseHelper.success(res, 200, results, 'Tower antenna rotation details get successfully', '-1', results.length);
            }).catch(err => {
                responseHelper.error(res, err.code ? err.code : codes.ERROR, err, 'Error in getting tower antenna rotation details');

            });
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting tower antenna rotation details');
    }
};
const getAntennaRotationDetails_byTowerID = async (towerAntennaId, res) => {
    try {

        let where = [];
        where.push(util.constructWheresForSequelize('isActive', 1));
        where.push(util.constructWheresForSequelize('towerAntennaId', towerAntennaId));
        const resultData = await dal.getList({ model: db.antennaRotationDetails, where, order: [['createdAt', 'desc']], include: false, rowsToReturn: 1, pageIndex: 0, undefined });
        if (resultData) {
            // console.log("results ---------1----------", resultData);
            const dataoindex = resultData && resultData[0];
            return dataoindex;
        }
        else {
            return undefined;
        }

        // db.sequelize.query('call asp_nk_antenna_rotation_get_antenna_rotation_details(:p_antenna_rotation_details_id, :p_tower_antenna_id, :p_tower_id, :p_mac_or_antenna_code)',
        //     {
        //         replacements: {
        //             p_antenna_rotation_details_id: '',
        //             p_tower_antenna_id: towerAntennaId ? towerAntennaId : '',
        //             p_tower_id: '',
        //             p_mac_or_antenna_code: ''
        //         }
        //     }).then(results => {
        //         console.log("results ---------1----------", results);
        //         const dataoindex = results && results[0];
        //         console.log("results ---------2----------", dataoindex);
        //         return dataoindex;
        //         // responseHelper.success(res, 200, results, 'Tower antenna rotation details get successfully', '-1', results.length);
        //     }).catch(err => {
        //         //responseHelper.error(res, err.code ? err.code : codes.ERROR, err, 'Error in getting tower antenna rotation details');
        //         return err;
        //     });
    }
    catch (error) {
        return error;
    }
};
const _FindAntennaRotationDetailsAlreadyExistOrNot = async (towerAntennaId) => {
    //console.log("tower Antenna Id : -----", towerAntennaId);
    let where = [];
    if (towerAntennaId && towerAntennaId !== null && towerAntennaId !== 'undefined') {
        where.push(util.constructWheresForSequelize('towerAntennaId', towerAntennaId));
    }
    where.push(util.constructWheresForSequelize('isActive', 1));
    //console.log("where : *********", where);
    const antennaRotationDetails = await dal.getList({ model: db.antennaRotationDetails, where, order: [['createdAt', 'desc']], include: false, });

    if (antennaRotationDetails && antennaRotationDetails.length > 0) {
        return 'already exist'
    }
    else {
        return 'success'
    }
};
// const saveAntennaRotationDetails_FromBody = async (req, res) => {
//     try {
//         const antennaRotationDetails = req.body;
//         var antennaRotationLogsDetails = [];
//         console.log("Antenna Rotation Details : ", antennaRotationDetails);
//         if (req.user && req.user.id !== null)
//             UserId = req.user.id; 
//         const towerAntennaId = antennaRotationDetails && antennaRotationDetails.towerAntennaId ? antennaRotationDetails.towerAntennaId : undefined;
//         const ChekAlreadyExist = await _FindAntennaRotationDetailsAlreadyExistOrNot(towerAntennaId);
//         if (ChekAlreadyExist && ChekAlreadyExist !== "success") {
//             let antennsRotationDetail = await getAntennaRotationDetails_byTowerID(towerAntennaId);
//             if (antennsRotationDetail && antennsRotationDetail !== null && antennsRotationDetail.length > 0) {
//                 antennaRotationDetails.id = antennsRotationDetail.antennaRotationDetailId;
//                 let antennsRotationLogDetail = {
//                     antennaRotationDetailId: antennsRotationDetail.antennaRotationDetailId,
//                     towerAntennaId: antennsRotationDetail.towerAntennaId,
//                     macOrAntennaCode: antennsRotationDetail.macOrAntennaCode,
//                     azimuth: antennsRotationDetail.azimuth,
//                     height: antennsRotationDetail.height,
//                     direction: antennsRotationDetail.direction,
//                     tiltX: antennsRotationDetail.tiltX,
//                     tiltY: antennsRotationDetail.tiltY,
//                     tiltZ: antennsRotationDetail.tiltZ,
//                     azimuthPrev: antennsRotationDetail.azimuthPrev,
//                     heightPrev: antennsRotationDetail.heightPrev,
//                     directionPrev: antennsRotationDetail.directionPrev,
//                     tiltXPrev: antennsRotationDetail.tiltXPrev,
//                     tiltYPrev: antennsRotationDetail.tiltYPrev,
//                     tiltZPrev: antennsRotationDetail.tiltZPrev,
//                     isActive: true
//                 }
//                 antennaRotationLogsDetails.push(antennsRotationLogDetail);
//                 const saveAntennaRotationDetails = await dal.saveData(db.antennaRotationLogDetails, antennaRotationLogsDetails, undefined, UserId);
//             }
//         } 
//         if (util.missingRequiredFields('antennaRotationDetails', antennaRotationDetails, res) === '') {
//             const response = await dal.saveData(db.antennaRotationDetails, antennaRotationDetails, res, UserId);
//             responseHelper.success(res, codes.SUCCESS, "Success", 'Antenna Rotation Details Save Successfully', '-1', 1);

//         }
//         else {
//             console.log("Backend Antenna Rotation Details Data else condition", req)
//             responseHelper.success(res, codes.ERROR, "FAIL", 'Antenna Rotation Details Not Saved', '-1', 0);
//         }
//     }
//     catch (error) {
//         responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'Error in Saving Antenna Rotation Details');
//     }
// };

const saveAntennaRotationDetails_FromBody = async (req, res) => {
    try {
        const antennaRotationDetails = req.body;
        var antennaRotationLogsDetails = [];
        console.log("Antenna Rotation Details : ------------>>", antennaRotationDetails);
        if (req.body && req.body.userId !== null)
            UserId = req.body.userId;
        console.log("UserId : ------------>>", UserId);
        //const PKID = antennaRotationDetails && antennaRotationDetails.id ? antennaRotationDetails.id : undefined;
        const towerAntennaId = antennaRotationDetails && antennaRotationDetails.towerAntennaId ? antennaRotationDetails.towerAntennaId : undefined;
        const ChekAlreadyExist = await _FindAntennaRotationDetailsAlreadyExistOrNot(towerAntennaId);
        let antennsRotationDetail = undefined;
        if (ChekAlreadyExist && ChekAlreadyExist !== "success") { 
            antennsRotationDetail = await getAntennaRotationDetails_byTowerID(towerAntennaId, undefined);
            console.log("antenns Rotation Detail : ---------->>>0", antennsRotationDetail);
            if (antennsRotationDetail && antennsRotationDetail !== null && antennsRotationDetail !== 'undefined') {
                antennaRotationDetails.id = antennsRotationDetail.id;
            }
            if (util.missingRequiredFields('antennaRotationDetails', antennaRotationDetails, res) === '') {
                const response = await dal.saveData(db.antennaRotationDetails, antennaRotationDetails, undefined, UserId);
            }
        }
        else {           
            if (util.missingRequiredFields('antennaRotationDetails', antennaRotationDetails, res) === '') {
                const response = await dal.saveData(db.antennaRotationDetails, antennaRotationDetails, undefined, UserId);
            }
        }
        antennsRotationDetail = await getAntennaRotationDetails_byTowerID(towerAntennaId, undefined);
        console.log("antenns Rotation Detail : ---------->>>1", antennsRotationDetail);
        if (antennsRotationDetail && antennsRotationDetail !== null && antennsRotationDetail !== 'undefined') {
            antennaRotationDetails.id = antennsRotationDetail.id;
            let antennsRotationLogDetail = {
                antennaRotationDetailId: antennsRotationDetail.id,
                towerAntennaId: antennsRotationDetail.towerAntennaId,
                macOrAntennaCode: antennsRotationDetail.macOrAntennaCode,
                azimuth: antennsRotationDetail.azimuth,
                height: antennsRotationDetail.height,
                direction: antennsRotationDetail.direction,
                tiltX: antennsRotationDetail.tiltX,
                tiltY: antennsRotationDetail.tiltY,
                tiltZ: antennsRotationDetail.tiltZ,
                azimuthPrev: antennsRotationDetail.azimuthPrev,
                heightPrev: antennsRotationDetail.heightPrev,
                directionPrev: antennsRotationDetail.directionPrev,
                tiltXPrev: antennsRotationDetail.tiltXPrev,
                tiltYPrev: antennsRotationDetail.tiltYPrev,
                tiltZPrev: antennsRotationDetail.tiltZPrev,
                isActive: true
            }
            const saveAntennaRotationLogDetails = await dal.saveData(db.antennaRotationDetailsLog, antennsRotationLogDetail, undefined, UserId);             
            if (saveAntennaRotationLogDetails) {
                
                    responseHelper.success(res, codes.SUCCESS, "Success", 'Antenna Rotation Details Save Successfully', '-1', 1);
 
            }
            else {
                responseHelper.success(res, codes.ERROR, "FAIL", 'Antenna Rotation Details Not Saved', '-1', 0);

            }
        }
  

        //responseHelper.success(JSON.stringify(antennaRotationDetails), codes.SUCCESS, "Success",'Antenna Rotation Details Save Successfully','-1',1);
        //-----let primaryKey = 'antennaRotationDetailId';

    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'Error in Saving Antenna Rotation Details');
    }
};
const saveAntennaRotationDetails_FromQuery = async (req, res) => {
    try {
        const antennaRotationDetails = req.query;
        var antennaRotationLogsDetails = [];
        //console.log("Antenna Rotation Details : ", antennaRotationDetails);
        if (req.query && req.query.userId !== null)
            UserId = req.query.userId;
        //const PKID = antennaRotationDetails && antennaRotationDetails.id ? antennaRotationDetails.id : undefined;
        const towerAntennaId = antennaRotationDetails && antennaRotationDetails.towerAntennaId ? antennaRotationDetails.towerAntennaId : undefined;
        const ChekAlreadyExist = await _FindAntennaRotationDetailsAlreadyExistOrNot(towerAntennaId);

        if (ChekAlreadyExist && ChekAlreadyExist !== "success") {
            let antennsRotationDetail = await getAntennaRotationDetails_byTowerID(towerAntennaId, undefined);
            //console.log("antenns Rotation Detail : ----------", antennsRotationDetail);
            if (antennsRotationDetail && antennsRotationDetail !== null && antennsRotationDetail !== 'undefined') {
                antennaRotationDetails.id = antennsRotationDetail.id;
                let antennsRotationLogDetail = {
                    antennaRotationDetailId: antennsRotationDetail.id,
                    towerAntennaId: antennsRotationDetail.towerAntennaId,
                    macOrAntennaCode: antennsRotationDetail.macOrAntennaCode,
                    azimuth: antennsRotationDetail.azimuth,
                    height: antennsRotationDetail.height,
                    direction: antennsRotationDetail.direction,
                    tiltX: antennsRotationDetail.tiltX,
                    tiltY: antennsRotationDetail.tiltY,
                    tiltZ: antennsRotationDetail.tiltZ,
                    azimuthPrev: antennsRotationDetail.azimuthPrev,
                    heightPrev: antennsRotationDetail.heightPrev,
                    directionPrev: antennsRotationDetail.directionPrev,
                    tiltXPrev: antennsRotationDetail.tiltXPrev,
                    tiltYPrev: antennsRotationDetail.tiltYPrev,
                    tiltZPrev: antennsRotationDetail.tiltZPrev,
                    isActive: true
                }
                //console.log("antenns Rotation Log Detail : ---------- :", antennsRotationLogDetail);
                antennaRotationLogsDetails.push(antennsRotationLogDetail);
                const saveAntennaRotationDetails = await dal.saveData(db.antennaRotationDetailsLog, antennsRotationLogDetail, undefined, UserId);
                if (saveAntennaRotationDetails) {
                    if (util.missingRequiredFields('antennaRotationDetails', antennaRotationDetails, res) === '') {
                        const response = await dal.saveData(db.antennaRotationDetails, antennaRotationDetails, undefined, UserId);
                        responseHelper.success(res, codes.SUCCESS, "Success", 'Antenna Rotation Details Save Successfully', '-1', 1);

                    }
                    else {
                        //console.log("Backend Antenna Rotation Details Data else condition", req)
                        responseHelper.success(res, codes.ERROR, "FAIL", 'Antenna Rotation Details Not Saved', '-1', 0);
                    }
                }
                else {
                    responseHelper.success(res, codes.ERROR, "FAIL", 'Antenna Rotation Details Not Saved', '-1', 0);

                }
            }
            else {
                responseHelper.success(res, codes.ERROR, "FAIL", 'Antenna Rotation Details Not Saved', '-1', 0);

            }
        }
        else {
            if (util.missingRequiredFields('antennaRotationDetails', antennaRotationDetails, res) === '') {
                const response = await dal.saveData(db.antennaRotationDetails, antennaRotationDetails, undefined, UserId);
                responseHelper.success(res, codes.SUCCESS, "Success", 'Antenna Rotation Details Save Successfully', '-1', 1);

            }
            else {
                //console.log("Backend Antenna Rotation Details Data else condition", req)
                responseHelper.success(res, codes.ERROR, "FAIL", 'Antenna Rotation Details Not Saved', '-1', 0);
            }
        }

        //responseHelper.success(JSON.stringify(antennaRotationDetails), codes.SUCCESS, "Success",'Antenna Rotation Details Save Successfully','-1',1);
        //-----let primaryKey = 'antennaRotationDetailId';

    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'Error in Saving Antenna Rotation Details');
    }
};

//#endregion

//#region AISU Anteena Detail Logs

const getAntennaRotataionDetailLogs = async (req, res) => {
    try {
        console.log("getAntennaRotataionDetailLogs backend :", req.query)
        db.sequelize.query('call asp_nk_antenna_rotation_log_get_antenna_rotation_logs_details(:p_antenna_rotation_details_id)',
            {
                replacements: {
                    p_antenna_rotation_details_id: req.query.antennaRotationDetailId ? req.query.antennaRotationDetailId : '',
                }
            }).then(results => {
                responseHelper.success(res, 200, results, 'Tower antenna rotation detail log get successfully', '-1', results.length);
            }).catch(err => {
                responseHelper.error(res, err.code ? err.code : codes.ERROR, err, 'Error in getting tower antenna rotation detail logs');

            });
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting tower antenna rotation detail logs');
    }
};
//#endregion

//#region Device Location Details

const getDeviceLocationDetails = async (req, res) => {
    try {
        console.log("getDeviceLocationDetails backend :", req.query)
        db.sequelize.query('call asp_nk_device_location_get_device_location_details(:p_device_location_detail_id, :p_device_registration_detail_id, :p_mac_address)',
            {
                replacements: {
                    p_device_location_detail_id: req.query.id ? req.query.id : '',
                    p_device_registration_detail_id: req.query.deviceRegistrationDetailsId ? req.query.deviceRegistrationDetailsId : '',
                    p_mac_address: req.query.macAddress ? req.query.macAddress : '',
                }
            }).then(results => {
                responseHelper.success(res, 200, results, 'Device Location details get successfully', '-1', results.length);
            }).catch(err => {
                responseHelper.error(res, err.code ? err.code : codes.ERROR, err, 'Error in getting tower device location details');
            });
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting tower device location details');
    }
};

//#endregion


module.exports.saveMediaDetails = saveMediaDetails;
module.exports.deleteMediaDetails = deleteMediaDetails;
module.exports.getMediaDetails = getMediaDetails;

module.exports.getAntennaRotataionDetails = getAntennaRotataionDetails;
module.exports.getAntennaRotataionDetailLogs = getAntennaRotataionDetailLogs;

module.exports.getDeviceLocationDetails = getDeviceLocationDetails;

module.exports.saveAntennaRotationDetails_FromBody = saveAntennaRotationDetails_FromBody;
module.exports.saveAntennaRotationDetails_FromQuery = saveAntennaRotationDetails_FromQuery;


module.exports.saveMultipleMediaDetails = saveMultipleMediaDetails;
