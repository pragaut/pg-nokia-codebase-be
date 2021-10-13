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

//#region  DueDays Master  
const getDueDaysMasterById = async (req, res) => {
    try {
        const result = await dal.findById(db.dueDaysMaster, req.query.id);

        responseHelper.success(res, codes.SUCCESS, result);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting DueDays Master');
    }
};

const _findDueDaysWithCategory = async (category, isActive) => {
    const where = {};

    typeof isActive === 'undefined' ? '' : where.active = isActive;
    where.category = category;
    const dueDaysMaster = await dal.findOne(db.dueDaysMaster, where, true);

    return dueDaysMaster;
};


/**
* 
* @param {*} req 
* @param {*} res 
* 
* by defaut gives last one month data.
*/
const getDueDaysMaster = async (req, res) => {
    try {
        //console.log("getDueDaysMaster");
        let where = [];
        where.push(util.constructWheresForSequelize('active', 1));
        if (req.query.id) {
            return getDueDaysMasterById(req, res);
        }
        else {
            await dal.getList({ model: db.dueDaysMaster, where, order: [['createdAt', 'desc']], include: true, rowsToReturn: req.query.rows, pageIndex: req.query.pageIndex, res });
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting DueDayss');
    }
};

/**
* 
* @param {*} req 
* @param {*} res 
*/
const saveDueDaysMaster = async (req, res) => {
    try {
        const dueDaysMaster = req.body;
        if (typeof dueDaysMaster.id === 'undefined') {
            const dueDayWithCategory = await _findDueDaysWithCategory(dueDaysMaster.category, true);
            if (dueDaysMaster && dueDayWithCategory && dueDaysMaster.category === dueDayWithCategory.category) throw util.generateWarning('DueDays category already in use', codes.CODE_ALREADY_EXISTS);
        }

        if (util.missingRequiredFields('dueDaysMaster', dueDaysMaster, res) === '') {
            const resultData = await dal.saveData(db.dueDaysMaster, dueDaysMaster, res, req.user.id);
            responseHelper.success(res, 200, resultData, 'Save due date saved successfully', resultData.id, 1);
        }
        else {
            console.log("Backend dueDaysMaster Data else condition", req)
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'saving Due Day master details');
    }
};

const deleteDueDaysMaster = async (req, res) => {
    try {
        //console.log("delete Due Day req : ", req);
        if (!req.query.id) {
            throw util.generateWarning(`Please provide Due Day master id`, codes.ID_NOT_FOUND);
        }
        dal.deleteRecords(db.dueDaysMaster, req.query.id, req.user.id, res);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'deleting Due Day master details');
    }
};

//#endregion

//#region  Escalation Matrix Master  
const getEscalationMatrixDetailsById = async (req, res) => {
    try {
        const result = await dal.findById(db.escalationMatrix, req.query.id);

        responseHelper.success(res, codes.SUCCESS, result);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting Escalation Matrix Master');
    }
};

const _findEscalationMatrixDetailsWithCode = async (notificationMasterId, roleId, notificationType, frequency, isActive) => {
    const where = {};

    typeof isActive === 'undefined' ? '' : where.active = isActive;
    where.notificationMasterId = notificationMasterId;
    where.roleId = roleId;
    where.notificationType = notificationType;
    where.frequency = frequency;
    //  where.duration = duration;
    const escalationMatrix = await dal.findOne(db.escalationMatrix, where, true);

    return escalationMatrix;
};


/**
* 
* @param {*} req 
* @param {*} res 
* 
* by defaut gives last one month data.
*/
const getEscalationMatrixDetails = async (req, res) => {
    try {
        let where = [];
        where.push(util.constructWheresForSequelize('active', 1));
        if (req.query.id) {
            return getEscalationMatrixDetailsById(req, res);
        }
        else {
            return await dal.getList({ model: db.escalationMatrix, where, order: [['createdAt', 'desc']], include: true, rowsToReturn: req.query.rows, pageIndex: req.query.pageIndex, res });
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting Escalation Matrix');
    }
};

/**
* 
* @param {*} req 
* @param {*} res 
*/
const saveEscalationMatrixDetails = async (req, res) => {
    try {
        const escalationMatrix = req.body;
        if (typeof escalationMatrix.id === 'undefined') {
            const _escalationMatrixWithCode = await _findEscalationMatrixDetailsWithCode(escalationMatrix.notificationMasterId, escalationMatrix.roleId, escalationMatrix.notificationType, escalationMatrix.frequencyMasterId, true);
            if (escalationMatrix && _escalationMatrixWithCode && escalationMatrix.durationMasterId === _escalationMatrixWithCode.durationMasterId) throw util.generateWarning('escalation Matrix already in use', codes.CODE_ALREADY_EXISTS);
        }
        if (util.missingRequiredFields('escalationMatrix', escalationMatrix, res) === '') {
            await dal.saveData(db.escalationMatrix, escalationMatrix, res, req.user.id);
        }
        else {
            console.log("Backend escalation Matrix Data else condition", req)
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'saving Escalation Matrix details');
    }
};

const deleteEscalationMatrixDetails = async (req, res) => {
    try {
        if (!req.query.id) {
            throw util.generateWarning(`Please provide escalation Matrix details id`, codes.ID_NOT_FOUND);
        }
        dal.deleteRecords(db.escalationMatrix, req.query.id, req.user.id, res);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'deleting Escalation Matrix details');
    }
};

//#endregion

//#region  Escalation Duration Master  
const getEscalationDurationDetailsById = async (req, res) => {
    try {
        const result = await dal.findById(db.escalationDurationMaster, req.query.id);

        responseHelper.success(res, codes.SUCCESS, result);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting Escalation Matrix Master');
    }
};

const _findEscalationDurationDetailsWithCode = async (frequencyMasterId, durationCode, isActive) => {
    const where = {};

    typeof isActive === 'undefined' ? '' : where.active = isActive;
    where.frequencyMasterId = frequencyMasterId;
    where.durationCode = durationCode;
    //  where.duration = duration;
    const escalationMatrix = await dal.findOne(db.escalationDurationMaster, where, true);

    return escalationMatrix;
};


/**
* 
* @param {*} req 
* @param {*} res 
* 
* by defaut gives last one month data.
*/
const getEscalationDurationDetails = async (req, res) => {
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
            return getEscalationDurationDetailsById(req, res);
        }
        else {
            return await dal.getList({ model: db.escalationDurationMaster, where, order: [['frequencyMasterId', 'asc'], ['durationOrder', 'desc']], include: true, rowsToReturn: req.query.rows, pageIndex: req.query.pageIndex, res });

        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting Escalation Matrix');
    }
};

/**
* 
* @param {*} req 
* @param {*} res 
*/
const saveEscalationDurationDetails = async (req, res) => {
    try {
        const escalationDurationMaster = req.body;
        if (typeof escalationDurationMaster.id === 'undefined') {
            const _escalationDurationMasterWithCode = await _findEscalationDurationDetailsWithCode(escalationDurationMaster.frequencyMasterId, escalationDurationMaster.durationCode, true);
            if (escalationDurationMaster && _escalationDurationMasterWithCode && escalationDurationMaster.durationCode === _escalationDurationMasterWithCode.durationCode && escalationDurationMaster.frequencyMasterId === _escalationDurationMasterWithCode.frequencyMasterId) throw util.generateWarning('escalation  duration  already in use', codes.CODE_ALREADY_EXISTS);
        }
        if (util.missingRequiredFields('escalationDurationMaster', escalationDurationMaster, res) === '') {
            await dal.saveData(db.escalationDurationMaster, escalationDurationMaster, res, req.user.id);
        }
        else {
            console.log("Backend escalation Matrix Data else condition", req)
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'saving Escalation Matrix details');
    }
};

const deleteEscalationDurationDetails = async (req, res) => {
    try {
        if (!req.query.id) {
            throw util.generateWarning(`Please provide escalation Matrix details id`, codes.ID_NOT_FOUND);
        }
        dal.deleteRecords(db.escalationDurationMaster, req.query.id, req.user.id, res);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'deleting Escalation Matrix details');
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



//#region Section Master
const getSectionMasterById = async (req, res) => {

    try {
        const result = await dal.findById(db.sectionMaster, req.query.id);

        responseHelper.success(res, codes.SUCCESS, result);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting section master data');
    }
};


const _findSectionWithCode = async (Code, isActive) => {
    const where = {};

    typeof isActive === 'undefined' ? '' : where.active = isActive;
    where.sectionCode = Code;
    //where.emailConfirmed = 1;

    const sectionMaster = await dal.findOne(db.sectionMaster, where, true);

    //console.log('find one: ', user);
    return sectionMaster;
};


/**
* 
* @param {*} req 
* @param {*} res 
* 
* by defaut gives last one month data.
*/
const getSectionMaster = async (req, res) => {
    try {

        // let where = [];
        // where.push(util.constructWheresForSequelize('active', 1));
        let where = [];
        where.push(util.constructWheresForSequelize('active', 1));
        if (req.query.isInOperativeRecord && (req.query.isInOperativeRecord === 'false' || req.query.isInOperativeRecord === false)) {
            where.push(util.constructWheresForNotEqualSequelize('isInOperativeRecord', 1));
        }
        if (req.query.id) {
            return getSectionMasterById(req, res);
        }
        else {
            console.log("where", where);
            await dal.getList({ model: db.sectionMaster, where, order: [['sectionOrder', 'asc']], include: true, rowsToReturn: req.query.rows, pageIndex: req.query.pageIndex, res });
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting section');
    }
};

const getLastSectionOrder = async (isActive) => {
    try {
        const sectionOrder = await db.sectionMaster.findOne({
            order: [['sectionOrder', 'desc']],
            limit: 1,
            where: {
                active: 1
            },
            attributes: ['sectionOrder']
        });

        return sectionOrder;
    }
    catch (error) {
        return undefined;
    }
};

/**
* 
* @param {*} req 
* @param {*} res 



*/

const _FindSectionAlreadyExistOrNot = async (id, Code) => {
    let where = [];
    if (id && id !== null && id !== 'undefined') {
        where.push(util.constructWheresForNotEqualSequelize('id', id));
    }
    where.push(util.constructWheresForSequelize('active', 1));
    where.push(util.constructWheresForSequelize('sectionCode', Code));

    const sectionMasterDetails = await dal.getList({ model: db.sectionMaster, where, order: [['createdAt', 'desc']], include: false, });
    if (sectionMasterDetails && sectionMasterDetails.length > 0) {
        return 'already exist'
    }
    else {
        return 'success'
    }
}

const saveSectionMaster = async (req, res) => {
    try {
        const sectionMaster = req.body;
        const PKID = sectionMaster && sectionMaster.id ? sectionMaster.id : undefined;
        const ChekAlreadyExist = await _FindSectionAlreadyExistOrNot(PKID, sectionMaster.sectionCode);
        let CodeMsg = sectionMaster && sectionMaster.sectionCode ? 'Section  "' + sectionMaster.sectionCode + '" already in use' : 'Section code already in use';
        if (ChekAlreadyExist && ChekAlreadyExist !== "success") throw util.generateWarning(CodeMsg, codes.CODE_ALREADY_EXISTS);

        let lastOrder = 0;
        if (sectionMaster.sectionOrder == null) {
            lastOrder = await getLastSectionOrder(true);
            if (lastOrder && lastOrder.sectionOrder)
                sectionMaster.sectionOrder = lastOrder.sectionOrder + 1;
            else
                sectionMaster.sectionOrder = 1;
        }
        if (util.missingRequiredFields('sectionMaster', sectionMaster, res) === '') {
            await dal.saveData(db.sectionMaster, sectionMaster, res, req.user.id);
        }
        else {
            console.log("Backend Section Master Data else condition", req)
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'saving Section Master');
    }
};

const deleteSectionMaster = async (req, res) => {

    try {
        if (!req.query.id) {
            throw util.generateWarning(`Please provide section id`, codes.ID_NOT_FOUND);
        }
        dal.deleteRecords(db.sectionMaster, req.query.id, req.user.id, res);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'deleting section Master');
    }
};
//#endregion

//#region Sub Section Master
const getSubSectionMasterById = async (req, res) => {

    try {
        const result = await dal.findById(db.subSectionMaster, req.query.id);

        responseHelper.success(res, codes.SUCCESS, result);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting sub section master data');
    }
};


const _findSubSectionWithCode = async (Code, isActive) => {
    const where = {};

    typeof isActive === 'undefined' ? '' : where.active = isActive;
    where.subSectionCode = Code;
    //where.emailConfirmed = 1;

    const subSectionMaster = await dal.findOne(db.subSectionMaster, where, true);

    //console.log('find one: ', user);
    return subSectionMaster;
};


/**
* 
* @param {*} req 
* @param {*} res 
* 
* by defaut gives last one month data.
*/
const getSubSectionMaster = async (req, res) => {
    try {

        // let where = [];
        // where.push(util.constructWheresForSequelize('active', 1));
        let where = [];
        where.push(util.constructWheresForSequelize('active', 1));
        if (req.query.sectionMasterId) {
            where.push(util.constructWheresForSequelize('sectionMasterId', req.query.sectionMasterId));
        }
        if (req.query.id) {
            return getSubSectionMasterById(req, res);
        }
        else {
            await dal.getList({ model: db.subSectionMaster, where, order: [
                [{ model: db.sectionMaster, as: 'section' }, 'sectionOrder', 'asc'],
                ['subSectionOrder', 'desc']], include: true, rowsToReturn: req.query.rows, pageIndex: req.query.pageIndex, res });
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting sub section');
    }
};

const getLastSubSectionOrder = async (isActive) => {
    try {
        const subSectionOrder = await db.subSectionMaster.findOne({
            order: [['subSectionOrder', 'desc']],
            limit: 1,
            where: {
                active: 1
            },
            attributes: ['subSectionOrder']
        });
        return subSectionOrder;
    }
    catch (error) {
        return undefined;
    }
};

/**
* 
* @param {*} req 
* @param {*} res 



*/

const _FindSubSectionAlreadyExistOrNot = async (id, Code) => {
    let where = [];
    if (id && id !== null && id !== 'undefined') {
        where.push(util.constructWheresForNotEqualSequelize('id', id));
    }
    where.push(util.constructWheresForSequelize('active', 1));
    where.push(util.constructWheresForSequelize('subSectionCode', Code));

    const subSectionMasterDetails = await dal.getList({ model: db.subSectionMaster, where, order: [['createdAt', 'desc']], include: false, });
    if (subSectionMasterDetails && subSectionMasterDetails.length > 0) {
        return 'already exist'
    }
    else {
        return 'success'
    }
}

const saveSubSectionMaster = async (req, res) => {
    try {
        const subSectionMaster = req.body;
        // if (typeof roleMaster.id === 'undefined') {
        //     const _RoleWithCode = await _findRoleWithCode(roleMaster.roleCode, true);
        //     if (roleMaster && _RoleWithCode && roleMaster.roleCode === _RoleWithCode.roleCode) throw util.generateWarning('Role Master Code already in use', codes.CODE_ALREADY_EXISTS);
        // }


        const PKID = subSectionMaster && subSectionMaster.id ? subSectionMaster.id : undefined;
        const ChekAlreadyExist = await _FindSubSectionAlreadyExistOrNot(PKID, subSectionMaster.subSectionCode);
        let CodeMsg = subSectionMaster && subSectionMaster.subSectionCode ? 'Sub Section  "' + subSectionMaster.subSectionCode + '" already in use' : 'Sub Section code already in use';
        if (ChekAlreadyExist && ChekAlreadyExist !== "success") throw util.generateWarning(CodeMsg, codes.CODE_ALREADY_EXISTS);
        console.log("subSectionMaster.subSectionOrder : ", subSectionMaster.subSectionOrder);
        let lastOrder = 0;
        if (subSectionMaster.subSectionOrder == null) {
            lastOrder = await getLastSubSectionOrder(true);
            console.log("lastOrder : ", lastOrder);
            //console.log("lastOrder.roleOrder : ", lastOrder.roleOrder);
            if (lastOrder && lastOrder.subSectionOrder)
                subSectionMaster.subSectionOrder = lastOrder.subSectionOrder + 1;
            else
                subSectionMaster.subSectionOrder = 1;
        }
        if (util.missingRequiredFields('subSectionMaster', subSectionMaster, res) === '') {
            await dal.saveData(db.subSectionMaster, subSectionMaster, res, req.user.id);
        }
        else {
            console.log("Backend Sub Section Master Data else condition", req)
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'saving Sub Section Master');
    }
};

const deleteSubSectionMaster = async (req, res) => {

    try {
        if (!req.query.id) {
            throw util.generateWarning(`Please provide sub section id`, codes.ID_NOT_FOUND);
        }
        dal.deleteRecords(db.subSectionMaster, req.query.id, req.user.id, res);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'deleting Sub section Master');
    }
};
//#endregion

//#region  Audit Type Master

const getAuditTypeMaster = async (req, res) => {
    try {
        // let where = [];
        // where.push(util.constructWheresForSequelize('active', 1));
        let where = [];
        where.push(util.constructWheresForSequelize('active', 1));
        await dal.getList({ model: db.auditType, where, order: [['createdAt', 'desc']], include: true, rowsToReturn: req.query.rows, pageIndex: req.query.pageIndex, res });

    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting Audit type');
    }
};
//#endregion

//#region  Audit Flow Master

const getAuditFlowMaster = async (req, res) => {
    try {
        // let where = [];
        // where.push(util.constructWheresForSequelize('active', 1));
        let where = [];
        where.push(util.constructWheresForSequelize('active', 1));
        await dal.getList({ model: db.auditFlow, where, order: [['createdAt', 'desc']], include: true, rowsToReturn: req.query.rows, pageIndex: req.query.pageIndex, res });

    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting Audit Flow');
    }
};
//#endregion

//#region Process FLow Master

const getProcessFlowMasterById_Fun = async (processFlowMasterId) => {
    try {
        const result = await dal.findById(db.processFlowMaster, processFlowMasterId);
        return result;
    }
    catch (error) {
        return undefined
    }
};


const getProcessFlowMasterById = async (req, res) => {

    try {
        const result = await dal.findById(db.processFlowMaster, req.query.id);

        responseHelper.success(res, codes.SUCCESS, result);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting process flow master data');
    }
};


const _findProcessFlowWithCode = async (Code, isActive) => {
    const where = {};

    typeof isActive === 'undefined' ? '' : where.active = isActive;
    where.processFlowCode = Code;
    //where.emailConfirmed = 1;

    const processFlowMaster = await dal.findOne(db.processFlowMaster, where, true);

    //console.log('find one: ', user);
    return processFlowMaster;
};


/**
* 
* @param {*} req 
* @param {*} res 
* 
* by defaut gives last one month data.
*/
const getProcessFlowMaster = async (req, res) => {
    try {

        // let where = [];
        // where.push(util.constructWheresForSequelize('active', 1));
        let where = [];
        where.push(util.constructWheresForSequelize('active', 1));

        if (req.query.id) {
            return getProcessFlowMasterById(req, res);
        }
        else {
            await dal.getList({ model: db.processFlowMaster, where, order: [['createdAt', 'desc']], include: true, rowsToReturn: req.query.rows, pageIndex: req.query.pageIndex, res });
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting process flow master data');
    }
};

const getLastProcessFlowOrder = async (isActive) => {
    try {
        const processFlowOrder = await db.processFlowMaster.findOne({
            order: [['processFlowOrder', 'desc']],
            limit: 1,
            where: {
                active: 1
            },
            attributes: ['processFlowOrder']
        });

        return processFlowOrder;
    }
    catch (error) {
        return undefined;
    }
};

/**
* 
* @param {*} req 
* @param {*} res 



*/

const _FindProcessFlowAlreadyExistOrNot = async (id, Code) => {
    let where = [];
    if (id && id !== null && id !== 'undefined') {
        where.push(util.constructWheresForNotEqualSequelize('id', id));
    }
    where.push(util.constructWheresForSequelize('active', 1));
    where.push(util.constructWheresForSequelize('processFlowCode', Code));

    const processFlowMasterDetails = await dal.getList({ model: db.processFlowMaster, where, order: [['createdAt', 'desc']], include: false, });
    if (processFlowMasterDetails && processFlowMasterDetails.length > 0) {
        return 'already exist'
    }
    else {
        return 'success'
    }
}

const saveProcessFlowMaster = async (req, res) => {
    try {
        const processFlowMaster = req.body;
        const PKID = processFlowMaster && processFlowMaster.id ? processFlowMaster.id : undefined;
        const ChekAlreadyExist = await _FindProcessFlowAlreadyExistOrNot(PKID, processFlowMaster.processFlowCode);
        let CodeMsg = processFlowMaster && processFlowMaster.processFlowCode ? 'Process Flow  "' + processFlowMaster.processFlowCode + '" already in use' : 'Process Flow already in use';
        if (ChekAlreadyExist && ChekAlreadyExist !== "success") throw util.generateWarning(CodeMsg, codes.CODE_ALREADY_EXISTS);

        let lastOrder = 0;
        if (processFlowMaster.processFlowOrder == null) {
            lastOrder = await getLastProcessFlowOrder(true);
            if (lastOrder && lastOrder.processFlowOrder)
                processFlowMaster.processFlowOrder = lastOrder.processFlowOrder + 1;
            else
                processFlowMaster.processFlowOrder = 1;
        }
        if (util.missingRequiredFields('processFlowMaster', processFlowMaster, res) === '') {
            await dal.saveData(db.processFlowMaster, processFlowMaster, res, req.user.id);
        }
        else {
            console.log("Backend Section Master Data else condition", req)
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'saving Process Flow Master');
    }
};

const deleteProcessFlowMaster = async (req, res) => {

    try {
        if (!req.query.id) {
            throw util.generateWarning(`Please provide process Flow Master id`, codes.ID_NOT_FOUND);
        }
        dal.deleteRecords(db.processFlowMaster, req.query.id, req.user.id, res);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'deleting process Flow Master');
    }
};
//#endregion


//#region AuditObservation Master
const getAuditObservationMasterById = async (req, res) => {
    try {
        const result = await dal.findById(db.auditObservationMaster, req.query.id);
        responseHelper.success(res, codes.SUCCESS, result);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting AuditObservation master data');
    }
};


const getAuditObservationWithCode = async (Code, isActive) => {
    const where = {};

    typeof isActive === 'undefined' ? '' : where.active = isActive;
    where.observationCode = Code;
    //where.emailConfirmed = 1;

    const AuditObservationMaster = await dal.findOne(db.auditObservationMaster, where, true);

    //console.log('find one: ', user);
    return AuditObservationMaster;
};


/**
* 
* @param {*} req 
* @param {*} res 
* 
* by defaut gives last one month data.
*/
const getAuditObservationMaster = async (req, res) => {
    try {
        let where = [];
        where.push(util.constructWheresForSequelize('active', 1));
        if (req.query.isInOperativeRecord && (req.query.isInOperativeRecord === 'false' || req.query.isInOperativeRecord === false)) {
            where.push(util.constructWheresForNotEqualSequelize('isInOperativeRecord', 1));
        }
        if (req.query.id) {
            return getAuditObservationMasterById(req, res);
        }
        else {
            await dal.getList({ model: db.auditObservationMaster, where, order: [['createdAt', 'desc']], include: true, rowsToReturn: req.query.rows, pageIndex: req.query.pageIndex, res });
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting auditObservation');
    }
};

const getLastAuditObservationOrder = async (isActive) => {
    try {
        const auditObservationOrder = await db.auditObservationMaster.findOne({
            order: [['observationOrder', 'desc']],
            limit: 1,
            where: {
                active: 1
            },
            attributes: ['observationOrder']
        });

        return auditObservationOrder;
    }
    catch (error) {
        return undefined;
    }
};

/**
* 
* @param {*} req 
* @param {*} res 



*/

const findAuditObservationAlreadyExistOrNot = async (id, Code) => {
    let where = [];
    if (id && id !== null && id !== 'undefined') {
        where.push(util.constructWheresForNotEqualSequelize('id', id));
    }
    where.push(util.constructWheresForSequelize('active', 1));
    where.push(util.constructWheresForSequelize('observationCode', Code));

    const auditObservationMasterDetails = await dal.getList({ model: db.auditObservationMaster, where, order: [['createdAt', 'desc']], include: false, });
    if (auditObservationMasterDetails && auditObservationMasterDetails.length > 0) {
        return 'already exist'
    }
    else {
        return 'success'
    }
}

const saveAuditObservationMaster = async (req, res) => {
    try {
        const auditObservationMaster = req.body;

        const PKID = auditObservationMaster && auditObservationMaster.id ? auditObservationMaster.id : undefined;
        const ChekAlreadyExist = await findAuditObservationAlreadyExistOrNot(PKID, auditObservationMaster.auditObservationCode);
        let CodeMsg = auditObservationMaster && auditObservationMaster.auditObservationCode ? 'Audit Observation  "' + auditObservationMaster.auditObservationCode + '" already in use' : 'Audit Observation code already in use';
        if (ChekAlreadyExist && ChekAlreadyExist !== "success") throw util.generateWarning(CodeMsg, codes.CODE_ALREADY_EXISTS);

        let lastOrder = 0;
        if (auditObservationMaster.auditObservationOrder == null) {
            lastOrder = await getLastAuditObservationOrder(true);
            if (lastOrder && lastOrder.observationOrder)
                auditObservationMaster.observationOrder = lastOrder.observationOrder + 1;
            else
                auditObservationMaster.observationOrder = 1;
        }

        if (util.missingRequiredFields('auditObservationMaster', auditObservationMaster, res) === '') {
            await dal.saveData(db.auditObservationMaster, auditObservationMaster, res, req.user.id);
        }
        else {
            throw util.generateWarning("All required fields are not provided !!", 202.2);
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'saving Audit Observation master data');
    }
};

const deleteAuditObservationMaster = async (req, res) => {

    try {
        if (!req.query.id) {
            throw util.generateWarning(`Please provide audit Observation id`, codes.ID_NOT_FOUND);
        }
        dal.deleteRecords(db.auditObservationMaster, req.query.id, req.user.id, res);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'deleting audit Observation master data !!');
    }
};
//#endregion

//#region Scoring Rule Master
const getScoringRuleMasterById = async (req, res) => {

    try {
        const result = await dal.findById(db.scoringRuleMaster, req.query.id);

        responseHelper.success(res, codes.SUCCESS, result);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting Scoring Rule Master data');
    }
};


const _findScoringRuleMasterWithCode = async (sectionMasterid, criticalityMasterId, observationMasterId, isActive) => {
    const where = {};

    typeof isActive === 'undefined' ? '' : where.active = isActive;
    where.sectionMasterid = sectionMasterid;
    where.criticalityMasterId = criticalityMasterId;
    where.observationMasterId = observationMasterId;
    //where.emailConfirmed = 1;

    const scoringRuleMaster = await dal.findOne(db.scoringRuleMaster, where, true);

    //console.log('find one: ', user);
    return scoringRuleMaster;

};

const getScoringRuleMaster = async (req, res) => {
    try {

        // let where = [];
        // where.push(util.constructWheresForSequelize('active', 1));
        let where = [];
        where.push(util.constructWheresForSequelize('active', 1));

        if (req.query.id) {
            return getScoringRuleMasterById(req, res);
        }
        else {
            await dal.getList({ model: db.scoringRuleMaster, where, order: [['createdAt', 'desc']], include: true, rowsToReturn: req.query.rows, pageIndex: req.query.pageIndex, res });
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting Scoring Rule Master');
    }
};


const _FindScoringRuleMasterAlreadyExistOrNot = async (id, sectionMasterid, criticalityMasterId, observationMasterId) => {
    let where = [];
    if (id && id !== null && id !== 'undefined') {
        where.push(util.constructWheresForNotEqualSequelize('id', id));
    }
    where.push(util.constructWheresForSequelize('active', 1));
    where.push(util.constructWheresForSequelize('sectionMasterid', sectionMasterid));
    where.push(util.constructWheresForSequelize('criticalityMasterId', criticalityMasterId));
    where.push(util.constructWheresForSequelize('observationMasterId', observationMasterId));

    const scoringRuleMasterDetails = await dal.getList({ model: db.scoringRuleMaster, where, order: [['createdAt', 'desc']], include: false, });
    if (scoringRuleMasterDetails && scoringRuleMasterDetails.length > 0) {
        return 'already exist'
    }
    else {
        return 'success'
    }
};

const saveScoringRuleMaster = async (req, res) => {
    try {
        const scoringRuleMaster = req.body;
        // if (typeof roleMaster.id === 'undefined') {
        //     const _RoleWithCode = await _findRoleWithCode(roleMaster.roleCode, true);
        //     if (roleMaster && _RoleWithCode && roleMaster.roleCode === _RoleWithCode.roleCode) throw util.generateWarning('Role Master Code already in use', codes.CODE_ALREADY_EXISTS);
        // }


        const PKID = scoringRuleMaster && scoringRuleMaster.id ? scoringRuleMaster.id : undefined;
        const ChekAlreadyExist = await _FindScoringRuleMasterAlreadyExistOrNot(PKID, scoringRuleMaster.sectionMasterid, scoringRuleMaster.criticalityMasterId, scoringRuleMaster.observationMasterId);
        let CodeMsg = 'Scroing Rule already exists';
        if (ChekAlreadyExist && ChekAlreadyExist !== "success") throw util.generateWarning(CodeMsg, codes.CODE_ALREADY_EXISTS);

        if (util.missingRequiredFields('scoringRuleMaster', scoringRuleMaster, res) === '') {
            await dal.saveData(db.scoringRuleMaster, scoringRuleMaster, res, req.user.id);
        }
        else {
            console.log("Backend Scoring Rule Data else condition", req)
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'saving Scoring Rule Master');
    }
};

const deleteScoringRuleMaster = async (req, res) => {

    try {
        if (!req.query.id) {
            throw util.generateWarning(`Please provide Scoring Rule Id`, codes.ID_NOT_FOUND);
        }
        dal.deleteRecords(db.scoringRuleMaster, req.query.id, req.user.id, res);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'deleting Scoring Rule Master');
    }
};

//#endregion

//#region  Criticality master Master

const getCriticalityMaster = async (req, res) => {
    try {
        // let where = [];
        // where.push(util.constructWheresForSequelize('active', 1));
        let where = [];
        where.push(util.constructWheresForSequelize('active', 1));
        await dal.getList({ model: db.criticalityMaster, where, order: [['createdAt', 'desc']], include: true, rowsToReturn: req.query.rows, pageIndex: req.query.pageIndex, res });

    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting Audit type');
    }
};

const getLastCriticalityMasterOrder = async (isActive) => {
    try {
        const criticalityMaster = await db.criticalityMaster.findOne({
            order: [['criticalityOrder', 'desc']],
            limit: 1,
            where: {
                active: 1
            },
            attributes: ['criticalityOrder']
        });

        return criticalityMaster;
    }
    catch (error) {
        return undefined;
    }
};

/**
* 
* @param {*} req 
* @param {*} res 



*/

const findCriticalityMasterAlreadyExistOrNot = async (id, Code) => {
    let where = [];
    if (id && id !== null && id !== 'undefined') {
        where.push(util.constructWheresForNotEqualSequelize('id', id));
    }
    where.push(util.constructWheresForSequelize('active', 1));
    where.push(util.constructWheresForSequelize('criticalityCode', Code));

    const criticalityMasterDetails = await dal.getList({ model: db.criticalityMaster, where, order: [['createdAt', 'desc']], include: false, });
    if (criticalityMasterDetails && criticalityMasterDetails.length > 0) {
        return 'already exist'
    }
    else {
        return 'success'
    }
}

const saveCriticalityMaster = async (req, res) => {
    try {
        const criticalityMaster = req.body;

        const PKID = criticalityMaster && criticalityMaster.id ? criticalityMaster.id : undefined;
        const ChekAlreadyExist = await findCriticalityMasterAlreadyExistOrNot(PKID, criticalityMaster.criticalityCode);
        let CodeMsg = criticalityMaster && criticalityMaster.criticalityCode ? 'Criticality Master  "' + criticalityMaster.criticalityCode + '" already in use' : 'Criticality Code code already in use';
        if (ChekAlreadyExist && ChekAlreadyExist !== "success") throw util.generateWarning(CodeMsg, codes.CODE_ALREADY_EXISTS);

        let lastOrder = 0;
        if (criticalityMaster.criticalityOrder == null) {
            lastOrder = await getLastCriticalityMasterOrder(true);
            if (lastOrder && lastOrder.criticalityOrder)
            criticalityMaster.criticalityOrder = lastOrder.criticalityOrder + 1;
            else
            criticalityMaster.criticalityOrder = 1;
        }

        if (util.missingRequiredFields('Criticality Master', criticalityMaster, res) === '') {
            await dal.saveData(db.criticalityMaster, criticalityMaster, res, req.user.id);
        }
        else {
            throw util.generateWarning("All required fields are not provided !!", 202.2);
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'saving Criticality Master master data');
    }
};

const deleteCriticalityMaster = async (req, res) => {

    try {
        if (!req.query.id) {
            throw util.generateWarning(`Please provide Criticality Master id`, codes.ID_NOT_FOUND);
        }
        dal.deleteRecords(db.criticalityMaster, req.query.id, req.user.id, res);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'deleting Criticality Master data !!');
    }
};

//#endregion

//#region  Audit Type Auditor Relation Master  
const getAuditTypeAuditorRelationMasterById = async (req, res) => {
    try {
        const result = await dal.findById(db.auditTypeAuditorRelation, req.query.id);

        responseHelper.success(res, codes.SUCCESS, result);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting Audit Type Auditor Relation Master');
    }
};
const _findAuditTypeAuditorRelationWithAuditTypeId = async (auditTypeId, isActive, id) => {
    let where = [];
    if (id && id !== null && id !== 'undefined') {
        where.push(util.constructWheresForNotEqualSequelize('id', id));
    }
    where.push(util.constructWheresForSequelize('active', 1));
    where.push(util.constructWheresForSequelize('auditTypeId', auditTypeId));
    const auditTypeAuditorRelationDetails = await dal.getList({ model: db.auditTypeAuditorRelation, where, order: [['createdAt', 'desc']], include: false, });
    if (auditTypeAuditorRelationDetails && auditTypeAuditorRelationDetails.length > 0) {
        return 'already exist'
    }
    else {
        return 'success'
    }
};
const getAuditTypeAuditorRelationMaster = async (req, res) => {
    try {
        let where = [];
        where.push(util.constructWheresForSequelize('active', 1));


        if (req.query.id) {
            return getAuditTypeAuditorRelationMasterById(req, res);
        }
        else {
            db.sequelize.query('call asp_HRA_AuditTypeAuditorRelation_get_AuditTypeAuditorRelation(:auditorTypeRelationId, :pAuditTypeId, :puserId, :getType)',
                {
                    replacements: {
                        auditorTypeRelationId: req.query.auditorTypeRelationId ? req.query.auditorTypeRelationId : '',
                        pAuditTypeId: req.query.auditTypeId ? req.query.auditTypeId : '',
                        puserId: '',
                        getType: req.query.getType ? req.query.getType : '',
                    }
                }).then(results => {
                    responseHelper.success(res, 200, results, 'Audit Type Auditor Relation master List successfully', '-1', results.length);
                }).catch(err => {
                    responseHelper.error(res, err.code ? err.code : codes.ERROR, err, 'Error in Audit Type Auditor Relation  details');

                });
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting Audit Type Auditor Relation');
    }
};
const saveAuditTypeAuditorRelationMaster = async (req, res) => {
    try {
        const auditTypeAuditorRelation = req.body;
        let PKID = auditTypeAuditorRelation && auditTypeAuditorRelation.id ? auditTypeAuditorRelation.id : undefined;
        const ChekAlreadyExist = await _findAuditTypeAuditorRelationWithAuditTypeId(auditTypeAuditorRelation.auditTypeId, true, PKID)
        if (ChekAlreadyExist && ChekAlreadyExist !== "success") throw util.generateWarning('Audit Type  already in use', codes.CODE_ALREADY_EXISTS);

        if (util.missingRequiredFields('auditTypeAuditorRelation', auditTypeAuditorRelation, res) === '') {
            await dal.saveData(db.auditTypeAuditorRelation, auditTypeAuditorRelation, res, req.user.id);
        }
        else {
            console.log("Backend Audit Type Auditor Relation Data else condition", req)
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'saving Audit Type Auditor Relation details');
    }
};
const deleteAuditTypeAuditorRelationMaster = async (req, res) => {
    try {
        //console.log("delete Due Day req : ", req);
        if (!req.query.id) {
            throw util.generateWarning(`Please provide Audit Type Auditor Relation Master id`, codes.ID_NOT_FOUND);
        }
        dal.deleteRecords(db.auditTypeAuditorRelation, req.query.id, req.user.id, res);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'deleting Audit Type Auditor Relation details');
    }
};
//#endregion


//#region  Scope Master

const getScopeMasterById = async (req, res) => {
    try {
        const result = await dal.findById(db.scopeMaster, req.query.id);
        responseHelper.success(res, codes.SUCCESS, result);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting Scope master data');
    }
};


const getScopeWithCode = async (question, isActive) => {
    const where = {};

    typeof isActive === 'undefined' ? '' : where.active = isActive;
    where.question = question;
    //where.emailConfirmed = 1;

    const scopeMaster = await dal.findOne(db.scopeMaster, where, true);

    //console.log('find one: ', user);
    return scopeMaster;
};


/**
* 
* @param {*} req 
* @param {*} res 
* 
* by defaut gives last one month data.
*/
const getScopeMaster = async (req, res) => {
    try {
        let where = [];
        where.push(util.constructWheresForSequelize('active', 1));
        if (req.query.sectionMasterId && req.query.sectionMasterId !== null && req.query.sectionMasterId !== "-1") {
            where.push(util.constructWheresForSequelize('sectionMasterId', req.query.sectionMasterId));
        }
        if (req.query.subSectionMasterId && req.query.subSectionMasterId !== null && req.query.subSectionMasterId !== "-1") {
            where.push(util.constructWheresForSequelize('subSectionMasterId', req.query.subSectionMasterId));
        }
        if (req.query.auditModeMasterId && req.query.auditModeMasterId !== null && req.query.auditModeMasterId !== "-1") {
            where.push(util.constructWheresForSequelize('auditModeMasterId', req.query.auditModeMasterId));
        }
        if (req.query.criticalityMasterId && req.query.criticalityMasterId !== null && req.query.criticalityMasterId !== "-1") {
            where.push(util.constructWheresForSequelize('criticalityMasterId', req.query.criticalityMasterId));
        }

        if (req.query.id) {
            return getScopeMasterById(req, res);
        }
        else {

            let Attribute = {
                include: [
                    [
                        db.sequelize.literal(`(
                            SELECT
                                GROUP_CONCAT(auditobservation.observationName SEPARATOR ' \n')
                                FROM tbl_HRA_AuditObservationMaster AS auditobservation
                               WHERE auditobservation.active = 1
                               AND FIND_IN_SET(auditobservation.id, scopeMaster.multiObservationMasterId)
                        )`),
                        'auditObservations'
                    ]
                ]
            }

            await dal.getList({
                model: db.scopeMaster, where,
                order: [[{ model: db.sectionMaster, as: 'section' }, 'sectionOrder', 'asc'],
                [{ model: db.subSectionMaster, as: 'subsection' }, 'subSectionOrder', 'asc'],
                ['scopeOrder', 'desc']], include: true, rowsToReturn: req.query.rows, pageIndex: req.query.pageIndex, res,undefined,includedAttributes: Attribute
            });
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting Scope');
    }
};

const getLastScopeOrder = async (isActive) => {
    try {
        const scopeMasterOrder = await db.scopeMaster.findOne({
            order: [['scopeOrder', 'desc']],
            limit: 1,
            where: {
                active: 1
            },
            attributes: ['scopeOrder']
        });

        return scopeMasterOrder;
    }
    catch (error) {
        return undefined;
    }
};

const getLastScopeSequence = async (isActive, id) => {
    try {
        if (id) {
            const scopeMasterSequence = await db.scopeMaster.findOne({
                order: [['scopeSequence', 'desc']],
                limit: 1,
                where: {
                    active: 1,
                    id: id
                },
                attributes: ['scopeSequence']
            });

            return scopeMasterSequence;
        }
        else {
            const scopeMasterSequence = await db.scopeMaster.findOne({
                order: [['scopeSequence', 'desc']],
                limit: 1,
                where: {
                    active: 1
                },
                attributes: ['scopeSequence']
            });

            return scopeMasterSequence;
        }

    }
    catch (error) {
        return undefined;
    }
};

const getSectionMasterCode = async (sectionMasterId) => {
    try {
        const sectionCode = await db.sectionMaster.findOne({
            order: [['sectionCode', 'desc']],
            limit: 1,
            where: {
                active: 1,
                id: sectionMasterId
            },
            attributes: ['sectionCode']
        });
        console.log("sectionCode", sectionCode);
        return sectionCode;
    }
    catch (error) {
        return undefined;
    }
};

const getSubSectionMasterCode = async (subSectionMasterId) => {
    try {
        const subSectionCode = await db.subSectionMaster.findOne({
            order: [['subSectionCode', 'desc']],
            limit: 1,
            where: {
                active: 1,
                id: subSectionMasterId
            },
            attributes: ['subSectionCode']
        });

        console.log("subSectionCode", subSectionCode);
        return subSectionCode;
    }
    catch (error) {

        return undefined;
    }
};
/**
* 
* @param {*} req 
* @param {*} res 



*/

const findScopeAlreadyExistOrNot = async (id, subSectionMasterId, criticalityMasterId, auditModeMasterId, question) => {
    let where = [];
    if (id && id !== null && id !== 'undefined') {
        where.push(util.constructWheresForNotEqualSequelize('id', id));
    }
    where.push(util.constructWheresForSequelize('active', 1));
    where.push(util.constructWheresForSequelize('subSectionMasterId', subSectionMasterId));
    where.push(util.constructWheresForSequelize('criticalityMasterId', criticalityMasterId));
    where.push(util.constructWheresForSequelize('auditModeMasterId', auditModeMasterId));
    where.push(util.constructWheresForSequelize('question', question));

    const scopeMasterDetails = await dal.getList({ model: db.scopeMaster, where, order: [['createdAt', 'desc']], include: false, });
    if (scopeMasterDetails && scopeMasterDetails.length > 0) {
        return 'already exist'
    }
    else {
        return 'success'
    }
}

const saveScopeMaster = async (req, res) => {
    try {
        const scopeMaster = req.body;

        const PKID = scopeMaster && scopeMaster.id ? scopeMaster.id : undefined;
        const ChekAlreadyExist = await findScopeAlreadyExistOrNot(PKID, scopeMaster.subSectionMasterId, scopeMaster.criticalityMasterId, scopeMaster.auditModeMasterId, scopeMaster.question);
        let CodeMsg = scopeMaster && scopeMaster.subSectionMasterId && scopeMaster.criticalityMasterId && scopeMaster.auditModeMasterId ? 'scope  "' + scopeMaster.question + '" already in use' : 'Scope / Question already in use';
        if (ChekAlreadyExist && ChekAlreadyExist !== "success") throw util.generateWarning(CodeMsg, codes.CODE_ALREADY_EXISTS);

        let lastOrder = 0;
        if (scopeMaster.scopeOrder == null) {
            lastOrder = await getLastScopeOrder(true);
            if (lastOrder && lastOrder.scopeOrder)
                scopeMaster.scopeOrder = lastOrder.scopeOrder + 1;
            else
                scopeMaster.scopeOrder = 1;
        }
        let ScopeNumber = null;
        let ScopeSequence = null;
        let ScopeSequencenum = null;
        let SectionCode = null;
        let subSectionCode = null;
        if (!PKID) {
            ScopeSequence = await getLastScopeSequence(true, undefined);
            if (ScopeSequence) {
                ScopeSequencenum = ScopeSequence.dataValues.scopeSequence + 1;
            }
            else {
                ScopeSequencenum = 1;
            }
        }
        else {
            ScopeSequence = await getLastScopeSequence(true, PKID);
            if (ScopeSequence) {
                ScopeSequencenum = ScopeSequence.dataValues.scopeSequence + 1;
            }
            else {
                ScopeSequencenum = 1;
            }
        }
        if (scopeMaster.sectionMasterId) {
            SectionCode = await getSectionMasterCode(scopeMaster.sectionMasterId);
            console.log("SectionCode", SectionCode.dataValues.sectionCode);
        }
        if (scopeMaster.subSectionMasterId) {
            subSectionCode = await getSubSectionMasterCode(scopeMaster.subSectionMasterId);
            console.log("subSectionCode", subSectionCode.dataValues.subSectionCode);
        }
        ScopeNumber = SectionCode.dataValues.sectionCode + '/' + subSectionCode.dataValues.subSectionCode + '/' + ScopeSequencenum;
        scopeMaster.scopeSequence = ScopeSequencenum;
        scopeMaster.scopeNumber = ScopeNumber;
        if (util.missingRequiredFields('scopeMaster', scopeMaster, res) === '') {
            console.log("scopeMaster", scopeMaster);
            await dal.saveData(db.scopeMaster, scopeMaster, res, req.user.id);
        }
        else {
            throw util.generateWarning("All required fields are not provided !!", 202.2);
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'saving Scope master data');
    }
};

const deleteScopeMaster = async (req, res) => {

    try {
        if (!req.query.id) {
            throw util.generateWarning(`Please provide Scope id`, codes.ID_NOT_FOUND);
        }
        dal.deleteRecords(db.scopeMaster, req.query.id, req.user.id, res);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'deleting Scope master data !!');
    }
};

//#endregion



//#region Process FLow Responsibility Master
const getProcessFlowResponsibilityMasterById = async (req, res) => {

    try {
        const result = await dal.findById(db.processFlowResponsibilityMaster, req.query.id);

        responseHelper.success(res, codes.SUCCESS, result);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting process flow responsibility master data');
    }
};


/**
* 
* @param {*} req 
* @param {*} res 
* 
* by defaut gives last one month data.
*/
const getProcessFlowResponsibilityMaster = async (req, res) => {
    try {

        // let where = [];
        // where.push(util.constructWheresForSequelize('active', 1));
        let where = [];
        where.push(util.constructWheresForSequelize('active', 1));

        if (req.query.id) {
            return getProcessFlowResponsibilityMasterById(req, res);
        }
        else {
            await dal.getList({ model: db.processFlowResponsibilityMaster, where, order: [['createdAt', 'desc']], include: true, rowsToReturn: req.query.rows, pageIndex: req.query.pageIndex, res });
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting process flow responsibility master data');
    }
};

const getLastProcessFlowResponsibilityOrder = async (processFlowMasterId) => {
    try {
        const responsiblityOrder = await db.processFlowResponsibilityMaster.findOne({
            order: [['responsiblityOrder', 'desc']],
            limit: 1,
            where: {
                active: 1,
                processFlowMasterId: processFlowMasterId
            },
            attributes: ['responsiblityOrder']
        });

        return responsiblityOrder;
    }
    catch (error) {
        return undefined;
    }
};

/**
* 
* @param {*} req 
* @param {*} res 



*/

const _FindProcessFlowResponsibilityAlreadyExistOrNot = async (id, processFlowMasterId, companyMasterId, plantMasterId, responsiblityOrder) => {
    let where = [];
    if (id && id !== null && id !== 'undefined') {
        where.push(util.constructWheresForNotEqualSequelize('id', id));
    }
    where.push(util.constructWheresForSequelize('processFlowMasterId', processFlowMasterId));
    let pfm = await getProcessFlowMasterById_Fun(processFlowMasterId);
    if (pfm && pfm.isPlantWiseApplicable && pfm.isPlantWiseApplicable === true) {
        where.push(util.constructWheresForSequelize('plantMasterId', plantMasterId));
    }
    if (pfm && pfm.isCompanyWiseApplicable && pfm.isCompanyWiseApplicable === true) {
        where.push(util.constructWheresForSequelize('companyMasterId', companyMasterId));
    }
    if (responsiblityOrder) {
        where.push(util.constructWheresForSequelize('responsiblityOrder', responsiblityOrder));
    }
    console.log("Where Process Flow Responsibility ", where);
    where.push(util.constructWheresForSequelize('active', 1));

    const processFlowResponsibilityMaster = await dal.getList({ model: db.processFlowResponsibilityMaster, where, order: [['createdAt', 'desc']], include: false, });
    console.log("processFlowResponsibilityMaster", processFlowResponsibilityMaster);
    if (processFlowResponsibilityMaster && processFlowResponsibilityMaster.length > 0) {
        return 'already exist'
    }
    else {
        return 'success'
    }
}

const saveProcessFlowResponsibilityMaster = async (req, res) => {
    try {
        const processFlowResponsibilityMaster = req.body;
        if (processFlowResponsibilityMaster.responsiblityOrder === null) {
            lastOrder = await getLastProcessFlowResponsibilityOrder(processFlowResponsibilityMaster.processFlowMasterId);
            if (lastOrder && lastOrder.responsiblityOrder)
                processFlowResponsibilityMaster.responsiblityOrder = lastOrder.responsiblityOrder + 1;
            else
                processFlowResponsibilityMaster.responsiblityOrder = 1;
        }
        const PKID = processFlowResponsibilityMaster && processFlowResponsibilityMaster.id ? processFlowResponsibilityMaster.id : undefined;
        const ChekAlreadyExist = await _FindProcessFlowResponsibilityAlreadyExistOrNot(PKID, processFlowResponsibilityMaster.processFlowMasterId, processFlowResponsibilityMaster.companyMasterId, processFlowResponsibilityMaster.plantMasterId, processFlowResponsibilityMaster.responsiblityOrder);
        let CodeMsg = 'Process Flow responsibility already exist for this combination ';
        if (ChekAlreadyExist && ChekAlreadyExist !== "success") throw util.generateWarning(CodeMsg, codes.CODE_ALREADY_EXISTS);

        let lastOrder = 0;

        if (util.missingRequiredFields('processFlowResponsibilityMaster', processFlowResponsibilityMaster, res) === '') {
            await dal.saveData(db.processFlowResponsibilityMaster, processFlowResponsibilityMaster, res, req.user.id);
        }
        else {
            console.log("Backend Process Flow Responsibility Master else condition", req)
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'saving Process Flow Responsibility Master');
    }
};

const deleteProcessFlowResponsibilityMaster = async (req, res) => {

    try {
        if (!req.query.id) {
            throw util.generateWarning(`Please provide process Flow Responsibility Master id`, codes.ID_NOT_FOUND);
        }
        dal.deleteRecords(db.processFlowResponsibilityMaster, req.query.id, req.user.id, res);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'deleting process Flow Responsibility Master');
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
            await dal.getList({ model: db.towerMaster, where, order: [['createdAt', 'desc']], include: true, rowsToReturn: req.query.rows, pageIndex: req.query.pageIndex, res });
        }
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

       
        console.log("Tower Master : ",towerMaster);
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
       if(req.user && req.user.id !==null)
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
        if(req.user && req.user.id !==null)
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

module.exports.saveNotificationDetailsMaster = saveNotificationDetailsMaster;
module.exports.deleteNotificationDetailsMaster = deleteNotificationDetailsMaster;
module.exports.getNotificationDetailsMaster = getNotificationDetailsMaster;

module.exports.saveDueDaysMaster = saveDueDaysMaster;
module.exports.deleteDueDaysMaster = deleteDueDaysMaster;
module.exports.getDueDaysMaster = getDueDaysMaster;
module.exports.getDueDaysMasterById = getDueDaysMasterById;

module.exports.saveEscalationMatrixDetails = saveEscalationMatrixDetails;
module.exports.deleteEscalationMatrixDetails = deleteEscalationMatrixDetails;
module.exports.getEscalationMatrixDetails = getEscalationMatrixDetails;

module.exports.saveEscalationDurationDetails = saveEscalationDurationDetails;
module.exports.deleteEscalationDurationDetails = deleteEscalationDurationDetails;
module.exports.getEscalationDurationDetails = getEscalationDurationDetails;

module.exports.saveSupportingDocumentMaster = saveSupportingDocumentMaster;
module.exports.deleteSupportingDocumentMaster = deleteSupportingDocumentMaster;
module.exports.getSupportingDocumentMaster = getSupportingDocumentMaster;

module.exports.getAuditTypeMaster = getAuditTypeMaster;

module.exports.getAuditFlowMaster = getAuditFlowMaster;

module.exports.getProcessFlowMaster = getProcessFlowMaster;
module.exports.saveProcessFlowMaster = saveProcessFlowMaster;
module.exports.deleteProcessFlowMaster = deleteProcessFlowMaster;

module.exports.getSectionMaster = getSectionMaster;
module.exports.saveSectionMaster = saveSectionMaster;
module.exports.deleteSectionMaster = deleteSectionMaster;

module.exports.getSubSectionMaster = getSubSectionMaster;
module.exports.saveSubSectionMaster = saveSubSectionMaster;
module.exports.deleteSubSectionMaster = deleteSubSectionMaster;

module.exports.getScoringRuleMaster = getScoringRuleMaster;
module.exports.saveScoringRuleMaster = saveScoringRuleMaster;
module.exports.deleteScoringRuleMaster = deleteScoringRuleMaster;

module.exports.getAuditObservationMaster = getAuditObservationMaster;
module.exports.saveAuditObservationMaster = saveAuditObservationMaster;
module.exports.deleteAuditObservationMaster = deleteAuditObservationMaster;

module.exports.getCriticalityMaster = getCriticalityMaster;
module.exports.saveCriticalityMaster = saveCriticalityMaster;
module.exports.deleteCriticalityMaster = deleteCriticalityMaster;

module.exports.getAuditTypeAuditorRelationMaster = getAuditTypeAuditorRelationMaster;
module.exports.saveAuditTypeAuditorRelationMaster = saveAuditTypeAuditorRelationMaster;
module.exports.deleteAuditTypeAuditorRelationMaster = deleteAuditTypeAuditorRelationMaster;

module.exports.getScopeMaster = getScopeMaster;
module.exports.saveScopeMaster = saveScopeMaster;
module.exports.deleteScopeMaster = deleteScopeMaster;

module.exports.getProcessFlowResponsibilityMaster = getProcessFlowResponsibilityMaster;
module.exports.saveProcessFlowResponsibilityMaster = saveProcessFlowResponsibilityMaster;
module.exports.deleteProcessFlowResponsibilityMaster = deleteProcessFlowResponsibilityMaster;

module.exports.saveTowerMaster = saveTowerMaster;
module.exports.deleteTowerMaster = deleteTowerMaster;
module.exports.getTowerMaster = getTowerMaster;
