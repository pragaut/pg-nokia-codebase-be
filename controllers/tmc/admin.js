const { db } = require('../../models');
const dal = require('../../dal');
const util = require('../../util');
const responseHelper = require('../../util/response.helper');
const codes = require('../../util/codes').codes;


//#region  Notification Master  
const getNotificationDetailsMasterById = async (req, res) => {
    try {
        const result = await dal.findById(db.notificationDetails, req.query.id);

        responseHelper.success(res, codes.SUCCESS, result);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting Notification Master');
    }
};

const _findNotificationDetailsWithCode = async (Code, isActive, id) => {
    let where = [];
    if (id && id !== null && id !== 'undefined') {
        where.push(util.constructWheresForNotEqualSequelize('id', id));
    }
    where.push(util.constructWheresForSequelize('active', 1));
    where.push(util.constructWheresForSequelize('notificationCode', Code));
    const notificationDetails = await dal.getList({ model: db.notificationDetails, where, order: [['createdAt', 'desc']], include: false, });
    if (notificationDetails && notificationDetails.length > 0) {
        return 'already exist'
    }
    else {
        return 'success'
    }
};


/**
* 
* @param {*} req 
* @param {*} res 
* 
* by defaut gives last one month data.
*/
const getNotificationDetailsMaster = async (req, res) => {
    try {
        let where = [];
        where.push(util.constructWheresForSequelize('active', 1));
        // if (req.query.id) {
        //     return getNotificationDetailsMasterById(req, res);
        // }
        // else {
        //     await dal.getList({ model: db.notificationDetails, where, order: [['notificationName', 'asc']], include: true, rowsToReturn: req.query.rows, pageIndex: req.query.pageIndex, res });
        // }

        if (req.query.id) {
            return getNotificationDetailsMasterById(req, res);
        }
        else {
            db.sequelize.query('call asp_NotificationDetails_Get_NotificationDetails(:NotificationDetailsID, :NotificationCode)', {
                replacements: { NotificationDetailsID: '', NotificationCode: '' }
            }).then(results => {
                console.log("Notification results : ", results);
                responseHelper.success(res, 200, results, 'Notification master List successfully', '-1', results.length);
            }).catch(err => {
                responseHelper.error(res, err.code ? err.code : codes.ERROR, err, 'Error in Master Category List  details');
            });
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting Notifications');
    }
};

/**
* 
* @param {*} req 
* @param {*} res 
*/
const saveNotificationDetailsMaster = async (req, res) => {
    try {
        const notificationDetails = req.body;
        //console.log("Notification details ", notificationDetails)

        // if (typeof notificationDetails.id === 'undefined') {
        //     const _notificationDetailsWithCode = await _findNotificationDetailsWithCode(notificationDetails.notificationCode, true);
        //     if (notificationDetails && _notificationDetailsWithCode && notificationDetails.notificationCode === _notificationDetailsWithCode.notificationCode) throw util.generateWarning('Notification Code already in use', codes.CODE_ALREADY_EXISTS);
        // }
        let PKID = notificationDetails && notificationDetails.id ? notificationDetails.id : undefined;
        const ChekAlreadyExist = await _findNotificationDetailsWithCode(notificationDetails.notificationCode, true, PKID)
        if (ChekAlreadyExist && ChekAlreadyExist !== "success") throw util.generateWarning('Notification Code already in use', codes.CODE_ALREADY_EXISTS);

        if (util.missingRequiredFields('notificationDetails', notificationDetails, res) === '') {
            await dal.saveData(db.notificationDetails, notificationDetails, res, req.user.id);
        }
        else {
            console.log("Backend notificationDetails Data else condition", req)
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'saving Notification details');
    }
};

const deleteNotificationDetailsMaster = async (req, res) => {
    try {
        //console.log("delete Due Day req : ", req);
        if (!req.query.id) {
            throw util.generateWarning(`Please provide notification details id`, codes.ID_NOT_FOUND);
        }
        dal.deleteRecords(db.notificationDetails, req.query.id, req.user.id, res);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'deleting Notification details');
    }
};

//#endregion

//#region  Supporting Document Master  
const getSupportingDocumentMasterById = async (req, res) => {
    try {
        const result = await dal.findById(db.supportingDocumentMaster, req.query.id);

        responseHelper.success(res, codes.SUCCESS, result);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting Supporting Document Master');
    }
};

const _findSupportingDocumentMasterWithCode = async (documentCategoryId, documentCode, isActive) => {
    const where = {};

    typeof isActive === 'undefined' ? '' : where.active = isActive;
    where.documentCategoryId = documentCategoryId;
    where.documentCode = documentCode;
    //  where.duration = duration;
    const supportingDocumentMaster = await dal.findOne(db.supportingDocumentMaster, where, true);

    return supportingDocumentMaster;
};


/**
* 
* @param {*} req 
* @param {*} res 
* 
* by defaut gives last one month data.
*/
const getSupportingDocumentMaster = async (req, res) => {
    try {
        let where = [];
        where.push(util.constructWheresForSequelize('active', 1));
        if (req.query.id) {
            return getSupportingDocumentMasterById(req, res);
        }
        else {
            return await dal.getList({ model: db.supportingDocumentMaster, where, order: [['createdAt', 'desc']], include: true, rowsToReturn: req.query.rows, pageIndex: req.query.pageIndex, res });

        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting Supporting Document Master');
    }
};

/**
* 
* @param {*} req 
* @param {*} res 
*/
const saveSupportingDocumentMaster = async (req, res) => {
    try {
        const supportingDocumentMaster = req.body;
        if (typeof supportingDocumentMaster.id === 'undefined') {
            const _supportingDocumentMasterWithCode = await _findSupportingDocumentMasterWithCode(supportingDocumentMaster.documentCategoryId, supportingDocumentMaster.durationCode, true);
            if (supportingDocumentMaster && _supportingDocumentMasterWithCode && supportingDocumentMaster.documentCode === _supportingDocumentMasterWithCode.documentCode && supportingDocumentMaster.documentCategoryId === _supportingDocumentMasterWithCode.documentCategoryId) throw util.generateWarning('escalation  duration  already in use', codes.CODE_ALREADY_EXISTS);
        }
        if (util.missingRequiredFields('supportingDocumentMaster', supportingDocumentMaster, res) === '') {
            await dal.saveData(db.supportingDocumentMaster, supportingDocumentMaster, res, req.user.id);
        }
        else {
            console.log("Backend Supporting Document Master Data else condition", req)
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'saving Supporting Document Master');
    }
};

const deleteSupportingDocumentMaster = async (req, res) => {
    try {
        if (!req.query.id) {
            throw util.generateWarning(`Please provide Supporting Document Masterid`, codes.ID_NOT_FOUND);
        }
        dal.deleteRecords(db.supportingDocumentMaster, req.query.id, req.user.id, res);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'deleting Supporting Document Master');
    }
};

//#endregion 

//#region  Tower Master  
const getTowerMasterById = async (req, res) => {
    try {
        const result = await dal.findById(db.towerMaster, req.query.id);

        responseHelper.success(res, codes.SUCCESS, result);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting Tower master data');
    }
};
/**
* 
* @param {*} req 
* @param {*} res 
* 
* by defaut gives last one month data.
*/
const getTowerMaster = async (req, res) => {
    try {
        let where = [];
        where.push(util.constructWheresForSequelize('isActive', 1));
        if (req.query.id) {
            return getTowerMasterById(req, res);
        }
        else {
            db.sequelize.query('call asp_nk_cm_tower_get_tower_details(:p_tower_id)',
                {
                    replacements: {
                        p_tower_id: req.query.id ? req.query.id : ''
                    }
                }).then(results => {
                    responseHelper.success(res, 200, results, 'Tower Details List got successfully', '-1', results.length);
                }).catch(err => {
                    responseHelper.error(res, err.code ? err.code : codes.ERROR, err, 'Error in Tower Details');

                });
        }
        // else {
        //     console.log("getTowerMaster", req.query)
        //     const result = await dal.getList({ model: db.towerMaster, where, order: [['createdAt', 'desc']], include: true, rowsToReturn: req.query.rows, pageIndex: req.query.pageIndex, undefined });
        //     console.log("result", result);
        //     responseHelper.success(res, codes.SUCCESS, result,'Tower Master Data','-1',result.length);
        // }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting Tower details');
    }
};

// const getLastAlarmTypeOrder = async (isActive) => {
//     try {
//         const towerMaster = await db.towerMaster.findOne({
//             order: [['`alarmTypeOrder`', 'desc']],
//             limit: 1,
//             where: {
//                 is_active: 1
//             },
//             attributes: ['alarmTypeOrder']
//         });

//         return alarmTypeMaster;
//     }
//     catch (error) {
//         return undefined;
//     }
// };
/**
* 
* @param {*} req 
* @param {*} res 
*/

const _FindTowerMasterAlreadyExistOrNot = async (id, siteName) => {
    let where = [];
    if (id && id !== null && id !== 'undefined') {
        where.push(util.constructWheresForNotEqualSequelize('id', id));
    }
    where.push(util.constructWheresForSequelize('isActive', 1));
    where.push(util.constructWheresForSequelize('siteName', siteName));

    const towerMasterDetails = await dal.getList({ model: db.towerMaster, where, order: [['createdAt', 'desc']], include: false, });
    if (towerMasterDetails && towerMasterDetails.length > 0) {
        return 'already exist'
    }
    else {
        return 'success'
    }
}

const saveTowerMaster = async (req, res) => {
    try {
        const towerMaster = req.body;


        console.log("Tower Master : ", towerMaster);
        const PKID = towerMaster && towerMaster.id ? towerMaster.id : undefined;
        const ChekAlreadyExist = await _FindTowerMasterAlreadyExistOrNot(PKID, towerMaster.siteName);
        let CodeMsg = towerMaster && towerMaster.siteName ? 'Tower  "' + towerMaster.siteName + '" already in use' : 'Tower code already in use';
        if (ChekAlreadyExist && ChekAlreadyExist !== "success") throw util.generateWarning(CodeMsg, codes.CODE_ALREADY_EXISTS);

        // let lastOrder = 0;
        // if (alarmTypeMaster.alarmTypeOrder == null) {
        //     lastOrder = await getLastAlarmTypeOrder(true);
        //     if (lastOrder && lastOrder.alarmTypeOrder)
        //     alarmTypeMaster.alarmTypeOrder = lastOrder.alarmTypeOrder + 1;
        //     else
        //     alarmTypeMaster.alarmTypeOrder = 1;
        // }
        console.log("req : ", req.user);
        if (req.user && req.user.id !== null)
            UserId = req.user.id;
        //-----let primaryKey = 'tower_id';
        if (util.missingRequiredFields('towerMaster', towerMaster, res) === '') {
            //----- await dal.saveData(db.towerMaster, towerMaster, res, UserId, undefined, undefined, undefined, primaryKey);
            await dal.saveData(db.towerMaster, towerMaster, res, UserId);
        }
        else {
            console.log("Backend Tower master Data else condition", req)
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'saving Tower master details');
    }
};

const deleteTowerMaster = async (req, res) => {
    try {
        if (req.user && req.user.id !== null)
            UserId = req.user.id;
        if (!req.query.id) {
            throw util.generateWarning(`Please provide Tower master id`, codes.ID_NOT_FOUND);
        }
        dal.deleteRecords(db.towerMaster, req.query.id, UserId, res);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'deleting Tower master details');
    }
};

//#endregion

//#region  Tower Allotment Master  
const getTowerAllotmentMasterById = async (req, res) => {
    try {
        const result = await dal.findById(db.towerAllotmentMaster, req.query.id);

        responseHelper.success(res, codes.SUCCESS, result);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting Tower Allotment Master data');
    }
};
/**
* 
* @param {*} req 
* @param {*} res 
* 
* by defaut gives last one month data.
*/
const getTowerAllotmentMaster = async (req, res) => {
    try {
        let where = [];
        where.push(util.constructWheresForSequelize('isActive', 1));
        if (req.query.id) {
            return getTowerAllotmentMasterById(req, res);
        }
        else {
            console.log("getTowerAllotmentMaster", req.query)
            const result = await dal.getList({ model: db.towerAllotmentMaster, where, order: [['createdAt', 'desc']], include: true, rowsToReturn: req.query.rows, pageIndex: req.query.pageIndex, undefined });
            console.log("result", result);
            responseHelper.success(res, codes.SUCCESS, result,'Tower Allotment Master Data','-1',result.length);
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting Tower Allotment details');
    }
};

// const getLastTowerAllotmentOrder = async (isActive) => {
//     try {
//         const towerAllotmentMaster = await db.towerAllotmentMaster.findOne({
//             order: [['`towerAllotmentOrder`', 'desc']],
//             limit: 1,
//             where: {
//                 is_active: 1
//             },
//             attributes: ['towerAllotmentOrder']
//         });

//         return towerAllotmentMaster;
//     }
//     catch (error) {
//         return undefined;
//     }
// };
/**
* 
* @param {*} req 
* @param {*} res 
*/

const _FindTowerAllotmentMasterAlreadyExistOrNot = async (id, orgDetailsId) => {
    let where = [];
    if (id && id !== null && id !== 'undefined') {
        where.push(util.constructWheresForNotEqualSequelize('id', id));
    }
    where.push(util.constructWheresForSequelize('isActive', 1));
    where.push(util.constructWheresForSequelize('orgDetailsId', orgDetailsId));

    const towerAllotmentMasterDetails = await dal.getList({ model: db.towerAllotmentMaster, where, order: [['createdAt', 'desc']], include: false, });
    if (towerAllotmentMasterDetails && towerAllotmentMasterDetails.length > 0) {
        return 'already exist'
    }
    else {
        return 'success'
    }
}

const saveTowerAllotmentMaster = async (req, res) => {
    try {
        const towerAllotmentMaster = req.body;


        console.log("Tower Master : ", towerAllotmentMaster);
        const PKID = towerAllotmentMaster && towerAllotmentMaster.id ? towerAllotmentMaster.id : undefined;
        const ChekAlreadyExist = await _FindTowerAllotmentMasterAlreadyExistOrNot(PKID, towerAllotmentMaster.orgDetailsId);
        let CodeMsg = towerAllotmentMaster && towerAllotmentMaster.orgDetailsId ? 'Tower  "' + towerAllotmentMaster.orgDetailsId + '" already in use' : 'Tower allotment already in use';
        if (ChekAlreadyExist && ChekAlreadyExist !== "success") throw util.generateWarning(CodeMsg, codes.CODE_ALREADY_EXISTS);

        // let lastOrder = 0;
        // if (towerAllotmentMaster.towerAllotmentOrder == null) {
        //     lastOrder = await getLastTowerAllotmentOrder(true);
        //     if (lastOrder && lastOrder.towerAllotmentOrder)
        //     towerAllotmentMaster.towerAllotmentOrder = lastOrder.towerAllotmentOrder + 1;
        //     else
        //     towerAllotmentMaster.towerAllotmentOrder = 1;
        // }
        console.log("req : ", req.user);
        if (req.user && req.user.id !== null)
            UserId = req.user.id;
        //-----let primaryKey = 'tower_id';
        if (util.missingRequiredFields('towerAllotmentMaster', towerAllotmentMaster, res) === '') {
            //----- await dal.saveData(db.towerAllotmentMaster, towerAllotmentMaster, res, UserId, undefined, undefined, undefined, primaryKey);
            await dal.saveData(db.towerAllotmentMaster, towerAllotmentMaster, res, UserId);
        }
        else {
            console.log("Backend Tower Allotment master Data else condition", req)
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'saving Tower Allotment master details');
    }
};

const deleteTowerAllotmentMaster = async (req, res) => {
    try {
        if (req.user && req.user.id !== null)
            UserId = req.user.id;
        if (!req.query.id) {
            throw util.generateWarning(`Please provide Tower Allotment master id`, codes.ID_NOT_FOUND);
        }
        dal.deleteRecords(db.towerAllotmentMaster, req.query.id, UserId, res);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'deleting Tower Allotment master details');
    }
};

//#endregion

//#region  Tower Antennas Master  
const getTowerAntennasMasterById = async (req, res) => {
    try {
        const result = await dal.findById(db.towerAntennasMaster, req.query.id);

        responseHelper.success(res, codes.SUCCESS, result);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting Tower Antennas Master data');
    }
};
/**
* 
* @param {*} req 
* @param {*} res 
* 
* by defaut gives last one month data.
*/
const getTowerAntennasMaster = async (req, res) => {
    try {
        let where = [];
        where.push(util.constructWheresForSequelize('isActive', 1));
        if (req.query.id) {
            return getTowerAntennasMasterById(req, res);
        }
        else {
            console.log("getTowerAntennasMaster", req.query)
            const result = await dal.getList({ model: db.towerAntennasMaster, where, order: [['createdAt', 'desc']], include: true, rowsToReturn: req.query.rows, pageIndex: req.query.pageIndex, undefined });
            console.log("result", result);
            responseHelper.success(res, codes.SUCCESS, result,'Tower Antennas Master Data','-1',result.length);
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting Tower Antennas details');
    }
};

// const getLastAlarmTypeOrder = async (isActive) => {
//     try {
//         const towerAntennasMaster = await db.towerAntennasMaster.findOne({
//             order: [['`alarmTypeOrder`', 'desc']],
//             limit: 1,
//             where: {
//                 is_active: 1
//             },
//             attributes: ['alarmTypeOrder']
//         });

//         return towerAntennasMaster;
//     }
//     catch (error) {
//         return undefined;
//     }
// };
/**
* 
* @param {*} req 
* @param {*} res 
*/

const _FindTowerAntennasMasterAlreadyExistOrNot = async (id, antennaName) => {
    let where = [];
    if (id && id !== null && id !== 'undefined') {
        where.push(util.constructWheresForNotEqualSequelize('id', id));
    }
    where.push(util.constructWheresForSequelize('isActive', 1));
    where.push(util.constructWheresForSequelize('antennaName', antennaName));

    const towerAntennasMasterDetails = await dal.getList({ model: db.towerAntennasMaster, where, order: [['createdAt', 'desc']], include: false, });
    if (towerAntennasMasterDetails && towerAntennasMasterDetails.length > 0) {
        return 'already exist'
    }
    else {
        return 'success'
    }
}

const saveTowerAntennasMaster = async (req, res) => {
    try {
        const towerAntennasMaster = req.body;


        console.log("Tower Master : ", towerAntennasMaster);
        const PKID = towerAntennasMaster && towerAntennasMaster.id ? towerAntennasMaster.id : undefined;
        const ChekAlreadyExist = await _FindTowerAntennasMasterAlreadyExistOrNot(PKID, towerAntennasMaster.antennaName);
        let CodeMsg = towerAntennasMaster && towerAntennasMaster.antennaName ? 'Tower  "' + towerAntennasMaster.antennaName + '" already in use' : 'Tower Antennas already in use';
        if (ChekAlreadyExist && ChekAlreadyExist !== "success") throw util.generateWarning(CodeMsg, codes.CODE_ALREADY_EXISTS);

        // let lastOrder = 0;
        // if (alarmTypeMaster.alarmTypeOrder == null) {
        //     lastOrder = await getLastAlarmTypeOrder(true);
        //     if (lastOrder && lastOrder.alarmTypeOrder)
        //     alarmTypeMaster.alarmTypeOrder = lastOrder.alarmTypeOrder + 1;
        //     else
        //     alarmTypeMaster.alarmTypeOrder = 1;
        // }
        console.log("req : ", req.user);
        if (req.user && req.user.id !== null)
            UserId = req.user.id;
        //-----let primaryKey = 'tower_id';
        if (util.missingRequiredFields('towerAntennasMaster', towerAntennasMaster, res) === '') {
            //----- await dal.saveData(db.towerAntennasMaster, towerAntennasMaster, res, UserId, undefined, undefined, undefined, primaryKey);
            await dal.saveData(db.towerAntennasMaster, towerAntennasMaster, res, UserId);
        }
        else {
            console.log("Backend Tower Antennas master Data else condition", req)
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'saving Tower Antennas master details');
    }
};

const deleteTowerAntennasMaster = async (req, res) => {
    try {
        if (req.user && req.user.id !== null)
            UserId = req.user.id;
        if (!req.query.id) {
            throw util.generateWarning(`Please provide Tower Antennas master id`, codes.ID_NOT_FOUND);
        }
        dal.deleteRecords(db.towerAntennasMaster, req.query.id, UserId, res);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'deleting Tower Antennas master details');
    }
};

//#endregion

//#region  Device Registration Master  
const getDeviceRegistrationMasterById = async (req, res) => {
    try {
        const result = await dal.findById(db.deviceRegistrationMaster, req.query.id);

        responseHelper.success(res, codes.SUCCESS, result);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting Device Registration Master data');
    }
};
/**
* 
* @param {*} req 
* @param {*} res 
* 
* by defaut gives last one month data.
*/
const getDeviceRegistrationMaster = async (req, res) => {
    try {
        let where = [];
        where.push(util.constructWheresForSequelize('isActive', 1));
        if (req.query.id) {
            return getDeviceRegistrationMasterById(req, res);
        }
        else {
            console.log("getDeviceRegistrationMaster", req.query)
            const result = await dal.getList({ model: db.deviceRegistrationMaster, where, order: [['createdAt', 'desc']], include: true, rowsToReturn: req.query.rows, pageIndex: req.query.pageIndex, undefined });
            console.log("result", result);
            responseHelper.success(res, codes.SUCCESS, result,'Device Registration Master Data','-1',result.length);
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting Device Registration details');
    }
};

// const getLastAlarmTypeOrder = async (isActive) => {
//     try {
//         const deviceRegistrationMaster = await db.deviceRegistrationMaster.findOne({
//             order: [['`alarmTypeOrder`', 'desc']],
//             limit: 1,
//             where: {
//                 is_active: 1
//             },
//             attributes: ['alarmTypeOrder']
//         });

//         return deviceRegistrationMaster;
//     }
//     catch (error) {
//         return undefined;
//     }
// };
/**
* 
* @param {*} req 
* @param {*} res 
*/

const _FindDeviceregistrationMasterAlreadyExistOrNot = async (id, macAddress) => {
    let where = [];
    if (id && id !== null && id !== 'undefined') {
        where.push(util.constructWheresForNotEqualSequelize('id', id));
    }
    where.push(util.constructWheresForSequelize('isActive', 1));
    where.push(util.constructWheresForSequelize('macAddress', macAddress));

    const deviceregistrationMasterDetails = await dal.getList({ model: db.deviceRegistrationMaster, where, order: [['createdAt', 'desc']], include: false, });
    if (deviceregistrationMasterDetails && deviceregistrationMasterDetails.length > 0) {
        console.log("deviceregistrationMasterDetails : 1 >",deviceregistrationMasterDetails);
        return 'already exist'
    }
    else {
        console.log("deviceregistrationMasterDetails : 2 >",deviceregistrationMasterDetails);
        return 'success'
    }
}
const saveDeviceRegistrationMaster = async (req, res) => {
    try {
        const deviceRegistrationMaster = req.body;


        console.log("Device Registration : ", deviceRegistrationMaster);
        const PKID = deviceRegistrationMaster && deviceRegistrationMaster.id ? deviceRegistrationMaster.id : undefined;
        const ChekAlreadyExist = await _FindDeviceregistrationMasterAlreadyExistOrNot(PKID, deviceRegistrationMaster.macAddress);
        let CodeMsg = deviceRegistrationMaster && deviceRegistrationMaster.orgDetailsId ? 'Device Registration "' + deviceRegistrationMaster.macAddress + '" already in use' : 'Device Registration already in use';
        if (ChekAlreadyExist && ChekAlreadyExist !== "success") throw util.generateWarning(CodeMsg, codes.CODE_ALREADY_EXISTS);

        // let lastOrder = 0;
        // if (alarmTypeMaster.alarmTypeOrder == null) {
        //     lastOrder = await getLastAlarmTypeOrder(true);
        //     if (lastOrder && lastOrder.alarmTypeOrder)
        //     alarmTypeMaster.alarmTypeOrder = lastOrder.alarmTypeOrder + 1;
        //     else
        //     alarmTypeMaster.alarmTypeOrder = 1;
        // }
        console.log("req : ", req.user);
        if (req.user && req.user.id !== null)
            UserId = req.user.id;
        //-----let primaryKey = 'tower_id';
        if (util.missingRequiredFields('deviceRegistrationMaster', deviceRegistrationMaster, res) === '') {
            //----- await dal.saveData(db.deviceRegistrationMaster, deviceRegistrationMaster, res, UserId, undefined, undefined, undefined, primaryKey);
            await dal.saveData(db.deviceRegistrationMaster, deviceRegistrationMaster, res, UserId);
        }
        else {
            console.log("Backend Device Registration master Data else condition", req)
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'saving Device Registration master details');
    }
};
const deleteDeviceRegistrationMaster = async (req, res) => {
    try {
        if (req.user && req.user.id !== null)
            UserId = req.user.id;
        if (!req.query.id) {
            throw util.generateWarning(`Please provide Device Registration master id`, codes.ID_NOT_FOUND);
        }
        dal.deleteRecords(db.deviceRegistrationMaster, req.query.id, UserId, res);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'deleting Device Registration master details');
    }
};
//#endregion
 
module.exports.saveNotificationDetailsMaster = saveNotificationDetailsMaster;
module.exports.deleteNotificationDetailsMaster = deleteNotificationDetailsMaster;
module.exports.getNotificationDetailsMaster = getNotificationDetailsMaster;


module.exports.saveSupportingDocumentMaster = saveSupportingDocumentMaster;
module.exports.deleteSupportingDocumentMaster = deleteSupportingDocumentMaster;
module.exports.getSupportingDocumentMaster = getSupportingDocumentMaster;

module.exports.saveTowerMaster = saveTowerMaster;
module.exports.deleteTowerMaster = deleteTowerMaster;
module.exports.getTowerMaster = getTowerMaster;

module.exports.saveTowerAllotmentMaster = saveTowerAllotmentMaster;
module.exports.deleteTowerAllotmentMaster = deleteTowerAllotmentMaster;
module.exports.getTowerAllotmentMaster = getTowerAllotmentMaster;

module.exports.saveTowerAntennasMaster = saveTowerAntennasMaster;
module.exports.deleteTowerAntennasMaster = deleteTowerAntennasMaster;
module.exports.getTowerAntennasMaster = getTowerAntennasMaster;

module.exports.saveDeviceRegistrationMaster = saveDeviceRegistrationMaster;
module.exports.deleteDeviceRegistrationMaster = deleteDeviceRegistrationMaster;
module.exports.getDeviceRegistrationMaster = getDeviceRegistrationMaster;