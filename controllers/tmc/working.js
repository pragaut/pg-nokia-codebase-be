const { db } = require('../../models');
const dal = require('../../dal');
const Op = require('sequelize').Op;
const util = require('../../util/');
const responseHelper = require('../../util/response.helper');
const config = require('../../config').config;
const encryptionHelper = require('../../util/encryption.helper');
const codes = require('../../util/codes').codes;
const constants = require('../../util/constants');
const emailService = require('../../util/email');

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
const SaveSupportingDocs = async (supportingDocs, userId) => {
    try {
        //console.log("Save Supporting Docs", supportingDocs)
        await dal.saveData(db.mediaDetails, supportingDocs, null, userId);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'saving  Invoice Supporting Docs  details');
    }
};
const getplantMasterById = async (plantId) => {
    try {
        const result = await dal.findById(db.plantMaster, plantId);
        return result
    }
    catch (error) {
        console.log("get plant error : ", error);
        return undefined;
    }
};
const getStatusMasterById = async (statusId) => {
    try {
        const result = await dal.findById(db.statusMaster, statusId);
        return result
    }
    catch (error) {
        console.log("get status error : ", error);
        return undefined;
    }
};
const getMasterDetailsById = async (Id) => {

    try {
        const result = await dal.findById(db.masterDetails, Id);
        return result;
    }
    catch (error) {
        console.log("get status error : ", error);
        return undefined;
    }
};
const getStatusMasterDetails = async (StatusMasterID, StatusCode, category) => {
    try {
        let where = [];
        where.push(util.constructWheresForSequelize('active', 1));
        if (StatusMasterID) {
            where.push(util.constructWheresForSequelize('id', StatusMasterID));
        }
        else if (StatusCode === "Approved") {
            where.push(util.constructWheresForSequelize('isAccepted', 1));
        }
        else if (StatusCode === "Sendback") {
            where.push(util.constructWheresForSequelize('isSentBack', 1));
        }
        else if (StatusCode === "Rejected") {
            where.push(util.constructWheresForSequelize('isRejected', 1));
        }
        else if (StatusCode === "PermanentRejected") {
            where.push(util.constructWheresForSequelize('isPermanentRejected', 1));
        }
        if (category) {
            where.push(util.constructWheresForSequelize('category', category));
        }
        // console.log("where",where);
        const statusMaster = await dal.getList({
            model: db.statusMaster,
            where,
            order: [['createdAt', 'desc']],
            include: false
        });
        const returnValue = statusMaster && statusMaster[0];
        //  console.log("returnValue",returnValue)
        return returnValue;
    }
    catch (error) {
        return undefined;
    }
};
const getAuditFlowDetails = async (auditFlowMasterId, FlowCode) => {
    try {
        let where = [];
        where.push(util.constructWheresForSequelize('active', 1));
        if (auditFlowMasterId) {
            where.push(util.constructWheresForSequelize('id', auditFlowMasterId));
        }
        else if (FlowCode) {
            where.push(util.constructWheresForSequelize('auditFlowCode', FlowCode));
        }

        const auditFlowMaster = await dal.getList({
            model: db.auditFlow,
            where: where,
            order: [['createdAt', 'desc']],
            include: false
        });
        return auditFlowMaster[0];
    }
    catch (error) {
        return undefined;
    }
};
const getProcessFlowCompletionDetails = async (auditPlanDetailsId, processFlowMasterId, auditPlanSubDetailsId) => {
    try {
        let where = [];
        where.push(util.constructWheresForSequelize('active', 1));
        where.push(util.constructWheresForSequelize('auditPlanDetailsId', auditPlanDetailsId));
        where.push(util.constructWheresForSequelize('processFlowMasterId', processFlowMasterId));
        where.push(util.constructWheresForSequelize('auditPlanSubDetailsId', auditPlanSubDetailsId));

        console.log("where : ", where);
        let isCompleted = true;

        const include = [{
            model: db.processFlowCompletionHistoryDetails, foreignKey: 'processFlowCompletionDetailsId', as: 'processFlowCompletionHistoryDetails',
            where: {
                isCompleted: isCompleted,
                active: 1,
            },
            required: false,
        }];

        const Listprocess = await dal.getList({
            model: db.processFlowCompletionDetails, where, order: [['createdAt', 'desc']], include: false,
            // rowsToReturn: 30, pageIndex: 0
            includeInnerObject: include,
        });
        //console.log("processFlowCompletionDetails : ", Listprocess);
        const datareturn = Listprocess && Listprocess[0];
        return datareturn;
    }
    catch (error) {
        console.log("error : ", error);
        return undefined;
    }
};
const getProcessFlowCompletionHistoryDetails = async (processFlowCompletionDetailsId, roleMasterId, companyMasterId, plantMasterId, userMasterId, responsiblityOrder) => {
    try {
        let where = [];
        where.push(util.constructWheresForSequelize('active', 1));
        where.push(util.constructWheresForSequelize('processFlowCompletionDetailsId', processFlowCompletionDetailsId));
        where.push(util.constructWheresForSequelize('roleMasterId', roleMasterId));
        if (companyMasterId) {
            where.push(util.constructWheresForSequelize('companyMasterId', companyMasterId));
        }
        if (plantMasterId) {
            where.push(util.constructWheresForSequelize('plantMasterId', plantMasterId));
        }
        if (userMasterId) {
            where.push(util.constructWheresForSequelize('userMasterId', userMasterId));
        }
        if (responsiblityOrder) {
            where.push(util.constructWheresForSequelize('responsiblityOrder', responsiblityOrder));
        }
        let isCompleted = true;

        const Listprocess = await dal.getList({
            model: db.processFlowCompletionHistoryDetails, where, order: [['createdAt', 'desc']], include: false,
            // rowsToReturn: 30, pageIndex: 0
            //includeInnerObject: include,
        });
        // console.log("processFlowCompletionHistoryDetails", Listprocess);
        const datareturn = Listprocess && Listprocess[0];
        return datareturn;

    }
    catch (error) {
        return undefined;
    }
};

const get_AuditObservationForAudit = async (req, res) => {
    try {
        let auditPlanDetailsId = req.query && req.query.auditPlanDetailsId ? req.query.auditPlanDetailsId : '';
        let auditType = req.query && req.query.auditType ? req.query.auditType : '';
        db.sequelize.query('call asp_HRA_AuditObservationMaster_Get_ObservationForExecution(:p_AuditPlantDetailsId,:p_AuditType)', {
            replacements: {
                p_AuditPlantDetailsId: auditPlanDetailsId,
                p_AuditType: auditType
            }
        }).then(result => {
            responseHelper.success(res, 200, result, 'Audit Observation details!!', -1, result.length);
        }).catch(err => {
            responseHelper.error(res, err.code ? err.code : codes.ERROR, err, "Error in fatching data !!")
        });
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'Error in fatching audit details');
    }
};
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
//#region Self Audit Planning
const getLastSelfAuditBasicDetails = async (yearMasterId, isActive) => {
    try {
        const selfAuditDetails = await db.selfAuditPlanBasicDetails.findOne({
            order: [['`sequenceNumber1`', 'desc']],
            limit: 1,
            where: {
                'yearMasterId': yearMasterId ? yearMasterId : undefined,
                'active': 1
            },
            //attributes: ['sequenceNumber1']
        });
        //console.log("selfAuditDetails : ", selfAuditDetails);
        return selfAuditDetails;
    }
    catch (error) {
        return undefined;
    }
};
const getLastSelfAuditDetails = async (companyMasterId, plantMasterId, isActive) => {
    try {
        let where = { 'active': 1 };
        if (companyMasterId) {
            where.companyMasterId = companyMasterId;
        }
        if (plantMasterId) {
            where.plantMasterId = plantMasterId;
        }

        const selfAuditDetails = await db.selfAuditPlanDetails.findOne({
            order: [['`sequenceNumber1`', 'desc']],
            limit: 1,
            where: where
        });
        //console.log("selfAuditDetails : ", selfAuditDetails);
        return selfAuditDetails;
    }
    catch (error) {
        return undefined;
    }
};

const getLastSelfAuditDetailsP = async (companyMasterId, plantMasterId, isActive) => {
    try {
        let selfAuditDetails = undefined;

        await db.sequelize.query('call asp_SelfAuditDetails_Get_SelfAuditLastSequenceNumber(:p_CompanyMasterId,:p_PlantMasterId)', {
            replacements: {
                p_CompanyMasterId: companyMasterId,
                p_PlantMasterId: plantMasterId
            }
        }).then(result => {
            //console.log("result : ", result);
            selfAuditDetails = result;
            return result;
        }).catch(err => {
            //console.log("error : ", err);
            selfAuditDetails = undefined;
            return undefined;
        });
        return selfAuditDetails;
    }
    catch (error) {
        return undefined;
    }
};

const getLastAuditDetails = async (selfAuditPlanBasicDetailsId, selfAuditPlanDetailsId, isActive) => {
    try {
        let where = { 'active': 1 };
        if (selfAuditPlanDetailsId) {
            where.selfAuditPlanDetailsId = selfAuditPlanDetailsId;
        }
        if (selfAuditPlanBasicDetailsId) {
            where.selfAuditPlanBasicDetailsId = selfAuditPlanBasicDetailsId;
        }
        const selfAuditDetails = await db.auditPlanDetails.findOne({
            order: [['`sequenceNumber1`', 'desc']],
            limit: 1,
            where: where
        });
        //console.log("selfAuditDetails : ", selfAuditDetails);
        return selfAuditDetails;
    }
    catch (error) {
        return undefined;
    }
};
const getSelfAuditDetailsById = async (req, res) => {

    try {
        let where = [];
        where.push(util.constructWheresForSequelize('active', 1));
        where.push(util.constructWheresForSequelize('id', req.query.id));


        const include = [{
            model: db.companyMaster, as: 'company',
            where: {
                active: 1
            },
            required: true
        },
        {
            model: db.plantMaster, as: 'plant', foreignKey: 'plantMasterId',
            where: {
                active: 1,
            },
            required: true,
        },
        {
            model: db.selfAuditPlanBasicDetails, as: 'selfBasisDetails', foreignKey: 'selfAuditPlanBasicDetailsId',
            where: {
                active: 1,
            },
            required: true,
        },
        {
            model: db.user, as: 'user', foreignKey: 'leadAuditorId',
            where: {
                active: 1,
            },
            required: false,
        },
        {
            model: db.auditPlanDetails, as: 'finalAuditPlan', foreignKey: 'selfAuditPlanDetailsId',
            where: {
                active: 1,
            },
            required: false,
        }
        ];
        let Attribute = {
            include: [
                [
                    db.sequelize.literal(`(
                        SELECT
                            GROUP_CONCAT(sections.sectionName)
                            FROM tbl_HRA_SectionMaster AS sections
                           WHERE sections.active = 1
                           AND FIND_IN_SET(sections.id, selfAuditPlanDetails.multiSectionMasterId)
                    )`),
                    'sections'
                ],
                [
                    db.sequelize.literal(`(
                        SELECT
                            GROUP_CONCAT(concat(auditorTeam.firstName,'-',auditorTeam.lastName) )
                            FROM tbl_UserDetails AS  auditorTeam
                           WHERE auditorTeam.active = 1
                           AND FIND_IN_SET(auditorTeam.id, selfAuditPlanDetails.multiAuditorTeamId)
                    )`),
                    'auditorTeam'
                ],
                [
                    db.sequelize.literal(`(
                        SELECT
                            GROUP_CONCAT(concat(auditeeTeam.firstName,'-',auditeeTeam.lastName) )
                            FROM tbl_UserDetails AS auditeeTeam
                           WHERE auditeeTeam.active = 1
                           AND FIND_IN_SET(auditeeTeam.id, selfAuditPlanDetails.multiAuditeeTeamId)
                    )`),
                    'auditeeTeam'
                ]
            ]
        }

        const result = await dal.getList({ model: db.selfAuditPlanDetails, where, order: [['createdAt', 'desc']], include: false, rowsToReturn: 1, pageIndex: 0, undefined, undefined, includeInnerObject: include, includedAttributes: Attribute });

        const ReturnResult = result && result[0].dataValues;
        responseHelper.success(res, codes.SUCCESS, ReturnResult);
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting Self Audit Details data');
    }
};
const getSelfAuditDetailsById_ReturnFun = async (id) => {
    try {
        const result = await dal.findById(db.selfAuditPlanDetails, id);
        return result
    }
    catch (error) {
        return undefined;
    }
};
const getSelfAuditBasicDetailsById_ReturnFun = async (id) => {
    try {
        const result = await dal.findById(db.selfAuditPlanBasicDetails, id);
        return result
    }
    catch (error) {
        return undefined;
    }
};
const getAuditPlanDetail_Function = async (selfAuditPlanDetailsId, isActive) => {
    try {

        let where = [];
        where.push(util.constructWheresForSequelize('active', 1));
        where.push(util.constructWheresForSequelize('selfAuditPlanDetailsId', selfAuditPlanDetailsId));

        const auditDetails = await dal.findOne({
            model: auditPlanDetails,
            where: where,
            include: false
        });
        //console.log("selfAuditDetails : ", selfAuditDetails);
        return auditDetails;
    }
    catch (error) {
        return undefined;
    }
};
const getSelfAuditDetails = async (req, res) => {
    try {

        let where = [];
        console.log('req.query', req.query);
        where.push(util.constructWheresForSequelize('active', 1));
        if (req.query.auditPlannedBy) {
            where.push(util.constructWheresForSequelize('auditPlannedBy', req.query.auditPlannedBy));
        }
        if (req.query.status && req.query.status === 'Executed') {
            where.push(util.constructWheresForSequelize('isAuditExecuted', 1));
        }
        if (req.query.id) {
            return getSelfAuditDetailsById(req, res);
        }
        else {
            let WhereforcompanyDeails = {
                active: 1
            };
            if (req.query.yearTypeMasterId && req.query.yearTypeMasterId !== null && req.query.yearTypeMasterId !== '') {
                WhereforcompanyDeails = {
                    active: 1,
                    yearTypeMasterId: req.query.yearTypeMasterId
                }
            }

            const include = [{
                model: db.companyMaster, as: 'company',
                where: WhereforcompanyDeails,
                required: true
            },
            {
                model: db.plantMaster, as: 'plant', foreignKey: 'plantMasterId',
                where: {
                    active: 1,
                },
                required: true,
            },
            {
                model: db.selfAuditPlanBasicDetails, as: 'selfBasisDetails', foreignKey: 'selfAuditPlanBasicDetailsId',
                where: {
                    active: 1,
                },
                required: true,
            },
            {
                model: db.auditPlanDetails, as: 'finalAuditPlan', foreignKey: 'selfAuditPlanDetailsId',
                where: {
                    active: 1,
                },
                required: false,
            }
            ];
            let Attribute = {
                include: [
                    [
                        db.sequelize.literal(`(
                            SELECT
                                GROUP_CONCAT(sections.sectionName)
                                FROM tbl_HRA_SectionMaster AS sections
                               WHERE sections.active = 1
                               AND FIND_IN_SET(sections.id, selfAuditPlanDetails.multiSectionMasterId)
                        )`),
                        'sections'
                    ],
                    [
                        db.sequelize.literal(`(
                            SELECT
                                GROUP_CONCAT(concat(auditorTeam.firstName,'-',auditorTeam.lastName) )
                                FROM tbl_UserDetails AS  auditorTeam
                               WHERE auditorTeam.active = 1
                               AND FIND_IN_SET(auditorTeam.id, selfAuditPlanDetails.multiAuditorTeamId)
                        )`),
                        'auditorTeam'
                    ],
                    [
                        db.sequelize.literal(`(
                            SELECT
                                GROUP_CONCAT(concat(auditeeTeam.firstName,'-',auditeeTeam.lastName) )
                                FROM tbl_UserDetails AS auditeeTeam
                               WHERE auditeeTeam.active = 1
                               AND FIND_IN_SET(auditeeTeam.id, selfAuditPlanDetails.multiAuditeeTeamId)
                        )`),
                        'auditeeTeam'
                    ],
                    [
                        db.sequelize.literal(`(
                            SELECT
                                GROUP_CONCAT(concat(auditorTeam.firstName,'-',auditorTeam.lastName) )
                                FROM tbl_UserDetails AS  auditorTeam
                               WHERE auditorTeam.active = 1
                               AND FIND_IN_SET(auditorTeam.id, finalAuditPlan.multiCorporateAuditorTeamId)
                        )`),
                        'coorporateAuditorTeam'
                    ],
                    [
                        db.sequelize.literal(`(
                            SELECT
                                GROUP_CONCAT(concat(auditeeTeam.firstName,'-',auditeeTeam.lastName) )
                                FROM tbl_UserDetails AS auditeeTeam
                               WHERE auditeeTeam.active = 1
                               AND FIND_IN_SET(auditeeTeam.id, finalAuditPlan.multiPlantAuditeeTeamId)
                        )`),
                        'plantAuditeeTeam'
                    ]
                ]
            }

            if (req.query.plantMasterId && req.query.plantMasterId.length > 0 && req.query.plantMasterId !== '') {
                where.push(
                    { key: 'plantMasterId', type: 'in', value: JSON.parse(req.query.plantMasterId), value2: '' }
                )
            }
            if (req.query.companyMasterId && req.query.companyMasterId.length > 0 && req.query.companyMasterId !== '') {
                where.push(
                    { key: 'companyMasterId', type: 'in', value: JSON.parse(req.query.companyMasterId), value2: '' }
                )
            }
            await dal.getList({ model: db.selfAuditPlanDetails, where, order: [['createdAt', 'desc']], include: false, rowsToReturn: req.query.rows, pageIndex: req.query.pageIndex, undefined, res, includeInnerObject: include, includedAttributes: Attribute });
            // await dal.getList({ model: db.selfAuditPlanDetails, where, order: [['createdAt', 'desc']], include, rowsToReturn: req.query.rows, pageIndex: req.query.pageIndex, res, undefined, includedAttributes: Attribute });


            //  await dal.getList({ model: db.selfAuditPlanDetails, where, order: [['createdAt', 'desc']], include: true, rowsToReturn: req.query.rows, pageIndex: req.query.pageIndex, res });
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting self audit plan details');
    }
};
const getSelfAuditDetails_ByPlantmasterID_ForReschedule = async (req, res) => {
    try {

        let where = [];
        where.push(util.constructWheresForSequelize('active', 1));
        where.push(util.constructWheresForSequelize('isAuditExecuted', 0));
        where.push(util.constructWheresForSequelize('isAuditCancelled', 0));

        const include = [{
            model: db.companyMaster, as: 'company',
            where: {
                active: 1
            },
            required: true
        },
        {
            model: db.plantMaster, as: 'plant', foreignKey: 'plantMasterId',
            where: {
                active: 1,
            },
            required: true,
        },
        {
            model: db.selfAuditPlanBasicDetails, as: 'selfBasisDetails', foreignKey: 'selfAuditPlanBasicDetailsId',
            where: {
                active: 1,
            },
            required: true,
        }
        ];
        let Attribute = {
            include: [
                [
                    db.sequelize.literal(`(
                        SELECT
                            GROUP_CONCAT(sections.sectionName SEPARATOR ' \n')
                            FROM tbl_HRA_SectionMaster AS sections
                           WHERE sections.active = 1
                           AND FIND_IN_SET(sections.id, selfAuditPlanDetails.multiSectionMasterId)
                    )`),
                    'sections'
                ]
            ]
        }

        if (req.query.plantMasterId && req.query.plantMasterId.length > 0 && req.query.plantMasterId !== '') {
            where.push(
                { key: 'plantMasterId', type: 'in', value: JSON.parse(req.query.plantMasterId), value2: '' }
            )
        }
        await dal.getList({
            model: db.selfAuditPlanDetails, where,
            //order: [['createdAt', 'desc']],
            order: [[{ model: db.companyMaster, as: 'company' }, 'companyName', 'asc'],
            [{ model: db.plantMaster, as: 'plant' }, 'plantName', 'asc'],
            ['createdAt', 'desc']],
            include, rowsToReturn: req.query.rows, pageIndex: req.query.pageIndex, res, undefined, includedAttributes: Attribute
        });

    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting self audit plan details');
    }
};
const getProcessFlowMasterDetails = async (processFlowMasterID, processFlowCode) => {

    try {
        const where = {
            [Op.or]: [{ id: processFlowMasterID }, { processFlowCode: processFlowCode }, { mobile: email }],
            active: 1
        };
        const processFlowMaster = await db.processFlowMaster.findOne({
            order: [['processFlowOrder', 'desc']],
            limit: 1,
            where: where,
            attributes: ['id', 'auditFlowMasterId', 'processFlowName', 'processFlowOrder', 'isEmployeeWiseApplicable', 'isPlantWiseApplicable', 'isCompanyWiseApplicable', 'isGroupWiseApplicable']
        });

        return processFlowMaster;
    }
    catch (error) {
        return undefined;
    }
};
const getSelfAuditDetails_ByProcedure = async (req, res) => {
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
            return getSelfAuditDetailsById(req, res);
        }
        else {
            db.sequelize.query('call asp_hra_selfAuditPlanDetails_Get_selfAuditPlanDetails(:selfAuditPlanDetailsID, :selfAuditPlanBasicDetailsId,:selfAuditNumber,:companyMasterId,:plantMasterId,:isAuditExecuted,:yearTypeMasterId,:yearMasterId)', {
                replacements: {
                    selfAuditPlanDetailsID: '',
                    selfAuditPlanBasicDetailsId: '',
                    selfAuditNumber: '',
                    companyMasterId: req.query.companyMasterId ? req.query.companyMasterId : '',
                    plantMasterId: req.query.plantMasterId ? req.query.plantMasterId : '',
                    isAuditExecuted: '',
                    yearTypeMasterId: req.query.yearTypeMasterId ? req.query.yearTypeMasterId : '',
                    yearMasterId: req.query.yearMasterId ? req.query.yearMasterId : '',
                }
            }).then(results => {
                responseHelper.success(res, 200, results, 'Self audit details list get successfully', '-1', results.length);
            }).catch(err => {
                responseHelper.error(res, err.code ? err.code : codes.ERROR, err, 'Error in self audit List  details');

            });
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting self audit Details');
    }
};
const saveSelfAuditPlanDetails = async (req, res) => {
    try {
        const selfAuditPlanning = req.body;
        //const selfAuditPlanBasicDetails = selfAuditPlanning && selfAuditPlanning.selfAuditPlanBasicDetails;
        const selfAuditPlanDetails = selfAuditPlanning && selfAuditPlanning.selfAuditPlanDetails;
        const auditPlantDetails = selfAuditPlanning && selfAuditPlanning.auditPlantDetails;
        const selectedSectionIds = selfAuditPlanning && selfAuditPlanning.selectedSectionIds;
        let auditFlowMasterId = selfAuditPlanning && selfAuditPlanning.auditFlowMasterId;
        const pkid = selfAuditPlanDetails && selfAuditPlanDetails.id ? selfAuditPlanDetails.id : undefined;
        console.log("selfAuditPlanning", selfAuditPlanning);
        if (util.missingRequiredFields('selfAuditPlanDetails', selfAuditPlanDetails, res) === '') {

            if (selfAuditPlanDetails) {

                let uuid = await dal.uuid(db.selfAuditPlanBasicDetails.name);

                let processFlowMasterId = selfAuditPlanning ? selfAuditPlanning.processFlowMasterId : '';
                let processFlowCode = selfAuditPlanning ? selfAuditPlanning.processFlowCode : '';
                let roleMasterId = selfAuditPlanning ? selfAuditPlanning.roleMasterId : '';
                let userMasterId = selfAuditPlanning ? selfAuditPlanning.userId : '';
                let statusMasterId = selfAuditPlanning ? selfAuditPlanning.statusMasterId : '';
                let userId = selfAuditPlanning ? selfAuditPlanning.userId : '';

                let selfAuditPlanBasicDetailsId = uuid;
                let yearMasterId = selfAuditPlanning && selfAuditPlanDetails ? selfAuditPlanDetails.yearMasterId : '';
                let selfAuditNumber = '';
                let multiSectionMasterId = selectedSectionIds && selectedSectionIds.join(","); //selfAuditPlanning && selfAuditPlanDetails ? selfAuditPlanDetails.multiSectionMasterId : '';
                let auditPlannedOn = new Date();
                let auditPlanRemarks = selfAuditPlanning && selfAuditPlanDetails ? selfAuditPlanDetails.auditPlanRemarks : '';
                let auditFromDate = selfAuditPlanning && selfAuditPlanDetails ? selfAuditPlanDetails.auditFromDate : new Date();
                let auditToDate = selfAuditPlanning && selfAuditPlanDetails ? selfAuditPlanDetails.auditToDate : new Date();
                let isAuditRescheduled = 0;
                let auditRescheduledOn = undefined;
                let reasonOfReschedule = '';
                let isAuditCancelled = 0;
                let auditCancelledOn = undefined;
                let cancellationRemarks = '';
                let isAuditTeamAssigned = 0;
                let teamAssignedOn = undefined;
                let teamAssignmentRemarks = '';
                let leadAuditorId = undefined;
                let multiAuditorTeamId = '';
                let multiAuditeeTeamId = '';
                let isAuditExecuted = 0;
                let auditExecutedOn = undefined;
                let auditExecutionRemarks = '';
                let auditExecutedBy = '';
                let groupSequenceNumber = 1;
                let sequenceNumber1 = 1;
                let sequenceNumber2 = 1;
                let auditPlannedBy = userId;
                let auditFinalMaxScore = 0;
                let auditFinalActualScore = 0;
                let auditFinalScorePercentage = 0;

                let companyCode = 'aapl';
                let plantCode = 'aapl';

                var selfAuditPlanDetailsToSave = [];
                var auditPlanProcessFlowCompletionDetailsToSave = [];
                var auditPlanProcessFlowCompletionHistoryDetailsToSave = [];

                const processFlowMaster = await getProcessFlowMaster(processFlowMasterId, processFlowCode);
                const processFlowResponsibility = await getProcessFlowResponsibility(processFlowMasterId, processFlowCode);
                const processFlowCompletionDetails = processFlowMaster && processFlowMaster.processFlowCompletionDetails;
                const processFlowCompletionHistoryDetails = processFlowCompletionDetails && processFlowCompletionDetails.processFlowCompletionHistoryDetails;

                let processFlowResponsibleCount = processFlowResponsibility && processFlowResponsibility.length ? processFlowResponsibility.length : 0;
                let processFlowCompletedCount = processFlowCompletionHistoryDetails && processFlowCompletionHistoryDetails.length ? processFlowCompletionHistoryDetails.length : 0;

                let isEditable = false;
                let isCompleted = true;
                let isEdited = false;
                let completedOn = new Date();
                let isApprovalRequired = false;
                let isApproved = true;
                let isSendBack = false;
                let isRejected = false;
                let approvalDate = new Date();
                let agging = 0;
                if (processFlowMaster) {
                    isEditable = processFlowMaster && processFlowCode.isEditableBeforeNextStepCompletion ? processFlowCode.isEditableBeforeNextStepCompletion : false;
                    isApprovalRequired = processFlowMaster && processFlowMaster.isApprovalRequired ? processFlowMaster.isApprovalRequired : false;
                    isApproved = isApprovalRequired ? !isApprovalRequired : true;
                    if (processFlowResponsibility) {
                        isCompleted = ((processFlowResponsibleCount ? processFlowResponsibleCount : 1) === (processFlowCompletedCount ? processFlowCompletedCount + 1 : 1)) ? true : false;
                    }
                }

                let companySequence = [];
                let auditCounter = 0;
                for (let item of auditPlantDetails) {
                    let uuid2 = await dal.uuid(db.selfAuditPlanDetails.name);
                    //console.log("plant item : ", item);
                    let selfAuditPlanDetailsId = uuid2;
                    let companyMasterId = item.companyMasterId ? item.companyMasterId : '';
                    let plantMasterId = item.plantMasterId ? item.plantMasterId : '';

                    let lastAuditSequence = await getLastSelfAuditDetailsP(companyMasterId, plantMasterId, true);
                    if (lastAuditSequence && lastAuditSequence != null && lastAuditSequence != undefined && lastAuditSequence !== '') {
                        groupSequenceNumber = lastAuditSequence[0] && lastAuditSequence[0].groupSequenceNumber ? lastAuditSequence[0].groupSequenceNumber : 0;
                        sequenceNumber1 = lastAuditSequence[0] && lastAuditSequence[0].sequenceNumber1 ? lastAuditSequence[0].sequenceNumber1 : 0;
                        sequenceNumber2 = lastAuditSequence[0] && lastAuditSequence[0].sequenceNumber2 ? lastAuditSequence[0].sequenceNumber2 : 0;
                        companyCode = lastAuditSequence[0] && lastAuditSequence[0].companyCode ? lastAuditSequence[0].companyCode : '';
                        plantCode = lastAuditSequence[0] && lastAuditSequence[0].plantCode ? lastAuditSequence[0].plantCode : '';
                    }
                    else {
                        groupSequenceNumber = 0;
                        sequenceNumber1 = 0;
                        sequenceNumber2 = 0;
                        companyCode = 'aapl';
                        plantCode = 'aapl';
                    }

                    if (companySequence && companySequence.length > 0) 
                    
                    

                    // sequenceNumber1 = 0;
                    // let lastAudit = await getLastSelfAuditDetails(companyMasterId, null, true);
                    // //console.log("lastAudit : ", lastAudit);
                    // if (lastAudit && lastAudit.sequenceNumber1)
                    //     sequenceNumber1 = lastAudit.sequenceNumber1;
                    // else
                    //     sequenceNumber1 = 0;

                    // sequenceNumber2 = 0;
                    // let lastAudit2 = await getLastSelfAuditDetails(companyMasterId, plantMasterId, true);
                    // //console.log("lastAudit2 : ", lastAudit2);
                    // if (lastAudit2 && lastAudit2.sequenceNumber2)
                    //     sequenceNumber2 = lastAudit2.sequenceNumber2;
                    // else
                    //     sequenceNumber2 = 0;

                    groupSequenceNumber = groupSequenceNumber ? (groupSequenceNumber + auditCounter) + 1 : auditCounter + 1;
                    sequenceNumber1 = sequenceNumber1 ? sequenceNumber1 + 1 : 1;
                    sequenceNumber2 = sequenceNumber2 ? sequenceNumber2 + 1 : 1;

                    //selfAuditNumber = companyCode + '/' + plantCode + '/self-audit/' + sequenceNumber1 + '/' + sequenceNumber2 + '/' + groupSequenceNumber;
                    selfAuditNumber = companyCode + '/' + plantCode + '/self-audit/' + sequenceNumber2 + '/' + groupSequenceNumber;

                    let auditPlanDetails = {
                        id: selfAuditPlanDetailsId,
                        auditFlowMasterId: auditFlowMasterId,
                        selfAuditPlanBasicDetailsId: selfAuditPlanBasicDetailsId,
                        processFlowMasterId: processFlowMasterId,
                        companyMasterId: companyMasterId,
                        plantMasterId: plantMasterId,
                        selfAuditNumber: selfAuditNumber,
                        multiSectionMasterId: multiSectionMasterId,
                        auditPlannedOn: auditPlannedOn,
                        auditPlanRemarks: auditPlanRemarks,
                        auditFromDate: auditFromDate,
                        auditToDate: auditToDate ? auditToDate : null,
                        isAuditRescheduled: isAuditRescheduled,
                        auditRescheduledOn: auditRescheduledOn,
                        reasonOfReschedule: reasonOfReschedule,
                        isAuditCancelled: isAuditCancelled,
                        auditCancelledOn: auditCancelledOn,
                        cancellationRemarks: cancellationRemarks,
                        isAuditTeamAssigned: isAuditTeamAssigned,
                        teamAssignedOn: teamAssignedOn,
                        teamAssignmentRemarks: teamAssignmentRemarks,
                        leadAuditorId: leadAuditorId,
                        multiAuditorTeamId: multiAuditorTeamId,
                        multiAuditeeTeamId: multiAuditeeTeamId,
                        isAuditExecuted: isAuditExecuted,
                        auditExecutedOn: auditExecutedOn,
                        auditExecutionRemarks: auditExecutionRemarks,
                        auditExecutedBy: auditExecutedBy,
                        groupSequenceNumber: groupSequenceNumber,
                        sequenceNumber1: sequenceNumber1,
                        sequenceNumber2: sequenceNumber2,
                        auditPlannedBy: auditPlannedBy,
                        auditFinalMaxScore: auditFinalMaxScore,
                        auditFinalActualScore: auditFinalActualScore,
                        auditFinalScorePercentage: auditFinalScorePercentage,
                        newRecord: true
                    }
                    selfAuditPlanDetailsToSave.push(auditPlanDetails);


                    let uuid3 = await dal.uuid(db.selfAuditPlanDetails.name);
                    let processFlowCompletionDetailsId = uuid3;
                    let auditPlanProcessFlowCompletionDetails = {
                        id: processFlowCompletionDetailsId,
                        auditPlanDetailsId: selfAuditPlanDetailsId,
                        processFlowMasterId: processFlowMasterId,
                        auditPlanSubDetailsId: selfAuditPlanDetailsId,
                        isEditable: isEditable,
                        isCompleted: isCompleted,
                        isEdited: isEdited,
                        completedOn: completedOn,
                        statusMasterId: statusMasterId,
                        isApprovalRequired: isApprovalRequired,
                        isApproved: isApproved ? isApproved : null,
                        isSendBack: isSendBack,
                        isRejected: isRejected,
                        approvalDate: approvalDate,
                        agging: agging
                    }
                    auditPlanProcessFlowCompletionDetailsToSave.push(auditPlanProcessFlowCompletionDetails);

                    let uuid4 = await dal.uuid(db.selfAuditPlanDetails.name);
                    let processFlowCompletionHistoryDetailsId = uuid4;
                    let auditPlanProcessFlowHistoryCompletionDetails = {
                        id: processFlowCompletionHistoryDetailsId,
                        processFlowCompletionDetailsId: processFlowCompletionDetailsId,
                        roleMasterId: roleMasterId,
                        companyMasterId: companyMasterId,
                        plantMasterId: plantMasterId,
                        userMasterId: userMasterId,
                        statusMasterId: statusMasterId,
                        isCompleted: true,
                        completedOn: completedOn,
                        isApproved: isApproved ? isApproved : null,
                        isSendBack: isSendBack,
                        isRejected: isRejected,
                        remarks: auditPlanRemarks,
                        agging: agging,
                        responsiblityOrder: processFlowCompletedCount ? processFlowCompletedCount + 1 : 1
                    }
                    auditPlanProcessFlowCompletionHistoryDetailsToSave.push(auditPlanProcessFlowHistoryCompletionDetails);

                    auditCounter = auditCounter + 1;
                }

                let bSequenceNumber1 = '';
                let lastAuditBasicDetails = await getLastSelfAuditBasicDetails(yearMasterId, true);
                //console.log("lastAuditBasicDetails : ", lastAuditBasicDetails);
                if (lastAuditBasicDetails && lastAuditBasicDetails.sequenceNumber1)
                    bSequenceNumber1 = lastAuditBasicDetails.sequenceNumber1 + 1;
                else
                    bSequenceNumber1 = 1;


                const selfAuditPlanBasicDetailsToSave = {
                    id: selfAuditPlanBasicDetailsId,
                    auditPlanNumber: 'self-audit-' + bSequenceNumber1,
                    yearMasterId: yearMasterId,
                    multiSectionMasterId: multiSectionMasterId,
                    auditPlanRemarks: auditPlanRemarks,
                    auditPlannedBy: userId,
                    auditPlantDate: new Date(),
                    sequenceNumber1: bSequenceNumber1,
                    newRecord: true
                }
                // console.log("selfAuditPlanBasicDetailsToSave : ", selfAuditPlanBasicDetailsToSave);
                // console.log("selfAuditPlanDetailsToSave : ", selfAuditPlanDetailsToSave);
                // console.log("auditPlanProcessFlowCompletionDetailsToSave : ", auditPlanProcessFlowCompletionDetailsToSave);
                //  console.log("auditPlanProcessFlowCompletionHistoryDetailsToSave : ", auditPlanProcessFlowCompletionHistoryDetailsToSave);

                const selefAuditBasicDetailsResult = await dal.saveData(db.selfAuditPlanBasicDetails, selfAuditPlanBasicDetailsToSave, undefined, req.user.id, null, 1, true)
                let selfAuditPlanDetailsResult = undefined;
                let processFlowCompletionResult = undefined;
                let processFlowCompletionHistoryResult = undefined;
                if (selefAuditBasicDetailsResult && selfAuditPlanDetailsToSave && selfAuditPlanDetailsToSave != []) {
                    selfAuditPlanDetailsResult = await dal.bulkCreate(db.selfAuditPlanDetails, selfAuditPlanDetailsToSave, req.user.id);

                    //-------Update process flow completion histor-----------//
                    processFlowCompletionResult = await dal.bulkCreate(db.processFlowCompletionDetails, auditPlanProcessFlowCompletionDetailsToSave, req.user.id);
                    if (processFlowCompletionResult) {
                        processFlowCompletionHistoryResult = await dal.bulkCreate(db.processFlowCompletionHistoryDetails, auditPlanProcessFlowCompletionHistoryDetailsToSave, req.user.id);
                    }
                }
                if (selefAuditBasicDetailsResult) {
                    responseHelper.success(res, 200, selefAuditBasicDetailsResult, 'Record saved successfully', selefAuditBasicDetailsResult.id);
                }
                else {
                    responseHelper.error(res, selefAuditBasicDetailsResult, 502, 'Error in saving data');
                }

            }
            else {
                responseHelper.error(res, "error", codes.ERROR, 'please provide all required field');
            }
        }
        else {
            console.log("Backend Self Audit Planning Data else condition", req)
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'saving Self Audit Planning');
    }
};
const getSelfAuditDetails_OnlyReturnData = async (Ids) => {
    try {

        let where = [];
        where.push(util.constructWheresForSequelize('active', 1));

        where.push(
            { key: 'id', type: 'in', value: JSON.parse(Ids), value2: '' }
        )
        const Result = await dal.getList({ model: db.selfAuditPlanDetails, where, order: [['createdAt', 'desc']], include: false });
        return Result;
    }
    catch (error) {
        return undefined
    }
};
const rescheduleSelfAuditPlanDetails = async (req, res) => {
    try {
        const rescheduleDetails = req.body;
        let ExistingData = null;
        const UserID = req.user.id;
        const selfAuditPlanDetails = rescheduleDetails.SelfAuditDetails;
        const SelectedSelfAuditDetailsIds = rescheduleDetails.SelectedSelfAuditDetailsIds ? rescheduleDetails.SelectedSelfAuditDetailsIds : undefined;
        if (SelectedSelfAuditDetailsIds) {
            ExistingData = await getSelfAuditDetails_OnlyReturnData(SelectedSelfAuditDetailsIds)
            // console.log("ExistingData", ExistingData);
            if (ExistingData) {
                for (var i = 0; i < ExistingData.length; i++) {
                    ExistingData[i].dataValues.selfAuditPlanDetailsId = ExistingData[i].id;
                    delete ExistingData[i].dataValues.id;
                    // dataInvoiceAcceptance[i].push({ invoiceLogDetailsId: LogDetailsId })
                }
                const ResultExist = await dal.bulkCreate(db.selfAuditPlanLogDetails, ExistingData, UserID);
                //console.log("ResultExist", ResultExist);
                if (util.missingRequiredFields('selfAuditPlanDetails', selfAuditPlanDetails, res) === '') {
                    const Result = await dal.bulkUpdate(db.selfAuditPlanDetails, selfAuditPlanDetails, UserID);
                    responseHelper.success(res, 200, selfAuditPlanDetails, 'Record saved successfully', '-1');
                }
                else {
                    console.log("Backend Self Audit rescheduling Data else condition", req)
                }
            }
            else {
                responseHelper.error(res, 'Selected audit Id Not Found', codes.ERROR, 'saving Self Audit rescheduling');

            }
        }
        else {
            responseHelper.error(res, 'Selected audit Id Not Found', codes.ERROR, 'saving Self Audit rescheduling');
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'saving Self Audit rescheduling');
    }
};
const cancelSelfAuditPlan = async (req, res) => {
    let selfAuditPlan = req.body;
    // const body = {
    // 	...req.body,
    // 	source: req.appName
    // };

    try {

        //  console.log("api req 1 - body ", selfAuditPlan);

        // const selfAuditPlan = await _findUserWithId(req.body.id);
        // const isAuditCancelled = req.body.isAuditCancelled;
        // const auditCancelledOn = req.body.auditCancelledOn;
        // const cancellationRemarks = req.body.cancellationRemarks;

        // const selfAuditPlanData = {
        // 	id: selfAuditPlan.id,
        // 	isAuditCancelled: isAuditCancelled,
        // 	cancellationRemarks: auditCancelledOn,
        // 	cancellationRemarks: cancellationRemarks
        // };
        dal.saveData(db.selfAuditPlanDetails, selfAuditPlan);
        requestType = 'Cancel-Audit';
        //console.log('cancellationRemarks', selfAuditPlan.cancellationRemarks);
        responseHelper.success(res, 200, {}, 'Self Audit Cancel Successfully');
    }
    catch (error) {
        console.log('error: ', error);
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'Authentication Error');
    }
};
const UpdateSelfAuditPlanDetails = async (req, res) => {
    try {
        const selfAuditPlanDetails = req.body;
        if (util.missingRequiredFields('selfAuditPlanDetails', selfAuditPlanDetails, res) === '') {

            if (selfAuditPlanDetails) {
                await dal.saveData(db.selfAuditPlanDetails, selfAuditPlanDetails, res, req.user.id);

            }
            else {
                responseHelper.error(res, "error", codes.ERROR, 'please provide all required field');
            }
        }
        else {
            console.log("Backend  update Self Audit Planning Data else condition", req)
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'update Self Audit Planning');
    }
};
const getSelfAuditDetails_ByProcessResponsibilityWise = async (req, res) => {

    try {
        db.sequelize.query('call asp_HRA_ProcessFlowCompletion_Get_ProcessFlowCompletiondetails(:pra_ProcessFlowMasterId, :pra_ProcessFlowCode, :pra_RoleMasterId, :pra_CompanyMasterId,:pra_PlantMasterId,:pra_EmployeeMasterId)',
            {
                replacements: {
                    pra_ProcessFlowMasterId: req.query.processFlowMasterId ? req.query.processFlowMasterId : '',
                    pra_ProcessFlowCode: req.query.processFlowCode ? req.query.processFlowCode : '',
                    pra_RoleMasterId: req.query.roleMasterId ? req.query.roleMasterId : '',
                    pra_CompanyMasterId: req.query.companyMasterId ? req.query.companyMasterId : '',
                    pra_PlantMasterId: req.query.plantMasterId ? req.query.plantMasterId : '',
                    pra_EmployeeMasterId: req.query.employeeMasterId ? req.query.employeeMasterId : ''
                }
            }).then(results => {
                responseHelper.success(res, 200, results, 'Self Audit Details List successfully', '-1', results.length);
            }).catch(err => {
                responseHelper.error(res, err.code ? err.code : codes.ERROR, err, 'Error in Self Audit details');

            });
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting Self Audit Details');
    }
};
//#endregion
//#region Prcess Flow 
const getProcessFlowMaster = async (processFlowMasterId, processFlowCode, auditPlanDetailsId, auditPlanSubDetailsId, isCompleted, isActive) => {
    try {
        let where = [];
        where.push(util.constructWheresForSequelize('active', 1));
        if (processFlowMasterId) {
            where.push(util.constructWheresForSequelize("id", processFlowMasterId));
        }
        if (processFlowCode) {
            where.push(util.constructWheresForSequelize("processFlowCode", processFlowCode));
        }

        if (!processFlowMasterId && !processFlowCode) {
            return undefined;
        }
        else {
            const include = [{
                model: db.processFlowCompletionDetails, foreignKey: 'processFlowMasterId', as: 'processFlowCompletionDetails',
                where: {
                    auditPlanDetailsId: auditPlanDetailsId,
                    auditPlanSubDetailsId: auditPlanSubDetailsId,
                    active: 1
                },
                required: false,
                include: [{
                    model: db.processFlowCompletionHistoryDetails, foreignKey: 'processFlowCompletionDetailsId', as: 'processFlowCompletionHistoryDetails',
                    where: {
                        isCompleted: isCompleted ? isCompleted : 1,
                        active: 1,
                    },
                    required: false,
                }]
            }];
            console.log("process Flow Order where : ", where);

            const processFlowResponsibility = await dal.findOne({
                model: db.processFlowResponsibilityMaster,
                where,
                include: true,
                includeLevels: 4,
                includeInnerObject: include,
                sortOrder: [['processFlowOrder', 'desc']],
            });

            // const processFlowMaster = await db.processFlowMaster.findOne({
            //     //order: ['`sequenceNumber1`', 'desc'],
            //     limit: 1,
            //     where: where,
            //     //attributes: ['sequenceNumber1']
            // });
            //        console.log("processFlowMaster", processFlowMaster);
            return processFlowMaster;
        }
    }
    catch (error) {
        return undefined;
    }
};
const getProcessFlowMaster_New = async (processFlowMasterId, processFlowCode, auditPlanDetailsId, auditPlanSubDetailsId, isCompleted, isActive) => {
    try {
        let where = [];
        where.push(util.constructWheresForSequelize('active', 1));
        if (processFlowMasterId) {
            where.push(util.constructWheresForSequelize("id", processFlowMasterId));
        }
        if (processFlowCode) {
            where.push(util.constructWheresForSequelize("processFlowCode", processFlowCode));
        }

        const include = [{
            model: db.processFlowCompletionDetails, foreignKey: 'processFlowMasterId', as: 'processFlowCompletionDetails',
            where: {
                auditPlanDetailsId: auditPlanDetailsId,
                auditPlanSubDetailsId: auditPlanSubDetailsId,
                active: 1
            },
            required: false,
            include: [{
                model: db.processFlowCompletionHistoryDetails, foreignKey: 'processFlowCompletionDetailsId', as: 'processFlowCompletionHistoryDetails',
                where: {
                    isCompleted: isCompleted ? isCompleted : 1,
                    active: 1,
                },
                required: false,
            }]
        }];

        const Listprocess = await dal.getList({
            model: db.processFlowMaster, where, order: [['processFlowOrder', 'desc']], include: false,
            rowsToReturn: 30, pageIndex: 0
            //  includeInnerObject: include,
        });

        // console.log("Listprocess 2 ", Listprocess.processFlowMaster.dataValues);
        //console.log("Listprocess 4 ", Listprocess[0].processFlowMaster.dataValues);
        // const processFlowMaster = await dal.findOne({
        //     model: db.processFlowMaster,
        //     where,
        //     include: false,
        //     includeLevels: 3,
        //     includeInnerObject: include,
        //     sortOrder: [['processFlowOrder', 'desc']],
        // });

        const datareturn = Listprocess && Listprocess[0];
        return datareturn;// Listprocess[0].dataValues;

    }
    catch (error) {
        return undefined;
    }
};
const getProcessFlowResponsibility = async (processFlowMasterId, processFlowCode, auditPlanDetailsId, auditPlanSubDetailsId, isActive) => {
    try {
        let where = [];
        where.push(util.constructWheresForSequelize('active', 1));
        if (processFlowMasterId) {
            where.push(util.constructWheresForSequelize('processFlowMasterId', processFlowMasterId));
        }
        // if (processFlowCode) {
        //     where.push(util.constructWheresForSequelize('processFlowCode', processFlowCode));
        // }
        if (!processFlowMasterId) {
            return undefined;
        }
        else {
            console.log("where : ", where);
            const processFlowResponsibility = await dal.getList({
                model: db.processFlowResponsibilityMaster,
                where,
                order: [['responsiblityOrder', 'desc']],
                include: true,
                //rowsToReturn: req.query.rows, 
                //pageIndex: req.query.pageIndex,
                //undefined
            });

            return processFlowResponsibility;
        }
    }
    catch (error) {
        return undefined;
    }
};
const _saveProcessFlowCompletionDetails = async (auditPlanMasterId, auditPlanSubDetailsId, processFlowMasterId, processFlowCode, roleMasterId, companyMasterId, plantMasterId, userMasterId, statusMasterId) => {
    try {

    }
    catch (error) {

    }
};
//#endregion
//#region Pending Task  Dashboard Link
const getProcessFlowCompletiondetails_ForPendingTaskDashboard = async (req, res) => {
    try {
        db.sequelize.query('call asp_HRA_ProcessFlowMaster_Get_ProcessFlowCompletiondetails(:pra_ProcessFlowMasterId, :pra_ProcessFlowCode, :pra_RoleMasterId, :pra_CompanyMasterId,:pra_PlantMasterId,:pra_EmployeeMasterId)',
            {
                replacements: {
                    pra_ProcessFlowMasterId: req.query.processFlowMasterId ? req.query.processFlowMasterId : '',
                    pra_ProcessFlowCode: req.query.processFlowCode ? req.query.processFlowCode : '',
                    pra_RoleMasterId: req.query.roleMasterId ? req.query.roleMasterId : '',
                    pra_CompanyMasterId: req.query.companyMasterId ? req.query.companyMasterId : '',
                    pra_PlantMasterId: req.query.plantMasterId ? req.query.plantMasterId : '',
                    pra_EmployeeMasterId: req.query.employeeMasterId ? req.query.employeeMasterId : ''
                }
            }).then(results => {
                responseHelper.success(res, 200, results, 'Process Flow Master List successfully', '-1', results.length);
            }).catch(err => {
                responseHelper.error(res, err.code ? err.code : codes.ERROR, err, 'Error in Process Flow Master details');

            });
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting Process Flow Master');
    }
};
//#endregion
//#region  Execute Self Audit Details
const selfAuditDetails_getScopeMaster_byAuditPlanID = async (req, res) => {
    try {
        console.log("req.query : ", req.query);
        let auditPlanDetailsId = req.query && req.query.auditPlanDetailsId ? req.query.auditPlanDetailsId : '';
        let onlyUpdatedObservationfetch = req.query && req.query.onlyUpdatedObservationfetch ? req.query.onlyUpdatedObservationfetch : '';
        let sectionMasterId = req.query && req.query.sectionMasterId ? req.query.sectionMasterId : '';
        let subSectionMasterId = req.query && req.query.subSectionMasterId ? req.query.subSectionMasterId : '';
        let criticalityMasterId = '';
        let auditModeMasterId = '';
        db.sequelize.query('call asp_HRA_SelfAuditDetails_get_ScopeDetails(:p_AuditPlantDetailsId,:p_SectionMasterId,:p_SubSectionMasterId,:p_CriticalityMasterId,:p_AuditModeMasterId,:p_OnlyUpdatedObservationfetch)', {
            replacements: {
                p_AuditPlantDetailsId: auditPlanDetailsId,
                p_SectionMasterId: sectionMasterId,
                p_SubSectionMasterId: subSectionMasterId,
                p_CriticalityMasterId: criticalityMasterId,
                p_AuditModeMasterId: auditModeMasterId,
                p_OnlyUpdatedObservationfetch: onlyUpdatedObservationfetch
            }
        }).then(result => {
            //console.log("result : ", result);
            responseHelper.success(res, 200, result, 'Audit Scope details!!', -1, result.length);
        }).catch(err => {
            //console.log("error : ", err);
            responseHelper.error(res, err.code ? err.code : codes.ERROR, err, "Error in fatching data !!")
        });
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'Error in fatching audit details');
    }

    // try {
    //     let where = [];

    //     const auditPlanDetailsId = req.query.auditPlanDetailsId;
    //     const include = [{
    //         model: db.sectionMaster, as: 'section', foreignKey: 'sectionMasterId',
    //         where: {
    //             active: 1
    //         },
    //         // order: ['sectionName', 'asc'],
    //         required: true
    //     },
    //     {
    //         model: db.subSectionMaster, as: 'subsection', foreignKey: 'subSectionMasterId',
    //         where: {
    //             active: 1,
    //         },
    //         //  order: ['subSectionName', 'asc'],
    //         required: true,
    //     },
    //     {
    //         model: db.criticalityMaster, as: 'criticality', foreignKey: 'criticalityMasterId',
    //         where: {
    //             active: 1,
    //         },
    //         required: false,
    //     },
    //     {
    //         model: db.masterDetails, as: 'auditMode', foreignKey: 'auditModeMasterId',
    //         where: {
    //             active: 1,
    //         },
    //         required: false,
    //     },
    //     {
    //         model: db.auditObservationDetails, as: 'scopeAuditobservation', foreignKey: 'scopeMasterId',
    //         where: {
    //             active: 1,
    //             auditPlanDetailsId: auditPlanDetailsId ? auditPlanDetailsId : undefined,
    //         },
    //         required: false,
    //     },
    //     {
    //         model: db.mediaDetails, as: 'scoreMedia', foreignKey: 'scopeMasterId',
    //         where: {
    //             active: 1,
    //             auditPlanDetailsId: auditPlanDetailsId ? auditPlanDetailsId : undefined,
    //         },
    //         required: false,
    //     }
    //     ];
    //     where.push(util.constructWheresForSequelize('active', 1));
    //     if (req.query.sectionMasterId && req.query.sectionMasterId !== null && req.query.sectionMasterId !== "-1") {
    //         where.push(util.constructWheresForSequelize('sectionMasterId', req.query.sectionMasterId));
    //     }
    //     if (req.query.multiSectionMasterId && req.query.multiSectionMasterId !== null && req.query.multiSectionMasterId.length > 0) {
    //         where.push(
    //             { key: 'sectionMasterId', type: 'in', value: JSON.parse(req.query.multiSectionMasterId), value2: '' }
    //         )
    //     }
    //     if (req.query.subSectionMasterId && req.query.subSectionMasterId !== null && req.query.subSectionMasterId !== "-1") {
    //         where.push(util.constructWheresForSequelize('subSectionMasterId', req.query.subSectionMasterId));
    //     }
    //     if (req.query.auditModeMasterId && req.query.auditModeMasterId !== null && req.query.auditModeMasterId !== "-1") {
    //         where.push(util.constructWheresForSequelize('auditModeMasterId', req.query.auditModeMasterId));
    //     }
    //     if (req.query.criticalityMasterId && req.query.criticalityMasterId !== null && req.query.criticalityMasterId !== "-1") {
    //         where.push(util.constructWheresForSequelize('criticalityMasterId', req.query.criticalityMasterId));
    //     }
    //     await dal.getList({
    //         model: db.scopeMaster, where,
    //         order: [
    //             //[{ model: db.sectionMaster, as: `scopeMaster'.'section'` }, 'sectionName', 'asc'],
    //            // [{ model: db.subSectionMaster, as: `scopeMaster'.'subsection'` }, 'subSectionName', 'asc'],
    //             ['scopeOrder', 'asc']],
    //         include: false, rowsToReturn: req.query.rows, pageIndex: req.query.pageIndex, undefined, res, includeInnerObject: include
    //     });
    // }
    // catch (error) {
    //     responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting Scope');
    // }
};
const updateSelfAuditScore = async (req, res) => {
    try {
        const SelfAuditScoreDetails = req.body;
        //console.log("SelfAuditScoreDetails", SelfAuditScoreDetails)

        const auditPlanDetailsId = SelfAuditScoreDetails && SelfAuditScoreDetails.auditPlanDetailsId;
        const UserId = req.user.id;
        let selfPlan = null;
        const IsSave = SelfAuditScoreDetails && SelfAuditScoreDetails.isScoreSaved;
        const IsSubmit = SelfAuditScoreDetails && SelfAuditScoreDetails.isScoreSubmitted;
        const mediaDetails = SelfAuditScoreDetails && SelfAuditScoreDetails.mediaDetails;
        const auditObservationDetils = SelfAuditScoreDetails && SelfAuditScoreDetails.auditObservationDetils;
        const selfAuditPlanDetails = await getSelfAuditDetailsById_ReturnFun(auditPlanDetailsId);
        // console.log("selfAuditPlanDetails 3", selfAuditPlanDetails);
        if (IsSubmit && IsSubmit === true) {
            let auditPlanRemarks = SelfAuditScoreDetails && SelfAuditScoreDetails.auditPlanRemarks ? SelfAuditScoreDetails.auditPlanRemarks : undefined;
            var auditPlanProcessFlowCompletionDetailsToSave = [];
            var auditPlanProcessFlowCompletionHistoryDetailsToSave = [];
            const StatusMaster = await getStatusMasterDetails(undefined, 'Approved');
            let processFlowMasterId = SelfAuditScoreDetails ? SelfAuditScoreDetails.processFlowMasterId : '';
            let processFlowCode = SelfAuditScoreDetails ? SelfAuditScoreDetails.processFlowCode : '';
            let roleMasterId = SelfAuditScoreDetails ? SelfAuditScoreDetails.roleMasterId : '';
            let userMasterId = UserId;
            let statusMasterId = SelfAuditScoreDetails ? SelfAuditScoreDetails.statusMasterId : StatusMaster && StatusMaster.id;
            let userId = UserId;
            let companyMasterId = SelfAuditScoreDetails && SelfAuditScoreDetails.companyMasterId ? SelfAuditScoreDetails.companyMasterId : undefined;
            let plantId = SelfAuditScoreDetails && SelfAuditScoreDetails.plantId ? SelfAuditScoreDetails.plantId : undefined;
            let plantMasterId = SelfAuditScoreDetails && SelfAuditScoreDetails.plantId ? SelfAuditScoreDetails.plantId : undefined;
            //  console.log("processFlowCode", processFlowCode);
            const processFlowMaster = await getProcessFlowMaster_New(processFlowMasterId, processFlowCode, auditPlanDetailsId, auditPlanDetailsId, undefined, 1);


            // console.log("processFlowMaster 2E", processFlowMaster);
            processFlowMasterId = processFlowMasterId && processFlowMasterId !== undefined ? processFlowMasterId : processFlowMaster && processFlowMaster.id;

            //  console.log("processFlowMasterId", processFlowMasterId);
            const processFlowResponsibility = await getProcessFlowResponsibility(processFlowMasterId, processFlowCode);

            const processFlowCompletionDetails = processFlowMaster && processFlowMaster.processFlowCompletionDetails;
            const processFlowCompletionHistoryDetails = processFlowCompletionDetails && processFlowCompletionDetails.processFlowCompletionHistoryDetails;

            let processFlowResponsibleCount = processFlowResponsibility && processFlowResponsibility.length ? processFlowResponsibility.length : 0;
            let processFlowCompletedCount = processFlowCompletionHistoryDetails && processFlowCompletionHistoryDetails.length ? processFlowCompletionHistoryDetails.length : 0;



            let isEditable = false;
            let isCompleted = true;
            let isEdited = false;
            let completedOn = new Date();
            let isApprovalRequired = false;
            let isApproved = true;
            let isSendBack = false;
            let isRejected = false;
            let approvalDate = new Date();
            let agging = 0;

            if (processFlowMaster) {
                isEditable = processFlowMaster && processFlowCode.isEditableBeforeNextStepCompletion ? processFlowCode.isEditableBeforeNextStepCompletion : false;
                isApprovalRequired = processFlowMaster && processFlowMaster.isApprovalRequired ? processFlowMaster.isApprovalRequired : false;
                isApproved = isApprovalRequired ? !isApprovalRequired : true;
                if (processFlowResponsibility) {
                    isCompleted = ((processFlowResponsibleCount ? processFlowResponsibleCount : 1) === (processFlowCompletedCount ? processFlowCompletedCount + 1 : 1)) ? true : false;
                }
            }

            const ExistProcessFlowCompletion = await getProcessFlowCompletionDetails(auditPlanDetailsId, processFlowMasterId, auditPlanDetailsId);
            // console.log("ExistProcessFlowCompletion", ExistProcessFlowCompletion);
            let uuid3 = await dal.uuid(db.selfAuditPlanDetails.name);
            let processFlowCompletionDetailsId = ExistProcessFlowCompletion && ExistProcessFlowCompletion !== null && ExistProcessFlowCompletion !== undefined ? ExistProcessFlowCompletion.id : uuid3;
            let auditPlanProcessFlowCompletionDetails = {
                id: processFlowCompletionDetailsId,
                auditPlanDetailsId: auditPlanDetailsId,
                processFlowMasterId: processFlowMasterId,
                auditPlanSubDetailsId: auditPlanDetailsId,
                isEditable: isEditable,
                isCompleted: isCompleted,
                isEdited: isEdited,
                completedOn: completedOn,
                statusMasterId: statusMasterId,
                isApprovalRequired: isApprovalRequired,
                isApproved: isApproved ? isApproved : null,
                isSendBack: isSendBack,
                isRejected: isRejected,
                approvalDate: approvalDate,
                agging: agging
            }

            auditPlanProcessFlowCompletionDetailsToSave.push(auditPlanProcessFlowCompletionDetails);
            let responsiblityOrder = processFlowCompletedCount ? processFlowCompletedCount + 1 : 1;
            const ExistProcessFlowCompletionHistory = await getProcessFlowCompletionHistoryDetails(processFlowCompletionDetailsId, roleMasterId, companyMasterId, plantId, userId, responsiblityOrder);

            let uuid4 = await dal.uuid(db.selfAuditPlanDetails.name);
            let processFlowCompletionHistoryDetailsId = ExistProcessFlowCompletionHistory && ExistProcessFlowCompletionHistory !== null && ExistProcessFlowCompletionHistory !== undefined ? ExistProcessFlowCompletionHistory.id : uuid4;
            let auditPlanProcessFlowHistoryCompletionDetails = {
                id: processFlowCompletionHistoryDetailsId,
                processFlowCompletionDetailsId: processFlowCompletionDetailsId,
                roleMasterId: roleMasterId,
                companyMasterId: companyMasterId,
                plantMasterId: plantMasterId,
                userMasterId: userMasterId,
                statusMasterId: statusMasterId,
                isCompleted: true,
                completedOn: completedOn,
                isApproved: isApproved ? isApproved : null,
                isSendBack: isSendBack,
                isRejected: isRejected,
                remarks: auditPlanRemarks,
                agging: agging,
                responsiblityOrder: responsiblityOrder
            }
            auditPlanProcessFlowCompletionHistoryDetailsToSave.push(auditPlanProcessFlowHistoryCompletionDetails);

            if (selfAuditPlanDetails) {
                let Data = {
                    id: selfAuditPlanDetails.id,
                    isAuditExecuted: true,
                    auditExecutedOn: new Date(),
                    auditExecutionRemarks: '',
                    auditExecutedBy: UserId
                }
                const savePlan = await dal.saveData(db.selfAuditPlanDetails, Data, undefined, UserId);
            }
            // console.log("auditPlanProcessFlowCompletionDetailsToSave", auditPlanProcessFlowCompletionDetailsToSave);
            //  console.log("auditPlanProcessFlowCompletionHistoryDetailsToSave", auditPlanProcessFlowCompletionHistoryDetailsToSave);

            let processFlowCompletionResult = undefined;
            let processFlowCompletionHistoryResult = undefined;
            processFlowCompletionResult = await dal.bulkCreate(db.processFlowCompletionDetails, auditPlanProcessFlowCompletionDetailsToSave, req.user.id);
            if (processFlowCompletionResult) {
                processFlowCompletionHistoryResult = await dal.bulkCreate(db.processFlowCompletionHistoryDetails, auditPlanProcessFlowCompletionHistoryDetailsToSave, req.user.id);
            }
        }

        const ResultExist = await dal.bulkCreate(db.auditObservationDetails, auditObservationDetils, UserId);
        if (mediaDetails && mediaDetails.length > 0) {
            const ResultMedia = await dal.bulkCreate(db.mediaDetails, mediaDetails, UserId);
            responseHelper.success(res, 200, ResultMedia, 'Record saved successfully', '-1');
        }
        else {
            responseHelper.success(res, 200, ResultExist, 'Record saved successfully', '-1');
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'update Self Audit score details');
    }
};
const get_selfAuditScoreDetails = async (req, res) => {
    try {
        let where = [];

        const isAssosciationDataRequired = req.query.isAssosciationDataRequired;
        const auditPlanDetailsId = req.query.auditPlanDetailsId;
        where.push(util.constructWheresForSequelize('active', 1));
        where.push(util.constructWheresForSequelize('auditPlanDetailsId', auditPlanDetailsId));
        //console.log('isAssosciationDataRequired', isAssosciationDataRequired);
        if (isAssosciationDataRequired) {
            const include = [
                {
                    model: db.selfAuditPlanDetails, as: 'SelfAuditobservation', foreignKey: 'auditPlanDetailsId',
                    where: {
                        active: 1
                    },
                    required: true
                },
                {
                    model: db.scopeMaster, as: 'scopeMaster', foreignKey: 'scopeMasterId',
                    where: {
                        active: 1,
                    },
                    required: true,
                    include: [
                        {
                            model: db.sectionMaster, as: 'section', foreignKey: 'sectionMasterId',
                            where: {
                                active: 1
                            },
                            required: true
                        },
                        {
                            model: db.subSectionMaster, as: 'subsection', foreignKey: 'subSectionMasterId',
                            where: {
                                active: 1,
                            },
                            required: true,
                        },
                        {
                            model: db.criticalityMaster, as: 'criticality', foreignKey: 'criticalityMasterId',
                            where: {
                                active: 1,
                            },
                            required: false,
                        },
                        {
                            model: db.masterDetails, as: 'auditMode', foreignKey: 'auditModeMasterId',
                            where: {
                                active: 1,
                            },
                            required: false,
                        },
                        {
                            model: db.mediaDetails, as: 'scoreMedia', foreignKey: 'scopeMasterId',
                            where: {
                                active: 1,
                                auditPlanDetailsId: auditPlanDetailsId ? auditPlanDetailsId : undefined,
                            },
                            required: false,
                        }
                    ]
                },
                {
                    model: db.auditObservationMaster, as: 'observationMaster', foreignKey: 'auditObservationMasterId',
                    where: {
                        active: 1
                    },
                    required: true
                }
            ];
            console.log("include", include);
            await dal.getList({
                model: db.auditObservationDetails, where, order: [
                    ['createdAt', 'desc']
                ], include: false, rowsToReturn: req.query.rows, pageIndex: req.query.pageIndex, undefined, res, includeInnerObject: include
            });
        }
        else {
            await dal.getList({ model: db.auditObservationDetails, where, order: [['createdAt', 'desc']], include: false, rowsToReturn: req.query.rows, pageIndex: req.query.pageIndex, res });
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting self score');
    }
};
//#endregion
//#region  Final Audit Planning
const getFinalAuditDetails_OnlyReturnData = async (Ids) => {
    try {

        let where = [];
        where.push(util.constructWheresForSequelize('active', 1));

        where.push(
            { key: 'id', type: 'in', value: JSON.parse(Ids), value2: '' }
        )
        const Result = await dal.getList({ model: db.auditPlanDetails, where, order: [['createdAt', 'desc']], include: false });
        return Result;
    }
    catch (error) {
        return undefined
    }
};
const getFinalAuditAuditorSectionDetails_OnlyReturnData = async (auditPlanId) => {
    try {

        let where = [];
        where.push(util.constructWheresForSequelize('auditPlanDetailsId', 1));
        where.push(util.constructWheresForSequelize('auditPlanDetailsId', auditPlanId));


        const Result = await dal.getList({ model: db.auditSectionAuditorDetails, where, order: [['createdAt', 'desc']], include: false });
        // console.log('auditSectionAuditorDetails', Result);
        return Result;
    }
    catch (error) {
        return undefined
    }
};
const getSectionDetailsBySelfAudiPlanDetailsId = async (req, res) => {
    try {
        let finalAuditDetailsId = req.query && req.query.finalAuditDetailsId ? req.query.finalAuditDetailsId : '';
        let selfAuditplanDetailsId = req.query && req.query.selfAuditplanDetailsId ? req.query.selfAuditplanDetailsId : '';
        db.sequelize.query('call asp_HRA_AuditPlanDetails_Get_SectionMasterDetails(:pra_SelfAuditPlanDetailsID,:pra_AuditPlanDetailsId)', {
            replacements: {
                pra_SelfAuditPlanDetailsID: selfAuditplanDetailsId,
                pra_AuditPlanDetailsId: finalAuditDetailsId
            }
        }).then(result => {
            //console.log("result : ", result);
            responseHelper.success(res, 200, result, 'Audit section details!!', -1, result.length);
        }).catch(err => {
            //console.log("error : ", err);
            responseHelper.error(res, err.code ? err.code : codes.ERROR, err, "Error in fatching data !!")
        });
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'Error in fatching audit section details');
    }
};
const saveFinalAuditPlanning = async (req, res) => {
    try {
        const auditPlanDetails = req.body;
        //console.log("SelfAuditScoreDetails", SelfAuditScoreDetails)

        /// const auditPlanDetailsId = SelfAuditScoreDetails && SelfAuditScoreDetails.auditPlanDetailsId;
        const UserId = req.user.id;
        const auditSectionAuditorDetails = auditPlanDetails && auditPlanDetails.auditorDetails;
        let selfAuditPlanDetailsId = auditPlanDetails && auditPlanDetails.selfAuditPlanDetailsId;
        const selfAuditPlanDetails = await getSelfAuditDetailsById_ReturnFun(selfAuditPlanDetailsId);

        let selfAuditPlanBasicDetailsId = selfAuditPlanDetails.selfAuditPlanBasicDetailsId;

        const selfAuditBasicDetails = await getSelfAuditBasicDetailsById_ReturnFun(selfAuditPlanBasicDetailsId)
        // console.log("selfAuditPlanDetails 3", selfAuditPlanDetails);

        let auditPlanRemarks = auditPlanDetails && auditPlanDetails.auditPlanRemarks ? auditPlanDetails.auditPlanRemarks : undefined;
        let auditFromDate = auditPlanDetails && auditPlanDetails.auditFromDate ? auditPlanDetails.auditFromDate : undefined;
        let auditToDate = auditPlanDetails && auditPlanDetails.auditToDate ? auditPlanDetails.auditToDate : undefined;
        let auditPlannedBy = auditPlanDetails && auditPlanDetails.auditPlannedBy ? auditPlanDetails.auditPlannedBy : UserId;
        let auditPlannedOn = auditPlanDetails && auditPlanDetails.auditPlannedOn ? auditPlanDetails.auditPlannedOn : new Date();
        let multiCorporateAuditorTeamId = auditPlanDetails && auditPlanDetails.multiCorporateAuditorTeamId ? auditPlanDetails.multiCorporateAuditorTeamId : undefined;
        let multiPlantAuditeeTeamId = auditPlanDetails && auditPlanDetails.multiPlantAuditeeTeamId ? auditPlanDetails.multiPlantAuditeeTeamId : undefined;
        let yearMasterId = selfAuditBasicDetails && selfAuditBasicDetails.yearMasterId;
        let uuid_1 = await dal.uuid(db.auditPlanDetails.name);
        let ExistingFinalAuditPlanDetails = await getAuditPlanDetail_Function(selfAuditPlanDetailsId);
        let finalAuditPlanID = ExistingFinalAuditPlanDetails && ExistingFinalAuditPlanDetails.id ? ExistingFinalAuditPlanDetails.id : uuid_1;
        const auditPlanDetailsId = finalAuditPlanID;
        var auditPlanProcessFlowCompletionDetailsToSave = [];
        var auditPlanProcessFlowCompletionHistoryDetailsToSave = [];
        var finalAuditPlanDetails = [];
        var auditSectionAuditorDetailsToSave = [];
        const StatusMaster = await getStatusMasterDetails(undefined, 'Approved');
        let processFlowMasterId = auditPlanDetails ? auditPlanDetails.processFlowMasterId : '';
        let processFlowCode = auditPlanDetails ? auditPlanDetails.processFlowCode : '';
        let roleMasterId = auditPlanDetails ? auditPlanDetails.roleMasterId : '';
        let userMasterId = UserId;
        let statusMasterId = auditPlanDetails ? auditPlanDetails.statusMasterId : StatusMaster && StatusMaster.id;
        let userId = UserId;
        let companyMasterId = auditPlanDetails && auditPlanDetails.companyMasterId ? auditPlanDetails.companyMasterId : undefined;
        let plantId = auditPlanDetails && auditPlanDetails.plantId ? auditPlanDetails.plantId : undefined;
        let plantMasterId = auditPlanDetails && auditPlanDetails.plantId ? auditPlanDetails.plantId : undefined;
        //  console.log("processFlowCode", processFlowCode);
        const plantMaster = await getplantMasterById(selfAuditPlanDetails && selfAuditPlanDetails.plantMasterId);
        const processFlowMaster = await getProcessFlowMaster_New(processFlowMasterId, processFlowCode, auditPlanDetailsId, auditPlanDetailsId, undefined, 1);
        let auditNumber = '';
        let plantCode = '';
        if (plantMaster) {
            plantCode = plantMaster && plantMaster.plantCode;
        }
        sequenceNumber1 = 0;
        let lastAudit = await getLastAuditDetails(selfAuditPlanBasicDetailsId, null, true);
        //console.log("lastAudit : ", lastAudit);
        if (lastAudit && lastAudit.sequenceNumber1)
            sequenceNumber1 = lastAudit.sequenceNumber1;
        else
            sequenceNumber1 = 0;

        sequenceNumber2 = 0;
        let lastAudit2 = await getLastAuditDetails(selfAuditPlanBasicDetailsId, selfAuditPlanDetailsId, true);
        //console.log("lastAudit2 : ", lastAudit2);
        if (lastAudit2 && lastAudit2.sequenceNumber2)
            sequenceNumber2 = lastAudit2.sequenceNumber2;
        else
            sequenceNumber2 = 0;

        sequenceNumber1 = sequenceNumber1 ? sequenceNumber1 + 1 : 1;
        sequenceNumber2 = sequenceNumber2 ? sequenceNumber2 + 1 : 1;

        auditNumber = 'final-audit/' + plantCode + '/' + sequenceNumber1 + '/' + sequenceNumber2;

        const auditFlowMasterData = await getAuditFlowDetails(undefined, 'final_Audit');
        console.log("auditFlowMasterData", auditFlowMasterData);
        let auditFlowMasterId = auditFlowMasterData && auditFlowMasterData.id;

        let finalAuditPlaninngDetails = {
            id: auditPlanDetailsId,
            auditNumber: auditNumber,
            auditFlowMasterId: auditFlowMasterId,
            selfAuditPlanBasicDetailsId: selfAuditPlanBasicDetailsId,
            selfAuditPlanDetailsId: selfAuditPlanDetailsId,
            multiCorporateAuditorTeamId: multiCorporateAuditorTeamId,
            multiPlantAuditeeTeamId: multiPlantAuditeeTeamId,
            yearMasterId: yearMasterId,
            auditPlanRemarks: auditPlanRemarks,
            auditFromDate: auditFromDate,
            auditToDate: auditToDate,
            isAuditRescheduled: false,
            isAuditCancelled: false,
            isAuditExecuted: false,
            sequencenumber1: sequenceNumber1,
            sequenceNumber2: sequenceNumber2,
            isActionPlanUpdated: false,
            auditPlannedBy: auditPlannedBy,
            auditPlannedOn: auditPlannedOn
        }
        finalAuditPlanDetails.push(finalAuditPlaninngDetails);
        // console.log("processFlowMaster 2E", processFlowMaster);

        for (let item of auditSectionAuditorDetails) {
            let uuid_n = await dal.uuid(db.auditSectionAuditorDetails.name);
            let auditSectionAuditorDetails_Single = {
                id: uuid_n,
                auditPlanDetailsId: auditPlanDetailsId,
                sectionMasterId: item.sectionMasterId ? item.sectionMasterId : undefined,
                auditorMasterId: item.auditorMasterId ? item.auditorMasterId : undefined,
            }
            auditSectionAuditorDetailsToSave.push(auditSectionAuditorDetails_Single);
        }
        processFlowMasterId = processFlowMasterId && processFlowMasterId !== undefined ? processFlowMasterId : processFlowMaster && processFlowMaster.id;

        //  console.log("processFlowMasterId", processFlowMasterId);
        const processFlowResponsibility = await getProcessFlowResponsibility(processFlowMasterId, processFlowCode);
        const processFlowCompletionDetails = processFlowMaster && processFlowMaster.processFlowCompletionDetails;
        const processFlowCompletionHistoryDetails = processFlowCompletionDetails && processFlowCompletionDetails.processFlowCompletionHistoryDetails;

        let processFlowResponsibleCount = processFlowResponsibility && processFlowResponsibility.length ? processFlowResponsibility.length : 0;
        let processFlowCompletedCount = processFlowCompletionHistoryDetails && processFlowCompletionHistoryDetails.length ? processFlowCompletionHistoryDetails.length : 0;



        let isEditable = false;
        let isCompleted = true;
        let isEdited = false;
        let completedOn = new Date();
        let isApprovalRequired = false;
        let isApproved = true;
        let isSendBack = false;
        let isRejected = false;
        let approvalDate = new Date();
        let agging = 0;

        if (processFlowMaster) {
            isEditable = processFlowMaster && processFlowCode.isEditableBeforeNextStepCompletion ? processFlowCode.isEditableBeforeNextStepCompletion : false;
            isApprovalRequired = processFlowMaster && processFlowMaster.isApprovalRequired ? processFlowMaster.isApprovalRequired : false;
            isApproved = isApprovalRequired ? !isApprovalRequired : true;
            if (processFlowResponsibility) {
                isCompleted = ((processFlowResponsibleCount ? processFlowResponsibleCount : 1) === (processFlowCompletedCount ? processFlowCompletedCount + 1 : 1)) ? true : false;
            }
        }

        const ExistProcessFlowCompletion = await getProcessFlowCompletionDetails(auditPlanDetailsId, processFlowMasterId, auditPlanDetailsId);
        // console.log("ExistProcessFlowCompletion", ExistProcessFlowCompletion);
        let uuid3 = await dal.uuid(db.selfAuditPlanDetails.name);
        let processFlowCompletionDetailsId = ExistProcessFlowCompletion && ExistProcessFlowCompletion !== null && ExistProcessFlowCompletion !== undefined ? ExistProcessFlowCompletion.id : uuid3;
        let auditPlanProcessFlowCompletionDetails = {
            id: processFlowCompletionDetailsId,
            auditPlanDetailsId: auditPlanDetailsId,
            processFlowMasterId: processFlowMasterId,
            auditPlanSubDetailsId: auditPlanDetailsId,
            isEditable: isEditable,
            isCompleted: isCompleted,
            isEdited: isEdited,
            completedOn: completedOn,
            statusMasterId: statusMasterId,
            isApprovalRequired: isApprovalRequired,
            isApproved: isApproved ? isApproved : null,
            isSendBack: isSendBack,
            isRejected: isRejected,
            approvalDate: approvalDate,
            agging: agging
        }

        auditPlanProcessFlowCompletionDetailsToSave.push(auditPlanProcessFlowCompletionDetails);
        let responsiblityOrder = processFlowCompletedCount ? processFlowCompletedCount + 1 : 1;
        const ExistProcessFlowCompletionHistory = await getProcessFlowCompletionHistoryDetails(processFlowCompletionDetailsId, roleMasterId, companyMasterId, plantId, userId, responsiblityOrder);

        let uuid4 = await dal.uuid(db.selfAuditPlanDetails.name);
        let processFlowCompletionHistoryDetailsId = ExistProcessFlowCompletionHistory && ExistProcessFlowCompletionHistory !== null && ExistProcessFlowCompletionHistory !== undefined ? ExistProcessFlowCompletionHistory.id : uuid4;
        let auditPlanProcessFlowHistoryCompletionDetails = {
            id: processFlowCompletionHistoryDetailsId,
            processFlowCompletionDetailsId: processFlowCompletionDetailsId,
            roleMasterId: roleMasterId,
            companyMasterId: companyMasterId,
            plantMasterId: plantMasterId,
            userMasterId: userMasterId,
            statusMasterId: statusMasterId,
            isCompleted: true,
            completedOn: completedOn,
            isApproved: isApproved ? isApproved : null,
            isSendBack: isSendBack,
            isRejected: isRejected,
            remarks: auditPlanRemarks,
            agging: agging,
            responsiblityOrder: responsiblityOrder
        }
        auditPlanProcessFlowCompletionHistoryDetailsToSave.push(auditPlanProcessFlowHistoryCompletionDetails);

        let ResultExist = await dal.bulkCreate(db.auditPlanDetails, finalAuditPlanDetails, UserId)
        let ResultSectionAudito = await dal.bulkCreate(db.auditSectionAuditorDetails, auditSectionAuditorDetailsToSave, UserId)
        let processFlowCompletionResult = undefined;
        let processFlowCompletionHistoryResult = undefined;
        processFlowCompletionResult = await dal.bulkCreate(db.processFlowCompletionDetails, auditPlanProcessFlowCompletionDetailsToSave, UserId);
        if (processFlowCompletionResult) {
            processFlowCompletionHistoryResult = await dal.bulkCreate(db.processFlowCompletionHistoryDetails, auditPlanProcessFlowCompletionHistoryDetailsToSave, UserId);
        }
        responseHelper.success(res, 200, ResultExist, 'Record saved successfully', '-1');

    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'update Self Audit score details');
    }
};
const rescheduleFinalAuditPlanDetails = async (req, res) => {
    try {
        const rescheduleDetails = req.body;
        let ExistingData = null;
        const UserID = req.user.id;
        const finalAuditPlanDetails = rescheduleDetails.auditDetails;
        const SelectedAuditDetailsIds = rescheduleDetails.SelectedAuditDetailsIds ? rescheduleDetails.SelectedAuditDetailsIds : undefined;
        if (SelectedAuditDetailsIds) {
            ExistingData = await getFinalAuditDetails_OnlyReturnData(SelectedAuditDetailsIds)
            // console.log("ExistingData", ExistingData);
            if (ExistingData) {
                for (var i = 0; i < ExistingData.length; i++) {
                    ExistingData[i].dataValues.auditPlanDetailsId = ExistingData[i].id;
                    delete ExistingData[i].dataValues.id;
                    // dataInvoiceAcceptance[i].push({ invoiceLogDetailsId: LogDetailsId })
                }
                const ResultExist = await dal.bulkCreate(db.auditPlanLogDetails, ExistingData, UserID);
                //console.log("ResultExist", ResultExist);
                if (util.missingRequiredFields('auditPlanDetails', finalAuditPlanDetails, res) === '') {
                    const Result = await dal.bulkUpdate(db.auditPlanDetails, finalAuditPlanDetails, UserID);
                    responseHelper.success(res, 200, finalAuditPlanDetails, 'Record saved successfully', '-1');
                }
                else {
                    console.log("Backend Final Audit rescheduling Data else condition", req)
                }
            }
            else {
                responseHelper.error(res, 'Selected audit Id Not Found', codes.ERROR, 'saving Final Audit rescheduling');

            }
        }
        else {
            responseHelper.error(res, 'Selected audit Id Not Found', codes.ERROR, 'saving Final Audit rescheduling');
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'saving Self Audit rescheduling');
    }
};
const updateFinalAuditPlanDetails = async (req, res) => {
    try {
        const auditPlanDetails = req.body;
        const UserId = req.user.id;
        var Ids = [];
        // console.log("auditPlanDetails", auditPlanDetails);
        let auditorDetails = auditPlanDetails.auditorDetails && auditPlanDetails.auditorDetails;
        if (util.missingRequiredFields('auditPlanDetails', auditPlanDetails, res) === '') {
            if (auditorDetails) {
                const auditPlanIds = auditPlanDetails && auditPlanDetails.id;
                const existindAuditorDetails = await getFinalAuditAuditorSectionDetails_OnlyReturnData(auditPlanIds);
                //  console.log("auditorDetails", auditorDetails);
                for (var i = 0; i < auditorDetails.length; i++) {
                    delete auditorDetails[i].sectionName;
                    delete auditorDetails[i].sectionCode;
                    delete auditorDetails[i].sectionOrder;
                    delete auditorDetails[i].auditType;
                    delete auditorDetails[i].auditTypeId;
                    delete auditorDetails[i].auditTypeCode;
                    delete auditorDetails[i].selfAuditPlanDetailsId;
                    delete auditorDetails[i].isSectionApplicable;
                    delete auditorDetails[i].firstName;
                    delete auditorDetails[i].lastName;
                }
                for (var i = 0; i < existindAuditorDetails.length; i++) {
                    if (existindAuditorDetails[i].id) {
                        Ids.push(existindAuditorDetails[i].id);
                    }
                }
                if (Ids && Ids.length > 0) {
                    let Data = await dal.deleteRecords(db.auditSectionAuditorDetails, Ids);
                }
                let ResultSectionAudito = await dal.bulkCreate(db.auditSectionAuditorDetails, auditorDetails, UserId);
                if (auditPlanDetails) {
                    await dal.saveData(db.auditPlanDetails, auditPlanDetails, res, UserId);
                }
                else {
                    responseHelper.error(res, "error", codes.ERROR, 'please provide all required field');
                }
            }
            else {
                if (auditPlanDetails) {
                    await dal.saveData(db.auditPlanDetails, auditPlanDetails, res, UserId);
                }
                else {
                    responseHelper.error(res, "error", codes.ERROR, 'please provide all required field');
                }
            }

        }

        // const ResultExist = await dal.bulkCreate(db.auditObservationDetails, auditObservationDetils, UserId);
        // if (mediaDetails && mediaDetails.length > 0) {
        //     const ResultMedia = await dal.bulkCreate(db.mediaDetails, mediaDetails, UserId);
        //     responseHelper.success(res, 200, ResultMedia, 'Record saved successfully', '-1');
        // }
        // else {
        //     responseHelper.success(res, 200, ResultExist, 'Record saved successfully', '-1');
        // }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'update Self Audit score details');
    }
};
const updateFinalAuditClosureDetails = async (req, res) => {
    try {
        const auditPlanDetails = req.body;
        const auditPlanDetailsId = auditPlanDetails && auditPlanDetails.auditPlanDetailsId;
        const UserId = req.user.id;
        let userMasterId = UserId;
        const AuditApprovedBy = req.user.id;
        const auditApprovalDate = new Date();
        const StatusMaster = await getStatusMasterDetails(undefined, 'Approved');
        //console.log("Status Master",StatusMaster);
        const auditApprovalStatusMasterId = "pg-ahdnkyrn68d9psdsd6y8s";
        const statusMasterId = "pg-ahdnkyrn68d9psdsd6y8s";
        const isAuditClosed = true;
        const auditApprovalRemarks = auditPlanDetails && auditPlanDetails.auditApprovalRemarks ? auditPlanDetails.auditApprovalRemarks : '';
        let roleMasterId = auditPlanDetails ? auditPlanDetails.roleMasterId : '';
        let companyMasterId = auditPlanDetails && auditPlanDetails.companyMasterId ? auditPlanDetails.companyMasterId : undefined;
        let plantId = auditPlanDetails && auditPlanDetails.plantId ? auditPlanDetails.plantId : undefined;
        let plantMasterId = auditPlanDetails && auditPlanDetails.plantId ? auditPlanDetails.plantId : undefined;
        let processFlowMasterId = auditPlanDetails ? auditPlanDetails.processFlowMasterId : '';
        let processFlowCode = auditPlanDetails ? auditPlanDetails.processFlowCode : '';
        const auditObservationActionPlanToSave = auditPlanDetails && auditPlanDetails.auditObservationActionPlanDetails;

        var Ids = [];


        if (util.missingRequiredFields('auditPlanDetails', auditPlanDetails, res) === '') {

            if (isAuditClosed && isAuditClosed === true) {

                var auditPlanProcessFlowCompletionDetailsToSave = [];
                var auditPlanProcessFlowCompletionHistoryDetailsToSave = [];
                const processFlowMaster = await getProcessFlowMaster_New(processFlowMasterId, processFlowCode, auditPlanDetailsId, auditPlanDetailsId, undefined, 1);
                //console.log("processFlowMaster 2E", processFlowMaster);

                processFlowMasterId = processFlowMasterId && processFlowMasterId !== undefined ? processFlowMasterId : processFlowMaster && processFlowMaster.id;

                //  console.log("processFlowMasterId", processFlowMasterId);
                const processFlowResponsibility = await getProcessFlowResponsibility(processFlowMasterId, processFlowCode);
                //console.log("processFlowResponsibility 2E", processFlowResponsibility);

                let isEditable = false;
                let isCompleted = false;
                let isEdited = false;
                let completedOn = new Date();
                let isApprovalRequired = false;
                let isApproved = true;
                let isSendBack = false;
                let isRejected = false;
                let approvalDate = new Date();
                let agging = 0;

                const ExistingProcessFlowCompletion = await getProcessFlowCompletionDetails(auditPlanDetailsId, processFlowMasterId, auditPlanDetailsId);
                //console.log("ExistProcessFlowCompletion.processFlowCompletionHistoryDetails : ", ExistingProcessFlowCompletion.processFlowCompletionHistoryDetails);
                const processFlowCompletionHistoryDetails = ExistingProcessFlowCompletion && ExistingProcessFlowCompletion.processFlowCompletionHistoryDetails;

                let processFlowResponsibleCount = processFlowResponsibility && processFlowResponsibility.length ? processFlowResponsibility.length : 0;
                let processFlowCompletedCount = processFlowCompletionHistoryDetails && processFlowCompletionHistoryDetails.length ? processFlowCompletionHistoryDetails.length : 0;

                if (processFlowMaster) {
                    isEditable = processFlowMaster && processFlowCode.isEditableBeforeNextStepCompletion ? processFlowCode.isEditableBeforeNextStepCompletion : false;
                    isApprovalRequired = processFlowMaster && processFlowMaster.isApprovalRequired ? processFlowMaster.isApprovalRequired : false;
                    isApproved = isApprovalRequired ? !isApprovalRequired : true;
                    isCompleted = true;
                }

                let uuid3 = await dal.uuid(db.auditPlanDetails.name);
                let processFlowCompletionDetailsId = ExistingProcessFlowCompletion && ExistingProcessFlowCompletion !== null && ExistingProcessFlowCompletion !== undefined ? ExistingProcessFlowCompletion.id : uuid3;
                let auditPlanProcessFlowCompletionDetails = {
                    id: processFlowCompletionDetailsId,
                    auditPlanDetailsId: auditPlanDetailsId,
                    processFlowMasterId: processFlowMasterId,
                    auditPlanSubDetailsId: auditPlanDetailsId,
                    isEditable: isEditable,
                    isCompleted: isCompleted,
                    isEdited: isEdited,
                    completedOn: completedOn,
                    statusMasterId: statusMasterId,
                    isApprovalRequired: isApprovalRequired,
                    isApproved: isApproved ? isApproved : null,
                    isSendBack: isSendBack,
                    isRejected: isRejected,
                    approvalDate: approvalDate,
                    agging: agging
                }
                auditPlanProcessFlowCompletionDetailsToSave.push(auditPlanProcessFlowCompletionDetails);

                let responsiblityOrder = processFlowCompletedCount ? processFlowCompletedCount + 1 : 1;
                const ExistProcessFlowCompletionHistory = await getProcessFlowCompletionHistoryDetails(processFlowCompletionDetailsId, roleMasterId, companyMasterId, plantId, UserId, responsiblityOrder);
                console.log("ExistProcessFlowCompletionHistory : ", ExistProcessFlowCompletionHistory);
                let uuid4 = await dal.uuid(db.auditPlanDetails.name);
                let processFlowCompletionHistoryDetailsId = ExistProcessFlowCompletionHistory && ExistProcessFlowCompletionHistory !== null && ExistProcessFlowCompletionHistory !== undefined ? ExistProcessFlowCompletionHistory.id : uuid4;
                let auditPlanProcessFlowHistoryCompletionDetails = {
                    id: processFlowCompletionHistoryDetailsId,
                    processFlowCompletionDetailsId: processFlowCompletionDetailsId,
                    roleMasterId: roleMasterId,
                    companyMasterId: companyMasterId,
                    plantMasterId: plantMasterId,
                    userMasterId: userMasterId,
                    statusMasterId: statusMasterId,
                    isCompleted: true,
                    completedOn: completedOn,
                    isApproved: isApproved ? isApproved : null,
                    isSendBack: isSendBack,
                    isRejected: isRejected,
                    remarks: auditApprovalRemarks,
                    agging: agging,
                    responsiblityOrder: responsiblityOrder
                }
                auditPlanProcessFlowCompletionHistoryDetailsToSave.push(auditPlanProcessFlowHistoryCompletionDetails);

            }

            if (auditPlanDetails) {
                let Data = {
                    id: auditPlanDetails.id,
                    AuditApprovedBy: AuditApprovedBy,
                    auditApprovalDate: auditApprovalDate,
                    auditApprovalStatusMasterId: auditApprovalStatusMasterId,
                    isAuditClosed: isAuditClosed,
                    auditApprovalRemarks: auditApprovalRemarks
                }
                await dal.saveData(db.auditPlanDetails, Data, res, UserId);
            }
            else {
                responseHelper.error(res, "error", codes.ERROR, 'please provide all required field');
            }

            if (auditObservationActionPlanToSave) {
                const resultActionPlan = await dal.bulkCreate(db.auditObservationActionPlanDetails, auditObservationActionPlanToSave, req.user.id);
                //console.log("resultActionPlan : ", resultActionPlan);
            }

            let processFlowCompletionResult = undefined;
            let processFlowCompletionHistoryResult = undefined;
            processFlowCompletionResult = await dal.bulkCreate(db.processFlowCompletionDetails, auditPlanProcessFlowCompletionDetailsToSave, req.user.id);
            if (processFlowCompletionResult) {
                processFlowCompletionHistoryResult = await dal.bulkCreate(db.processFlowCompletionHistoryDetails, auditPlanProcessFlowCompletionHistoryDetailsToSave, req.user.id);

            }

        }

    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'update Self Audit score details');
    }
};
const getFinalAuditPlanDetails = async (req, res) => {
    try {
        console.log("req.query : ", req.query);
        let finalAuditDetailsId = req.query && req.query.finalAuditDetailsId ? req.query.finalAuditDetailsId : '';
        let selfAuditBasicDetailsId = req.query && req.query.selfAuditBasicDetailsId ? req.query.selfAuditBasicDetailsId : '';
        let companyMasterId = req.query && req.query.companyMasterId ? req.query.companyMasterId : '';
        let plantMasterId = req.query && req.query.plantMasterId ? req.query.plantMasterId : '';
        let finalAuditStatus = req.query && req.query.finalAuditStatus ? req.query.finalAuditStatus : '';
        let dataFetchType = req.query && req.query.dataFetchType ? req.query.dataFetchType : '';
        let cancelledAuditExclude = req.query && req.query.cancelledAuditExclude ? req.query.cancelledAuditExclude : '';
        let executedAuditExclude = req.query && req.query.executedAuditExclude ? req.query.executedAuditExclude : '';
        let userMasterId = req.query && req.query.userMasterId ? req.query.userMasterId : '';
        let auditFromDate = req.query && req.query.auditFromDate ? req.query.auditFromDate : null;
        let auditToDate = req.query && req.query.auditToDate ? req.query.auditToDate : null;

        db.sequelize.query('call Asp_HRA_FinalAuditDetails_Get_FinalAuditDetails(:pra_finalAuditDetailsId,:pra_selfAuditBasicDetailsId,:pra_CompanyMasterId,:pra_PlantMasterId,:pra_FinalAuditStatus,:pra_DatafetchType,:pra_CancelledAuditExclude,:pra_ExecutedAuditExclude,:pra_UserMasterId,:pra_auditFromDate,:pra_auditToDate)', {
            replacements: {
                pra_finalAuditDetailsId: finalAuditDetailsId,
                pra_selfAuditBasicDetailsId: selfAuditBasicDetailsId,
                pra_CompanyMasterId: companyMasterId,
                pra_PlantMasterId: plantMasterId,
                pra_FinalAuditStatus: finalAuditStatus,
                pra_DatafetchType: dataFetchType,
                pra_CancelledAuditExclude: cancelledAuditExclude,
                pra_ExecutedAuditExclude: executedAuditExclude,
                pra_UserMasterId: userMasterId,
                pra_auditFromDate: auditFromDate,
                pra_auditToDate: auditToDate
            }
        }).then(result => {
            //console.log("result : ", result);
            responseHelper.success(res, 200, result, 'Audit details!!', -1, result.length);
        }).catch(err => {
            //console.log("error : ", err);
            responseHelper.error(res, err.code ? err.code : codes.ERROR, err, "Error in fatching data !!")
        });
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'Error in fatching audit details');
    }
};


const getFinalAuditDetails = async (req, res) => {
    try {

        console.log("req.query : ", req.query);

        let auditDetailsId = req.query && req.query.auditDetailsId ? req.query.auditDetailsId : '';
        let selfAuditDetailsId = req.query && req.query.selfAuditDetailsId ? req.query.selfAuditDetailsId : '';
        let yearMasterId = req.query && req.query.yearMasterId ? req.query.yearMasterId : '';
        let companyMasterId = req.query && req.query.companyMasterId ? req.query.companyMasterId : '';
        let plantMasterId = req.query && req.query.plantMasterId ? req.query.plantMasterId : '';
        let auditDataType = req.query && req.query.auditDataType ? req.query.auditDataType : 'all';
        let auditFromDate = req.query && req.query.auditFromDate ? req.query.auditFromDate : null;
        let auditToDate = req.query && req.query.auditToDate ? req.query.auditToDate : null;

        db.sequelize.query('call asp_HRA_AuditDetails_Get_FinalAuditDetailss(:p_AuditDetailsId,:p_SelfAuditDetailsId,:p_YearMasterId,:p_CompanyMasterId,:p_PlantMasterId,:p_AuditFromDate,:p_AuditToDate,:p_AuditDataType)', {
            replacements: {
                p_AuditDetailsId: auditDetailsId,
                p_SelfAuditDetailsId: selfAuditDetailsId,
                p_YearMasterId: yearMasterId,
                p_CompanyMasterId: companyMasterId,
                p_PlantMasterId: plantMasterId,
                p_AuditFromDate: auditFromDate,
                p_AuditToDate: auditToDate,
                p_AuditDataType: auditDataType
            }
        }).then(result => {
            //console.log("result : ", result);
            responseHelper.success(res, 200, result, 'Audit details!!', -1, result.length);
        }).catch(err => {
            //console.log("error : ", err);
            responseHelper.error(res, err.code ? err.code : codes.ERROR, err, "Error in fatching data !!")
        });
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'Error in fatching audit details');
    }
};

//#endregion
//#region  Final Audit Responsibility Wise Data
const getFinalAuditDetails_ByProcessResponsibilityWise = async (req, res) => {

    try {
        db.sequelize.query('call asp_HRA_AuditDetails_Get_ProcessFlowCompletiondetails_ForFinal(:pra_ProcessFlowMasterId, :pra_ProcessFlowCode, :pra_RoleMasterId, :pra_CompanyMasterId,:pra_PlantMasterId,:pra_EmployeeMasterId)',
            {
                replacements: {
                    pra_ProcessFlowMasterId: req.query.processFlowMasterId ? req.query.processFlowMasterId : '',
                    pra_ProcessFlowCode: req.query.processFlowCode ? req.query.processFlowCode : '',
                    pra_RoleMasterId: req.query.roleMasterId ? req.query.roleMasterId : '',
                    pra_CompanyMasterId: req.query.companyMasterId ? req.query.companyMasterId : '',
                    pra_PlantMasterId: req.query.plantMasterId ? req.query.plantMasterId : '',
                    pra_EmployeeMasterId: req.query.employeeMasterId ? req.query.employeeMasterId : ''
                }
            }).then(results => {
                responseHelper.success(res, 200, results, 'Self Audit Details List successfully', '-1', results.length);
            }).catch(err => {
                responseHelper.error(res, err.code ? err.code : codes.ERROR, err, 'Error in Self Audit details');

            });
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting Self Audit Details');
    }
};
//#endregion
//#region  Final Audit Execution
const getFinalAuditDetailsForExecution = async (req, res) => {
    try {

        console.log("req.query : ", req.query);

        let auditDetailsId = req.query && req.query.auditDetailsId ? req.query.auditDetailsId : '';
        let selfAuditDetailsId = req.query && req.query.selfAuditDetailsId ? req.query.selfAuditDetailsId : '';
        let auditorMasterId = req.query && req.query.auditorMasterId ? req.query.auditorMasterId : '';
        let companyMasterId = req.query && req.query.companyMasterId ? req.query.companyMasterId : '';
        let plantMasterId = req.query && req.query.plantMasterId ? req.query.plantMasterId : '';
        let auditFromDate = req.query && req.query.auditFromDate ? req.query.auditFromDate : null;
        let auditToDate = req.query && req.query.auditToDate ? req.query.auditToDate : null;

        db.sequelize.query('call asp_HRA_AuditDetails_Get_FinalAuditDetailsForExecution(:p_AuditDetailsId,:p_SelfAuditDetailsId,:p_AuditorMasterId,:p_CompanyMasterId,:p_PlantMasterId,:p_AuditFromDate,:p_AuditToDate)', {
            replacements: {
                p_AuditDetailsId: auditDetailsId,
                p_SelfAuditDetailsId: selfAuditDetailsId,
                p_AuditorMasterId: auditorMasterId,
                p_CompanyMasterId: companyMasterId,
                p_PlantMasterId: plantMasterId,
                p_AuditFromDate: auditFromDate,
                p_AuditToDate: auditToDate
            }
        }).then(result => {
            //console.log("result : ", result);
            responseHelper.success(res, 200, result, 'Audit details!!', -1, result.length);
        }).catch(err => {
            //console.log("error : ", err);
            responseHelper.error(res, err.code ? err.code : codes.ERROR, err, "Error in fatching data !!")
        });
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'Error in fatching audit details');
    }
};
const getFinalAuditScopeForExecution = async (req, res) => {
    try {
        console.log("req.query : ", req.query);

        let auditPlanDetailsId = req.query && req.query.auditPlanDetailsId ? req.query.auditPlanDetailsId : '';
        let selfAuditDetailsId = req.query && req.query.selfAuditDetailsId ? req.query.selfAuditDetailsId : '';
        let auditorMasterId = req.query && req.query.auditorMasterId ? req.query.auditorMasterId : '';
        let sectionMasterId = req.query && req.query.sectionMasterId ? req.query.sectionMasterId : '';
        let subSectionMasterId = req.query && req.query.subSectionMasterId ? req.query.subSectionMasterId : '';
        let criticalityMasterId = '';
        let auditModeMasterId = '';

        db.sequelize.query('call asp_HRA_FinalAuditExecution_Get_FinalAuditScopeDetails(:p_AuditPlantDetailsId,:p_SelfAuditDetailsId,:p_AuditorMasterId,:p_SectionMasterId,:p_SubSectionMasterId,:p_CriticalityMasterId,:p_AuditModeMasterId)', {
            replacements: {
                p_AuditPlantDetailsId: auditPlanDetailsId,
                p_SelfAuditDetailsId: selfAuditDetailsId,
                p_AuditorMasterId: auditorMasterId,
                p_SectionMasterId: sectionMasterId,
                p_SubSectionMasterId: subSectionMasterId,
                p_CriticalityMasterId: criticalityMasterId,
                p_AuditModeMasterId: auditModeMasterId
            }
        }).then(result => {
            //console.log("result : ", result);
            responseHelper.success(res, 200, result, 'Audit Scope details!!', -1, result.length);
        }).catch(err => {
            //console.log("error : ", err);
            responseHelper.error(res, err.code ? err.code : codes.ERROR, err, "Error in fatching data !!")
        });
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'Error in fatching audit details');
    }
};
const getFinalAuditDetailsById = async (id) => {
    try {
        const result = await dal.findById(db.auditPlanDetails, id);
        return result
    }
    catch (error) {
        return undefined;
    }
};
const getFinalAuditObservationCompletionDetails = async (auditPlantDetailsId, selfAuditPlanDetailsId, auditorMasterId, sectionMasterId, subSectionMasterId) => {
    try {

        //console.log("req.query : ", req.query);
        let auditObservationCompletionDetails = undefined;

        await db.sequelize.query('call asp_HRA_FinalAuditExecution_Get_ObservationCompletionDetails(:p_AuditPlantDetailsId,:p_SelfAuditDetailsId,:p_AuditorMasterId,:p_SectionMasterId,:p_SubSectionMasterId)', {
            replacements: {
                p_AuditPlantDetailsId: auditPlantDetailsId ? auditPlantDetailsId : '',
                p_SelfAuditDetailsId: selfAuditPlanDetailsId ? selfAuditPlanDetailsId : '',
                p_AuditorMasterId: auditorMasterId ? auditorMasterId : '',
                p_SectionMasterId: sectionMasterId ? sectionMasterId : '',
                p_SubSectionMasterId: subSectionMasterId ? subSectionMasterId : ''
            }
        }).then(result => {
            auditObservationCompletionDetails = result;
            //console.log("result : ", result);
            //responseHelper.success(res, 200, result, 'Audit Scope details!!', -1, result.length);
        }).catch(err => {
            console.log("error 1 : ", err);
            auditObservationCompletionDetails = undefined;
            //responseHelper.error(res, err.code ? err.code : codes.ERROR, err, "Error in fatching data !!")
        });
        return auditObservationCompletionDetails
    }
    catch (error) {
        console.log("error 2 : ", error);
        return undefined;
        //responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'Error in fatching audit details');
    }
};
const updateFinalAuditAuditorAuditExecutionDetails = async (auditPlantDetailsId, auditorMasterId, isObservationSubmitted, isAuditExecuted) => {
    try {

        //console.log("req.query : ", req.query);
        let AuditorAuditExecutionDetails = undefined;

        await db.sequelize.query('call asp_HRA_FinalAuditExecution_Update_AuditorAuditExecutionDetails(:p_AuditPlantDetailsId,:p_AuditorMasterId,:p_IsObservationSubmitted,:p_IsAuditExecuted)', {
            replacements: {
                p_AuditPlantDetailsId: auditPlantDetailsId ? auditPlantDetailsId : '',
                p_AuditorMasterId: auditorMasterId ? auditorMasterId : '',
                p_IsObservationSubmitted: isObservationSubmitted ? isObservationSubmitted : 0,
                p_IsAuditExecuted: isAuditExecuted ? isAuditExecuted : 0
            }
        }).then(result => {
            AuditorAuditExecutionDetails = result;
            //console.log("result : ", result);
            //responseHelper.success(res, 200, result, 'Audit Scope details!!', -1, result.length);
        }).catch(err => {
            console.log("error 1 : ", err);
            AuditorAuditExecutionDetails = undefined;
            //responseHelper.error(res, err.code ? err.code : codes.ERROR, err, "Error in fatching data !!")
        });
        return AuditorAuditExecutionDetails
    }
    catch (error) {
        console.log("error 2 : ", error);
        return undefined;
        //responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'Error in fatching audit details');
    }
};
const saveFinalAuditObservationDetails = async (req, res) => {
    try {
        const auditObservations = req.body;
        console.log("final audit Observations", auditObservations);

        const auditPlanDetailsId = auditObservations && auditObservations.auditPlanDetailsId;
        const UserId = req.user.id;
        let selfPlan = null;
        const IsSaved = auditObservations && auditObservations.isScoreSaved;
        const IsSubmitted = auditObservations && auditObservations.isScoreSubmitted;
        let IsFinalSubmission = auditObservations && auditObservations.isFinalSubmission ? auditObservations.isFinalSubmission : false;
        const mediaDetails = auditObservations && auditObservations.mediaDetails;
        const auditObservationDetils = auditObservations && auditObservations.auditObservationDetils;
        const auditPlanDetails = await getFinalAuditDetailsById(auditPlanDetailsId);
        // console.log("auditPlanDetails 3", auditPlanDetails);

        let auditObservationCount = auditObservationDetils && auditObservationDetils.length;
        console.log("auditObservationCount : ", auditObservationCount);

        if ((IsSubmitted && IsSubmitted === true) || (IsFinalSubmission && IsFinalSubmission === true)) {


            var auditPlanProcessFlowCompletionDetailsToSave = [];
            var auditPlanProcessFlowCompletionHistoryDetailsToSave = [];

            const StatusMaster = await getStatusMasterDetails(undefined, 'Approved');

            let userMasterId = UserId;
            let userId = UserId;
            let processFlowMasterId = auditObservations ? auditObservations.processFlowMasterId : '';
            let processFlowCode = auditObservations ? auditObservations.processFlowCode : '';
            let roleMasterId = auditObservations ? auditObservations.roleMasterId : '';
            let statusMasterId = auditObservations ? auditObservations.statusMasterId : StatusMaster && StatusMaster.id;
            let companyMasterId = auditObservations && auditObservations.companyMasterId ? auditObservations.companyMasterId : undefined;
            let plantId = auditObservations && auditObservations.plantId ? auditObservations.plantId : undefined;
            let plantMasterId = auditObservations && auditObservations.plantId ? auditObservations.plantId : undefined;
            let auditPlanRemarks = auditObservations && auditObservations.auditPlanRemarks ? auditObservations.auditPlanRemarks : undefined;

            //  console.log("processFlowCode", processFlowCode);
            const processFlowMaster = await getProcessFlowMaster_New(processFlowMasterId, processFlowCode, auditPlanDetailsId, auditPlanDetailsId, undefined, 1);
            //console.log("processFlowMaster 2E", processFlowMaster);

            processFlowMasterId = processFlowMasterId && processFlowMasterId !== undefined ? processFlowMasterId : processFlowMaster && processFlowMaster.id;

            //  console.log("processFlowMasterId", processFlowMasterId);
            const processFlowResponsibility = await getProcessFlowResponsibility(processFlowMasterId, processFlowCode);
            //console.log("processFlowResponsibility 2E", processFlowResponsibility);

            let isEditable = false;
            let isCompleted = false;
            let isEdited = false;
            let completedOn = new Date();
            let isApprovalRequired = false;
            let isApproved = true;
            let isSendBack = false;
            let isRejected = false;
            let approvalDate = new Date();
            let agging = 0;

            const ExistingProcessFlowCompletion = await getProcessFlowCompletionDetails(auditPlanDetailsId, processFlowMasterId, auditPlanDetailsId);
            //if (ExistingProcessFlowCompletion)
            //console.log("ExistProcessFlowCompletion.processFlowCompletionHistoryDetails : ", ExistingProcessFlowCompletion.processFlowCompletionHistoryDetails);

            const processFlowCompletionHistoryDetails = ExistingProcessFlowCompletion && ExistingProcessFlowCompletion.processFlowCompletionHistoryDetails;

            let processFlowResponsibleCount = processFlowResponsibility && processFlowResponsibility.length ? processFlowResponsibility.length : 0;
            let processFlowCompletedCount = processFlowCompletionHistoryDetails && processFlowCompletionHistoryDetails.length ? processFlowCompletionHistoryDetails.length : 0;

            const finalAuditObservationCompletionDetails = await getFinalAuditObservationCompletionDetails(auditPlanDetailsId, undefined, undefined, undefined, undefined);
            //console.log("finalAuditObservationCompletionDetails : ", finalAuditObservationCompletionDetails);
            let totalScopeCount = 0;
            let CompletedScopeCount = 0;
            let totalCompletedScopeCount = 0;
            let totalPendingObservationCount = 0;
            if (finalAuditObservationCompletionDetails) {
                totalScopeCount = finalAuditObservationCompletionDetails[0] && finalAuditObservationCompletionDetails[0].totalScopeCount ? finalAuditObservationCompletionDetails[0].totalScopeCount : 0;
                CompletedScopeCount = finalAuditObservationCompletionDetails[0] && finalAuditObservationCompletionDetails[0].observationCompletedScopeCount ? finalAuditObservationCompletionDetails[0].observationCompletedScopeCount : 0;
                totalCompletedScopeCount = ((CompletedScopeCount ? CompletedScopeCount : 0) + (auditObservationCount ? auditObservationCount : 0));
                totalPendingObservationCount = ((totalScopeCount ? totalScopeCount : 0) - (totalCompletedScopeCount ? totalCompletedScopeCount : 0))
                //console.log("Total Scope Count 1 : ", finalAuditObservationCompletionDetails[0].totalScopeCount);
                //console.log("Total Scope Count : ", totalScopeCount);
                //console.log("Total totalCompletedScope Count : ", totalCompletedScopeCount);
            }

            if (processFlowMaster) {
                isEditable = processFlowMaster && processFlowCode.isEditableBeforeNextStepCompletion ? processFlowCode.isEditableBeforeNextStepCompletion : false;
                isApprovalRequired = processFlowMaster && processFlowMaster.isApprovalRequired ? processFlowMaster.isApprovalRequired : false;
                isApproved = isApprovalRequired ? !isApprovalRequired : true;
                if (processFlowResponsibility) {
                    isCompleted = (((processFlowResponsibleCount ? processFlowResponsibleCount : 1) <= (processFlowCompletedCount ? processFlowCompletedCount + 1 : 1)) && totalPendingObservationCount <= 0) ? true : false;
                }
                else if (totalPendingObservationCount <= 0) {
                    isCompleted = true;
                }
            }
            else if (totalPendingObservationCount <= 0) {
                isCompleted = true;
            }
            else {
                isCompleted = false;
            }
            console.log("isCompleted : ", isCompleted);
            console.log("IsFinalSubmission : ", IsFinalSubmission);

            isCompleted = IsFinalSubmission ? isCompleted : false;

            let uuid3 = await dal.uuid(db.auditPlanDetails.name);
            let processFlowCompletionDetailsId = ExistingProcessFlowCompletion && ExistingProcessFlowCompletion !== null && ExistingProcessFlowCompletion !== undefined ? ExistingProcessFlowCompletion.id : uuid3;
            let auditPlanProcessFlowCompletionDetails = {
                id: processFlowCompletionDetailsId,
                auditPlanDetailsId: auditPlanDetailsId,
                processFlowMasterId: processFlowMasterId,
                auditPlanSubDetailsId: auditPlanDetailsId,
                isEditable: isEditable,
                isCompleted: isCompleted,
                isEdited: isEdited,
                completedOn: completedOn,
                statusMasterId: statusMasterId,
                isApprovalRequired: isApprovalRequired,
                isApproved: isApproved ? isApproved : null,
                isSendBack: isSendBack,
                isRejected: isRejected,
                approvalDate: approvalDate,
                agging: agging
            }
            auditPlanProcessFlowCompletionDetailsToSave.push(auditPlanProcessFlowCompletionDetails);

            let responsiblityOrder = processFlowCompletedCount ? processFlowCompletedCount + 1 : 1;
            const ExistProcessFlowCompletionHistory = await getProcessFlowCompletionHistoryDetails(processFlowCompletionDetailsId, roleMasterId, companyMasterId, plantId, userId, responsiblityOrder);
            //console.log("ExistProcessFlowCompletionHistory : ", ExistProcessFlowCompletionHistory);
            let uuid4 = await dal.uuid(db.auditPlanDetails.name);
            let processFlowCompletionHistoryDetailsId = ExistProcessFlowCompletionHistory && ExistProcessFlowCompletionHistory !== null && ExistProcessFlowCompletionHistory !== undefined ? ExistProcessFlowCompletionHistory.id : uuid4;
            let auditPlanProcessFlowHistoryCompletionDetails = {
                id: processFlowCompletionHistoryDetailsId,
                processFlowCompletionDetailsId: processFlowCompletionDetailsId,
                roleMasterId: roleMasterId,
                companyMasterId: companyMasterId,
                plantMasterId: plantMasterId,
                userMasterId: userMasterId,
                statusMasterId: statusMasterId,
                isCompleted: IsFinalSubmission,
                completedOn: completedOn,
                isApproved: isApproved ? isApproved : null,
                isSendBack: isSendBack,
                isRejected: isRejected,
                remarks: auditPlanRemarks,
                agging: agging,
                responsiblityOrder: responsiblityOrder
            }
            auditPlanProcessFlowCompletionHistoryDetailsToSave.push(auditPlanProcessFlowHistoryCompletionDetails);

            if (auditPlanDetails) {
                let Data = {
                    id: auditPlanDetails.id,
                    isAuditExecuted: isCompleted,
                    auditExecutedOn: isCompleted ? new Date() : null,
                    auditExecutionRemarks: '',
                    auditExecutedBy: UserId
                }
                const savePlan = await dal.saveData(db.auditPlanDetails, Data, undefined, UserId);
                if (savePlan) {
                    const executionResult = await updateFinalAuditAuditorAuditExecutionDetails(auditPlanDetailsId, userId, true, isCompleted);
                    //console.log("executionResult : ", executionResult);
                }
            }
            //console.log("auditPlanProcessFlowCompletionDetailsToSave", auditPlanProcessFlowCompletionDetailsToSave);
            //console.log("auditPlanProcessFlowCompletionHistoryDetailsToSave", auditPlanProcessFlowCompletionHistoryDetailsToSave);

            let processFlowCompletionResult = undefined;
            let processFlowCompletionHistoryResult = undefined;
            processFlowCompletionResult = await dal.bulkCreate(db.processFlowCompletionDetails, auditPlanProcessFlowCompletionDetailsToSave, req.user.id);
            if (processFlowCompletionResult) {
                processFlowCompletionHistoryResult = await dal.bulkCreate(db.processFlowCompletionHistoryDetails, auditPlanProcessFlowCompletionHistoryDetailsToSave, req.user.id);

            }
        }
        // else if (IsSubmitted && IsSubmitted === true) {
        //     const executionResult = await updateFinalAuditAuditorAuditExecutionDetails(auditPlanDetailsId, UserId, true, false);
        //     console.log("executionResult : ", executionResult);
        // }
        const ResultExist = await dal.bulkCreate(db.auditObservationDetails, auditObservationDetils, UserId);
        if (mediaDetails && mediaDetails.length > 0) {
            const ResultMedia = await dal.bulkCreate(db.mediaDetails, mediaDetails, UserId);
            responseHelper.success(res, 200, ResultMedia, 'Record saved successfully', '-1');
        }
        else {
            responseHelper.success(res, 200, ResultExist, 'Record saved successfully', '-1');
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'update Self Audit score details');
    }
};

const getFinalAuditObservationDetails = async (req, res) => {
    try {
        let where = [];

        const isAssosciationDataRequired = req.query.isAssosciationDataRequired;
        const auditPlanDetailsId = req.query.auditPlanDetailsId;
        where.push(util.constructWheresForSequelize('active', 1));
        where.push(util.constructWheresForSequelize('auditPlanDetailsId', auditPlanDetailsId));
        console.log('isAssosciationDataRequired', isAssosciationDataRequired);
        if (isAssosciationDataRequired) {
            const include = [
                {
                    model: db.auditPlanDetails, as: 'AuditPlanDetails', foreignKey: 'auditPlanDetailsId',
                    where: {
                        active: 1
                    },
                    required: true
                },
                {
                    model: db.scopeMaster, as: 'scopeMaster', foreignKey: 'scopeMasterId',
                    where: {
                        active: 1,
                    },
                    required: true,
                    include: [
                        {
                            model: db.sectionMaster, as: 'section', foreignKey: 'sectionMasterId',
                            where: {
                                active: 1
                            },
                            required: true
                        },
                        {
                            model: db.subSectionMaster, as: 'subsection', foreignKey: 'subSectionMasterId',
                            where: {
                                active: 1,
                            },
                            required: true,
                        },
                        {
                            model: db.criticalityMaster, as: 'criticality', foreignKey: 'criticalityMasterId',
                            where: {
                                active: 1,
                            },
                            required: false,
                        },
                        {
                            model: db.masterDetails, as: 'auditMode', foreignKey: 'auditModeMasterId',
                            where: {
                                active: 1,
                            },
                            required: false,
                        },
                        {
                            model: db.mediaDetails, as: 'scoreMedia', foreignKey: 'scopeMasterId',
                            where: {
                                active: 1,
                                auditPlanDetailsId: auditPlanDetailsId ? auditPlanDetailsId : undefined,
                            },
                            required: false,
                        }
                    ]
                },
                {
                    model: db.auditObservationMaster, as: 'observationMaster', foreignKey: 'auditObservationMasterId',
                    where: {
                        active: 1
                    },
                    required: true
                }
            ];
            console.log("include", include);
            await dal.getList({ model: db.auditObservationDetails, where, order: [['createdAt', 'desc']], include: false, rowsToReturn: req.query.rows, pageIndex: req.query.pageIndex, undefined, res, includeInnerObject: include });
        }
        else {
            await dal.getList({ model: db.auditObservationDetails, where, order: [['createdAt', 'desc']], include: false, rowsToReturn: req.query.rows, pageIndex: req.query.pageIndex, res });
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting self score');
    }
};
const getFinalAuditScopeForExecution_ForAll = async (req, res) => {
    try {
        console.log("req.query : ", req.query);

        let auditPlanDetailsId = req.query && req.query.auditPlanDetailsId ? req.query.auditPlanDetailsId : '';
        let selfAuditDetailsId = req.query && req.query.selfAuditDetailsId ? req.query.selfAuditDetailsId : '';
        let auditorMasterId = req.query && req.query.auditorMasterId ? req.query.auditorMasterId : '';
        let sectionMasterId = req.query && req.query.sectionMasterId ? req.query.sectionMasterId : '';
        let subSectionMasterId = req.query && req.query.subSectionMasterId ? req.query.subSectionMasterId : '';
        let criticalityMasterId = '';
        let auditModeMasterId = '';

        db.sequelize.query('call asp_HRA_FinalAuditExecution_Get_FinalAuditScopeDetails_ForAll(:p_AuditPlantDetailsId,:p_SelfAuditDetailsId,:p_AuditorMasterId,:p_SectionMasterId,:p_SubSectionMasterId,:p_CriticalityMasterId,:p_AuditModeMasterId)', {
            replacements: {
                p_AuditPlantDetailsId: auditPlanDetailsId,
                p_SelfAuditDetailsId: selfAuditDetailsId,
                p_AuditorMasterId: auditorMasterId,
                p_SectionMasterId: sectionMasterId,
                p_SubSectionMasterId: subSectionMasterId,
                p_CriticalityMasterId: criticalityMasterId,
                p_AuditModeMasterId: auditModeMasterId
            }
        }).then(result => {
            //console.log("result : ", result);
            responseHelper.success(res, 200, result, 'Audit Scope details!!', -1, result.length);
        }).catch(err => {
            //console.log("error : ", err);
            responseHelper.error(res, err.code ? err.code : codes.ERROR, err, "Error in fatching data !!")
        });
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'Error in fatching audit details');
    }
};

//#endregion
//#region  Action Plan Update
const getNotApplicableObservationDetails_ForActionPlanUpdate = async (req, res) => {
    try {
        console.log("req.query : ", req.query);

        let auditPlanDetailsId = req.query && req.query.auditPlanDetailsId ? req.query.auditPlanDetailsId : '';
        let selfAuditDetailsId = req.query && req.query.selfAuditDetailsId ? req.query.selfAuditDetailsId : '';
        let auditorMasterId = req.query && req.query.auditorMasterId ? req.query.auditorMasterId : '';
        let sectionMasterId = req.query && req.query.sectionMasterId ? req.query.sectionMasterId : '';
        let subSectionMasterId = req.query && req.query.subSectionMasterId ? req.query.subSectionMasterId : '';
        let criticalityMasterId = '';
        let auditModeMasterId = '';
        let onlyActionPlanApplicableObservation = '';
        let onlyActionPlanUpdateObservation = req.query && req.query.onlyActionPlanUpdateObservation ? req.query.onlyActionPlanUpdateObservation : '';
        let otherParameter = '';

        db.sequelize.query('call Asp_HRA_AuditObservationDetails_Get_ActionPlanDetails(:p_AuditPlantDetailsId,:p_SelfAuditDetailsId,:p_AuditorMasterId,:p_SectionMasterId,:p_SubSectionMasterId,:p_CriticalityMasterId,:p_AuditModeMasterId,:p_OnlyActionPlanApplicableObservation,:p_OnlyActionPlanUpdateObservation,:p_OtherParameter)', {
            replacements: {
                p_AuditPlantDetailsId: auditPlanDetailsId,
                p_SelfAuditDetailsId: selfAuditDetailsId,
                p_AuditorMasterId: auditorMasterId,
                p_SectionMasterId: sectionMasterId,
                p_SubSectionMasterId: subSectionMasterId,
                p_CriticalityMasterId: criticalityMasterId,
                p_AuditModeMasterId: auditModeMasterId,
                p_OnlyActionPlanApplicableObservation: onlyActionPlanApplicableObservation,
                p_OnlyActionPlanUpdateObservation: onlyActionPlanUpdateObservation,
                p_OtherParameter: otherParameter
            }
        }).then(result => {
            //console.log("result : ", result);
            responseHelper.success(res, 200, result, 'Audit Scope details!!', -1, result.length);
        }).catch(err => {
            //console.log("error : ", err);
            responseHelper.error(res, err.code ? err.code : codes.ERROR, err, "Error in fatching data !!")
        });
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'Error in fatching audit details');
    }
};
const updateActionPlanDetails = async (req, res) => {
    try {
        const auditObservations = req.body;
        // console.log("final audit Action Plan Observations", auditObservations);

        const auditPlanDetailsId = auditObservations && auditObservations.auditPlanDetailsId;
        const UserId = req.user.id;
        let savePlan = null;
        const IsSaved = auditObservations && auditObservations.isActionPlanSaved;
        const IsSubmitted = auditObservations && auditObservations.isActionPlanSubmitted;
        const auditObservationDetils = auditObservations && auditObservations.auditObservationActionPlanDetails;
        const auditPlanDetails = await getFinalAuditDetailsById(auditPlanDetailsId);
        // console.log("auditPlanDetails 3", auditPlanDetails);
        if (IsSubmitted && IsSubmitted === true) {

            var auditPlanProcessFlowCompletionDetailsToSave = [];
            var auditPlanProcessFlowCompletionHistoryDetailsToSave = [];
            const StatusMaster = await getStatusMasterDetails(undefined, 'Approved');
            let userMasterId = UserId;
            let userId = UserId;
            let processFlowMasterId = auditObservations ? auditObservations.processFlowMasterId : '';
            let processFlowCode = auditObservations ? auditObservations.processFlowCode : '';
            let roleMasterId = auditObservations ? auditObservations.roleMasterId : '';
            let statusMasterId = auditObservations && auditObservations.statusMasterId && auditObservations.statusMasterId !== null ? auditObservations.statusMasterId : StatusMaster && StatusMaster.id;
            let companyMasterId = auditObservations && auditObservations.companyMasterId ? auditObservations.companyMasterId : undefined;
            let plantId = auditObservations && auditObservations.plantId ? auditObservations.plantId : undefined;
            let plantMasterId = auditObservations && auditObservations.plantId ? auditObservations.plantId : undefined;
            let actionPlanRemarks = auditObservations ? auditObservations.actionPlanRemarks : '';
            console.log("statusMasterId 2", statusMasterId);
            const processFlowMaster = await getProcessFlowMaster_New(processFlowMasterId, processFlowCode, auditPlanDetailsId, auditPlanDetailsId, undefined, 1);
            //console.log("processFlowMaster 2E", processFlowMaster);

            processFlowMasterId = processFlowMasterId && processFlowMasterId !== undefined ? processFlowMasterId : processFlowMaster && processFlowMaster.id;

            //  console.log("processFlowMasterId", processFlowMasterId);
            const processFlowResponsibility = await getProcessFlowResponsibility(processFlowMasterId, processFlowCode);
            //console.log("processFlowResponsibility 2E", processFlowResponsibility);

            let isEditable = false;
            let isCompleted = false;
            let isEdited = false;
            let completedOn = new Date();
            let isApprovalRequired = false;
            let isApproved = true;
            let isSendBack = false;
            let isRejected = false;
            let approvalDate = new Date();
            let agging = 0;

            const ExistingProcessFlowCompletion = await getProcessFlowCompletionDetails(auditPlanDetailsId, processFlowMasterId, auditPlanDetailsId);
            //console.log("ExistProcessFlowCompletion.processFlowCompletionHistoryDetails : ", ExistingProcessFlowCompletion.processFlowCompletionHistoryDetails);
            const processFlowCompletionHistoryDetails = ExistingProcessFlowCompletion && ExistingProcessFlowCompletion.processFlowCompletionHistoryDetails;

            let processFlowResponsibleCount = processFlowResponsibility && processFlowResponsibility.length ? processFlowResponsibility.length : 0;
            let processFlowCompletedCount = processFlowCompletionHistoryDetails && processFlowCompletionHistoryDetails.length ? processFlowCompletionHistoryDetails.length : 0;


            if (processFlowMaster) {
                isEditable = processFlowMaster && processFlowCode.isEditableBeforeNextStepCompletion ? processFlowCode.isEditableBeforeNextStepCompletion : false;
                isApprovalRequired = processFlowMaster && processFlowMaster.isApprovalRequired ? processFlowMaster.isApprovalRequired : false;
                isApproved = isApprovalRequired ? !isApprovalRequired : true;
                isCompleted = true;
            }
            else {
                isCompleted = false;
            }

            let uuid3 = await dal.uuid(db.auditPlanDetails.name);
            let processFlowCompletionDetailsId = ExistingProcessFlowCompletion && ExistingProcessFlowCompletion !== null && ExistingProcessFlowCompletion !== undefined ? ExistingProcessFlowCompletion.id : uuid3;
            let auditPlanProcessFlowCompletionDetails = {
                id: processFlowCompletionDetailsId,
                auditPlanDetailsId: auditPlanDetailsId,
                processFlowMasterId: processFlowMasterId,
                auditPlanSubDetailsId: auditPlanDetailsId,
                isEditable: isEditable,
                isCompleted: isCompleted,
                isEdited: isEdited,
                completedOn: completedOn,
                statusMasterId: statusMasterId,
                isApprovalRequired: isApprovalRequired,
                isApproved: isApproved ? isApproved : null,
                isSendBack: isSendBack,
                isRejected: isRejected,
                approvalDate: approvalDate,
                agging: agging
            }
            auditPlanProcessFlowCompletionDetailsToSave.push(auditPlanProcessFlowCompletionDetails);

            let responsiblityOrder = processFlowCompletedCount ? processFlowCompletedCount + 1 : 1;
            const ExistProcessFlowCompletionHistory = await getProcessFlowCompletionHistoryDetails(processFlowCompletionDetailsId, roleMasterId, companyMasterId, plantId, userId, responsiblityOrder);
            // console.log("ExistProcessFlowCompletionHistory : ", ExistProcessFlowCompletionHistory);
            let uuid4 = await dal.uuid(db.auditPlanDetails.name);
            let processFlowCompletionHistoryDetailsId = ExistProcessFlowCompletionHistory && ExistProcessFlowCompletionHistory !== null && ExistProcessFlowCompletionHistory !== undefined ? ExistProcessFlowCompletionHistory.id : uuid4;
            let auditPlanProcessFlowHistoryCompletionDetails = {
                id: processFlowCompletionHistoryDetailsId,
                processFlowCompletionDetailsId: processFlowCompletionDetailsId,
                roleMasterId: roleMasterId,
                companyMasterId: companyMasterId,
                plantMasterId: plantMasterId,
                userMasterId: userMasterId,
                statusMasterId: statusMasterId,
                isCompleted: true,
                completedOn: completedOn,
                isApproved: isApproved ? isApproved : null,
                isSendBack: isSendBack,
                isRejected: isRejected,
                remarks: actionPlanRemarks,
                agging: agging,
                responsiblityOrder: responsiblityOrder
            }
            auditPlanProcessFlowCompletionHistoryDetailsToSave.push(auditPlanProcessFlowHistoryCompletionDetails);

            if (auditPlanDetails) {
                let Data = {
                    id: auditPlanDetails.id,
                    isActionPlanUpdated: isCompleted,
                    actionPlanUpdatedOn: new Date(),
                    actionPlanRemarks: actionPlanRemarks ? actionPlanRemarks : 'action plan submitted',
                    actionPlanUpdatedBy: UserId
                }
                savePlan = await dal.saveData(db.auditPlanDetails, Data, undefined, UserId);
            }
            //  console.log("auditPlanProcessFlowCompletionDetailsToSave", auditPlanProcessFlowCompletionDetailsToSave);
            // console.log("auditPlanProcessFlowCompletionHistoryDetailsToSave", auditPlanProcessFlowCompletionHistoryDetailsToSave);

            let processFlowCompletionResult = undefined;
            let processFlowCompletionHistoryResult = undefined;
            processFlowCompletionResult = await dal.bulkCreate(db.processFlowCompletionDetails, auditPlanProcessFlowCompletionDetailsToSave, req.user.id);
            if (processFlowCompletionResult) {
                processFlowCompletionHistoryResult = await dal.bulkCreate(db.processFlowCompletionHistoryDetails, auditPlanProcessFlowCompletionHistoryDetailsToSave, req.user.id);

            }
        }
        if (auditObservationDetils && auditObservationDetils.length > 0) {
            const ResultExist = await dal.bulkCreate(db.auditObservationActionPlanDetails, auditObservationDetils, UserId);
            responseHelper.success(res, 200, ResultExist, 'Record saved successfully', '-1');

        }
        else {
            responseHelper.success(res, 200, savePlan, 'Record saved successfully', '-1');
        }

    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'update Action plan details');
    }
};
//#endregion


//#region Audit Action Plan Details
const getFinalAuditActionPlanDetails = async (req, res) => {
    try {
        console.log("req.query : ", req.query);

        let auditPlanDetailsId = req.query && req.query.auditPlanDetailsId ? req.query.auditPlanDetailsId : '';
        let sectionMasterId = req.query && req.query.sectionMasterId ? req.query.sectionMasterId : '';
        let subSectionMasterId = req.query && req.query.subSectionMasterId ? req.query.subSectionMasterId : '';
        let criticalityMasterId = '';
        let auditModeMasterId = '';

        db.sequelize.query('call asp_HRA_FinalAuditDetails_Get_FinalAuditActionPlanDetails(:p_AuditPlantDetailsId,:p_SectionMasterId,:p_SubSectionMasterId,:p_CriticalityMasterId,:p_AuditModeMasterId)', {
            replacements: {
                p_AuditPlantDetailsId: auditPlanDetailsId,
                p_SectionMasterId: sectionMasterId,
                p_SubSectionMasterId: subSectionMasterId,
                p_CriticalityMasterId: criticalityMasterId,
                p_AuditModeMasterId: auditModeMasterId
            }
        }).then(result => {
            //console.log("result : ", result);
            responseHelper.success(res, 200, result, 'Audit action plan details!!', -1, result.length);
        }).catch(err => {
            //console.log("error : ", err);
            responseHelper.error(res, err.code ? err.code : codes.ERROR, err, "Error in fatching data !!")
        });
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'Error in fatching audit details');
    }
};

//#endregion

//#region  Monthly Review Details

const getMonthlyReviewActionPlanDetails_ForUpdate = async (req, res) => {
    try {
        console.log("req.query : ", req.query);

        let auditPlanDetailsId = req.query && req.query.auditPlanDetailsId ? req.query.auditPlanDetailsId : '';
        let sectionMasterId = req.query && req.query.sectionMasterId ? req.query.sectionMasterId : '';
        let subSectionMasterId = req.query && req.query.subSectionMasterId ? req.query.subSectionMasterId : '';
        let criticalityMasterId = '';
        let auditModeMasterId = '';
        let reviewNumber = 0;
        db.sequelize.query('call Asp_HRA_MonthlyReviewDetails_Get_ActionPlanDetails(:p_AuditPlantDetailsId,:p_SectionMasterId,:p_SubSectionMasterId,:p_CriticalityMasterId,:p_AuditModeMasterId,:p_reviewNumber)', {
            replacements: {
                p_AuditPlantDetailsId: auditPlanDetailsId,
                p_SectionMasterId: sectionMasterId,
                p_SubSectionMasterId: subSectionMasterId,
                p_CriticalityMasterId: criticalityMasterId,
                p_AuditModeMasterId: auditModeMasterId,
                p_reviewNumber: reviewNumber
            }
        }).then(result => {
            //console.log("result : ", result);
            responseHelper.success(res, 200, result, 'Audit action plan details!!', -1, result.length);
        }).catch(err => {
            //console.log("error : ", err);
            responseHelper.error(res, err.code ? err.code : codes.ERROR, err, "Error in fatching data !!")
        });
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'Error in fatching audit details');
    }
};

const currentMonth_NotClosedReviewDetails = async (req, res) => {
    try {
        console.log("req.query : ", req.query);
        let auditPlanDetailsId = req.query && req.query.auditPlanDetailsId ? req.query.auditPlanDetailsId : '';
        let reviewNumber = 0;
        db.sequelize.query('call Asp_HRA_MonthlyReviewDetails_Get_MonthlyReviewDetails_NotClosed(:p_AuditPlantDetailsId, :p_reviewNumber)', {
            replacements: {
                p_AuditPlantDetailsId: auditPlanDetailsId,
                p_reviewNumber: reviewNumber
            }
        }).then(result => {
            //console.log("result : ", result);
            responseHelper.success(res, 200, result, 'Audit action plan details!!', -1, result.length);
        }).catch(err => {
            //console.log("error : ", err);
            responseHelper.error(res, err.code ? err.code : codes.ERROR, err, "Error in fatching data !!")
        });
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'Error in fatching data');
    }
};

const getAuditObservationActionPlanDetails = async (auditPlanDetailsId, onlyAccepted) => {
    try {
        let where = [];
        where.push(util.constructWheresForSequelize('active', 1));
        if (auditPlanDetailsId) {
            where.push(util.constructWheresForSequelize('auditPlanDetailsId', auditPlanDetailsId));
        }
        if (onlyAccepted && onlyAccepted === "Yes") {
            where.push(util.constructWheresForSequelize('isActionPlanReviewCompleted', 1));
        }
        const auditObservationActionPlanDetails = await dal.getList({
            model: db.auditObservationActionPlanDetails,
            where: where,
            order: [['createdAt', 'desc']],
            include: false
        });
        return auditObservationActionPlanDetails;
    }
    catch (error) {
        return undefined;
    }
};

const saveMonthlyReviewDetails = async (req, res) => {
    try {
        const auditDetails = req.body;
        const auditPlanDetailsId = auditDetails && auditDetails.auditPlanDetailsId;
        const currentMonthReviewDetails = auditDetails && auditDetails.currentMonthReviewDetails;
        const approvedMonthlyreview = auditDetails && auditDetails.approvedMonthlyreview ? auditDetails.approvedMonthlyreview : undefined;
        const userId = req.user.id;
        console.log("auditDetails ,", auditDetails)
        if (util.missingRequiredFields('auditObservationActionPlanMonthlyReviewDetails', currentMonthReviewDetails, res) === '') {
            const ResultExist = await dal.bulkCreate(db.auditObservationActionPlanMonthlyReviewDetails, currentMonthReviewDetails, userId);
            if (ResultExist && approvedMonthlyreview) {
                var observationActionPlanToSave = [];
                for (let item of approvedMonthlyreview) {
                    let singleData = {
                        id: item.actionPlanDetailsId,
                        isActionPlanReviewCompleted: true,
                        reviewCompletionDate: new Date(),
                        reviewCompletionMonthNumber: item.reviewNumber,
                    }
                    observationActionPlanToSave.push(singleData);
                }
                const ResultMainExist = await dal.bulkCreate(db.auditObservationActionPlanDetails, observationActionPlanToSave, userId);
                if (ResultMainExist) {
                    const totalActionPlanDetails = await getAuditObservationActionPlanDetails(auditPlanDetailsId);
                    const totalAcceptedActionPlanDetails = await getAuditObservationActionPlanDetails(auditPlanDetailsId, 'Yes');
                    const totalPlanCount = totalActionPlanDetails && totalActionPlanDetails.length > 0 ? totalActionPlanDetails.length : 0;
                    const totalAcceptedCount = totalAcceptedActionPlanDetails && totalAcceptedActionPlanDetails.length > 0 ? totalAcceptedActionPlanDetails.length : 0;
                    const IsOverAllObservationClosed = totalPlanCount && totalPlanCount > 0 && totalAcceptedCount && totalAcceptedCount >= totalPlanCount ? true : false;
                    if (IsOverAllObservationClosed && IsOverAllObservationClosed === true) {

                        var auditPlanProcessFlowCompletionDetailsToSave = [];
                        var auditPlanProcessFlowCompletionHistoryDetailsToSave = [];
                        const StatusMaster = await getStatusMasterDetails(undefined, 'Approved', 'action_monthly_review');
                        let userMasterId = userId;
                        let processFlowMasterId = auditDetails ? auditDetails.processFlowMasterId : '';
                        let processFlowCode = auditDetails ? auditDetails.processFlowCode : '';
                        let roleMasterId = auditDetails ? auditDetails.roleMasterId : '';
                        let statusMasterId = auditDetails && auditDetails.statusMasterId && auditDetails.statusMasterId !== null ? auditDetails.statusMasterId : StatusMaster && StatusMaster.id;
                        let companyMasterId = auditDetails && auditDetails.companyMasterId ? auditDetails.companyMasterId : undefined;
                        let plantId = auditDetails && auditDetails.plantId ? auditDetails.plantId : undefined;
                        let plantMasterId = auditDetails && auditDetails.plantId ? auditDetails.plantId : undefined;
                        let actionPlanRemarks = auditDetails ? auditDetails.actionPlanRemarks : '';
                        const processFlowMaster = await getProcessFlowMaster_New(processFlowMasterId, processFlowCode, auditPlanDetailsId, auditPlanDetailsId, undefined, 1);
                        //console.log("processFlowMaster 2E", processFlowMaster);

                        processFlowMasterId = processFlowMasterId && processFlowMasterId !== undefined ? processFlowMasterId : processFlowMaster && processFlowMaster.id;

                        //  console.log("processFlowMasterId", processFlowMasterId);
                        const processFlowResponsibility = await getProcessFlowResponsibility(processFlowMasterId, processFlowCode);
                        //console.log("processFlowResponsibility 2E", processFlowResponsibility);

                        let isEditable = false;
                        let isCompleted = false;
                        let isEdited = false;
                        let completedOn = new Date();
                        let isApprovalRequired = false;
                        let isApproved = true;
                        let isSendBack = false;
                        let isRejected = false;
                        let approvalDate = new Date();
                        let agging = 0;

                        const ExistingProcessFlowCompletion = await getProcessFlowCompletionDetails(auditPlanDetailsId, processFlowMasterId, auditPlanDetailsId);
                        //console.log("ExistProcessFlowCompletion.processFlowCompletionHistoryDetails : ", ExistingProcessFlowCompletion.processFlowCompletionHistoryDetails);
                        const processFlowCompletionHistoryDetails = ExistingProcessFlowCompletion && ExistingProcessFlowCompletion.processFlowCompletionHistoryDetails;

                        let processFlowResponsibleCount = processFlowResponsibility && processFlowResponsibility.length ? processFlowResponsibility.length : 0;
                        let processFlowCompletedCount = processFlowCompletionHistoryDetails && processFlowCompletionHistoryDetails.length ? processFlowCompletionHistoryDetails.length : 0;


                        if (processFlowMaster) {
                            isEditable = processFlowMaster && processFlowCode.isEditableBeforeNextStepCompletion ? processFlowCode.isEditableBeforeNextStepCompletion : false;
                            isApprovalRequired = processFlowMaster && processFlowMaster.isApprovalRequired ? processFlowMaster.isApprovalRequired : false;
                            isApproved = isApprovalRequired ? !isApprovalRequired : true;
                            isCompleted = true;
                        }
                        else {
                            isCompleted = false;
                        }

                        let uuid3 = await dal.uuid(db.auditPlanDetails.name);
                        let processFlowCompletionDetailsId = ExistingProcessFlowCompletion && ExistingProcessFlowCompletion !== null && ExistingProcessFlowCompletion !== undefined ? ExistingProcessFlowCompletion.id : uuid3;
                        let auditPlanProcessFlowCompletionDetails = {
                            id: processFlowCompletionDetailsId,
                            auditPlanDetailsId: auditPlanDetailsId,
                            processFlowMasterId: processFlowMasterId,
                            auditPlanSubDetailsId: auditPlanDetailsId,
                            isEditable: isEditable,
                            isCompleted: isCompleted,
                            isEdited: isEdited,
                            completedOn: completedOn,
                            statusMasterId: statusMasterId,
                            isApprovalRequired: isApprovalRequired,
                            isApproved: isApproved ? isApproved : null,
                            isSendBack: isSendBack,
                            isRejected: isRejected,
                            approvalDate: approvalDate,
                            agging: agging
                        }
                        auditPlanProcessFlowCompletionDetailsToSave.push(auditPlanProcessFlowCompletionDetails);

                        let responsiblityOrder = processFlowCompletedCount ? processFlowCompletedCount + 1 : 1;
                        const ExistProcessFlowCompletionHistory = await getProcessFlowCompletionHistoryDetails(processFlowCompletionDetailsId, roleMasterId, companyMasterId, plantId, userId, responsiblityOrder);
                        // console.log("ExistProcessFlowCompletionHistory : ", ExistProcessFlowCompletionHistory);
                        let uuid4 = await dal.uuid(db.auditPlanDetails.name);
                        let processFlowCompletionHistoryDetailsId = ExistProcessFlowCompletionHistory && ExistProcessFlowCompletionHistory !== null && ExistProcessFlowCompletionHistory !== undefined ? ExistProcessFlowCompletionHistory.id : uuid4;
                        let auditPlanProcessFlowHistoryCompletionDetails = {
                            id: processFlowCompletionHistoryDetailsId,
                            processFlowCompletionDetailsId: processFlowCompletionDetailsId,
                            roleMasterId: roleMasterId,
                            companyMasterId: companyMasterId,
                            plantMasterId: plantMasterId,
                            userMasterId: userMasterId,
                            statusMasterId: statusMasterId,
                            isCompleted: true,
                            completedOn: completedOn,
                            isApproved: isApproved ? isApproved : null,
                            isSendBack: isSendBack,
                            isRejected: isRejected,
                            remarks: actionPlanRemarks,
                            agging: agging,
                            responsiblityOrder: responsiblityOrder
                        }
                        auditPlanProcessFlowCompletionHistoryDetailsToSave.push(auditPlanProcessFlowHistoryCompletionDetails);
                        if (auditPlanDetailsId) {
                            let Data = {
                                id: auditPlanDetailsId,
                                isActionPlanReviewCompleted: true,
                                actionPlanReviewCompletedOn: new Date()
                            }
                            const savePlan = await dal.saveData(db.auditPlanDetails, Data, undefined, userId);
                        }
                        //  console.log("auditPlanProcessFlowCompletionDetailsToSave", auditPlanProcessFlowCompletionDetailsToSave);
                        // console.log("auditPlanProcessFlowCompletionHistoryDetailsToSave", auditPlanProcessFlowCompletionHistoryDetailsToSave);

                        let processFlowCompletionResult = undefined;
                        let processFlowCompletionHistoryResult = undefined;
                        processFlowCompletionResult = await dal.bulkCreate(db.processFlowCompletionDetails, auditPlanProcessFlowCompletionDetailsToSave, userId);
                        if (processFlowCompletionResult) {
                            processFlowCompletionHistoryResult = await dal.bulkCreate(db.processFlowCompletionHistoryDetails, auditPlanProcessFlowCompletionHistoryDetailsToSave, userId);

                        }
                    }
                }
                responseHelper.success(res, 200, ResultMainExist, 'Record saved successfully', '-1');
            }
            else {
                responseHelper.success(res, 200, ResultExist, 'Record saved successfully', '-1');
            }
        }
        else {
            throw util.generateWarning("All required fields are not provided !!", 202.2);
        }
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'saving Audit Observation master data');
    }
};


const getActionPlanMonthlyReviewDetails = async (req, res) => {
    try {
        console.log("req.query : ", req.query);

        let auditPlanDetailsId = req.query && req.query.auditPlanDetailsId ? req.query.auditPlanDetailsId : '';
        let sectionMasterId = req.query && req.query.sectionMasterId ? req.query.sectionMasterId : '';
        let subSectionMasterId = req.query && req.query.subSectionMasterId ? req.query.subSectionMasterId : '';
        let criticalityMasterId = '';
        let auditModeMasterId = '';
        let reviewNumber = 0;
        db.sequelize.query('call Asp_HRA_MonthlyReviewDetails_Get_ActionPlanMonthlyReviewDetails(:p_AuditPlantDetailsId,:p_SectionMasterId,:p_SubSectionMasterId,:p_CriticalityMasterId,:p_AuditModeMasterId,:p_reviewNumber)', {
            replacements: {
                p_AuditPlantDetailsId: auditPlanDetailsId,
                p_SectionMasterId: sectionMasterId,
                p_SubSectionMasterId: subSectionMasterId,
                p_CriticalityMasterId: criticalityMasterId,
                p_AuditModeMasterId: auditModeMasterId,
                p_reviewNumber: reviewNumber
            }
        }).then(result => {
            //console.log("result : ", result);
            responseHelper.success(res, 200, result, 'Audit action plan monthly review details!!', -1, result.length);
        }).catch(err => {
            //console.log("error : ", err);
            responseHelper.error(res, err.code ? err.code : codes.ERROR, err, "Error in fatching data !!")
        });
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'Error in fatching audit details');
    }
};

//#endregion



module.exports.saveMediaDetails = saveMediaDetails;
module.exports.deleteMediaDetails = deleteMediaDetails;
module.exports.getSelfAuditDetails = getSelfAuditDetails;
module.exports.getSelfAuditDetails_ByProcedure = getSelfAuditDetails_ByProcedure;
module.exports.getMediaDetails = getMediaDetails;
//module.exports.saveMultipleMediaDetails = saveMultipleMediaDetails;
//module.exports.getProcessFlowCompletiondetails_ForPendingTaskDashboard = getProcessFlowCompletiondetails_ForPendingTaskDashboard;

module.exports.getSelfAuditDetails_ByPlantmasterID_ForReschedule = getSelfAuditDetails_ByPlantmasterID_ForReschedule;
module.exports.cancelSelfAuditPlan = cancelSelfAuditPlan;
module.exports.saveMultipleMediaDetails = saveMultipleMediaDetails;
module.exports.getProcessFlowCompletiondetails_ForPendingTaskDashboard = getProcessFlowCompletiondetails_ForPendingTaskDashboard;


module.exports.saveSelfAuditPlanDetails = saveSelfAuditPlanDetails;

module.exports.UpdateSelfAuditPlanDetails = UpdateSelfAuditPlanDetails;
module.exports.rescheduleSelfAuditPlanDetails = rescheduleSelfAuditPlanDetails;
module.exports.getSelfAuditDetails_ByProcessResponsibilityWise = getSelfAuditDetails_ByProcessResponsibilityWise;

module.exports.selfAuditDetails_getScopeMaster_byAuditPlanID = selfAuditDetails_getScopeMaster_byAuditPlanID;
module.exports.updateSelfAuditScore = updateSelfAuditScore;
module.exports.get_selfAuditScoreDetails = get_selfAuditScoreDetails;

module.exports.getFinalAuditDetails_ByProcessResponsibilityWise = getFinalAuditDetails_ByProcessResponsibilityWise;

module.exports.getSectionDetailsBySelfPlanDetails = getSectionDetailsBySelfAudiPlanDetailsId;
module.exports.saveFinalAuditPlanning = saveFinalAuditPlanning;
module.exports.updateFinalAuditPlanDetails = updateFinalAuditPlanDetails;
module.exports.updateFinalAuditClosureDetails = updateFinalAuditClosureDetails;
module.exports.getFinalAuditDetailsForExecution = getFinalAuditDetailsForExecution;
module.exports.getFinalAuditScopeForExecution = getFinalAuditScopeForExecution;
module.exports.saveFinalAuditObservationDetails = saveFinalAuditObservationDetails;
module.exports.getFinalAuditObservationDetails = getFinalAuditObservationDetails;
module.exports.rescheduleFinalAuditPlanDetails = rescheduleFinalAuditPlanDetails;
module.exports.getFinalAuditPlanDetails = getFinalAuditPlanDetails;
module.exports.getFinalAuditDetails = getFinalAuditDetails;
module.exports.getFinalAuditActionPlanDetails = getFinalAuditActionPlanDetails;

module.exports.getNotApplicableObservationDetails_ForActionPlanUpdate = getNotApplicableObservationDetails_ForActionPlanUpdate;
module.exports.updateActionPlanDetails = updateActionPlanDetails;


module.exports.getMonthlyReviewActionPlanDetails_ForUpdate = getMonthlyReviewActionPlanDetails_ForUpdate;
module.exports.currentMonth_NotClosedReviewDetails = currentMonth_NotClosedReviewDetails;
module.exports.saveMonthlyReviewDetails = saveMonthlyReviewDetails;
module.exports.getActionPlanMonthlyReviewDetails = getActionPlanMonthlyReviewDetails;
module.exports.getFinalAuditScopeForExecution_ForAll = getFinalAuditScopeForExecution_ForAll;

module.exports.get_AuditObservationForAudit = get_AuditObservationForAudit;