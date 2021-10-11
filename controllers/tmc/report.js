const { db } = require('../../models');
const dal = require('../../dal');
const util = require('../../util/');
const responseHelper = require('../../util/response.helper');
const codes = require('../../util/codes').codes;

const report_GetSelfScoreVsFinalScore_plantWise = async (req, res) => {
    try {

        db.sequelize.query('call Report_HRA_SelfScore_Vs_FinalScore_SectionWise(:p_YearMasterId, :p_PlantMasterId, :p_CompanyMasterId, :p_RoleMasterId, :p_UserMasterId,:p_SectionMasterId,:p_SubSectionMasterId,:p_CriticalityMasterId,:p_AuditModeMasterId,:p_ReportType)', {
            replacements: {
                p_YearMasterId: req.query.yearMasterId ? req.query.yearMasterId : '',
                p_PlantMasterId: req.query.plantMasterId ? req.query.plantMasterId : '',
                p_CompanyMasterId: req.query.companyMasterId ? req.query.companyMasterId : '',
                p_RoleMasterId: req.query.roleMasterId ? req.query.roleMasterId : '',
                p_UserMasterId: req.query.userMasterId ? req.query.userMasterId : '',
                p_SectionMasterId: null,
                p_SubSectionMasterId: null,
                p_CriticalityMasterId: null,
                p_AuditModeMasterId: null,
                p_ReportType: null
            }
        }).then(results => {
            //console.log("results : ", results);
            responseHelper.success(res, 200, results, 'Self score Vs Final Score Details', '-1', results.length);
        }).catch(err => {
            responseHelper.error(res, err.code ? err.code : codes.ERROR, err, 'Error in data details');
        });
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting report Details');
    }
};

const getSelfVsFinalAuditScoreCompanySectionWise = async (req, res) => {
    try {

        db.sequelize.query('call asp_HRA_AuditScore_Get_SelfAndFinalAuditScoreCompanySectionWise(:p_YearMasterId, :p_PlantMasterId, :p_CompanyMasterId, :p_RoleMasterId, :p_UserMasterId,:p_SectionMasterId,:p_SubSectionMasterId,:p_CriticalityMasterId,:p_AuditModeMasterId,:p_ReportType)', {
            replacements: {
                p_YearMasterId: req.query.yearMasterId ? req.query.yearMasterId : '',
                p_PlantMasterId: req.query.plantMasterId ? req.query.plantMasterId : '',
                p_CompanyMasterId: req.query.companyMasterId ? req.query.companyMasterId : '',
                p_RoleMasterId: req.query.roleMasterId ? req.query.roleMasterId : '',
                p_UserMasterId: req.query.userMasterId ? req.query.userMasterId : '',
                p_SectionMasterId: null,
                p_SubSectionMasterId: null,
                p_CriticalityMasterId: null,
                p_AuditModeMasterId: null,
                p_ReportType: null
            }
        }).then(results => {
            //console.log("results : ", results);
            responseHelper.success(res, 200, results, 'Self score Vs Final Score Details', '-1', results.length);
        }).catch(err => {
            responseHelper.error(res, err.code ? err.code : codes.ERROR, err, 'Error in data details');
        });
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting report Details');
    }
};

//#region  Self Audit Score Summery

const selfAudit_ScoreSummary_SubSectionWise = async (req, res) => {
    try {

        db.sequelize.query('call Asp_HRA_Report_SelfAudit_Get_SummaryDetails_SubSectionWise(:selfAuditPlanDetailsID, :sectionMasterId, :selfAuditPlanBasicDetailsId, :companyMasterId, :plantMasterId,:yearTypeMasterId,:yearMasterId)', {
            replacements: {
                selfAuditPlanDetailsID: req.query.selfAuditPlanDetailsID ? req.query.selfAuditPlanDetailsID : '',
                sectionMasterId: req.query.sectionMasterId ? req.query.sectionMasterId : '',
                selfAuditPlanBasicDetailsId: req.query.selfAuditPlanBasicDetailsId ? req.query.selfAuditPlanBasicDetailsId : '',
                companyMasterId: req.query.companyMasterId ? req.query.companyMasterId : '',
                plantMasterId: req.query.plantMasterId ? req.query.plantMasterId : '',
                yearTypeMasterId: req.query.yearTypeMasterId ? req.query.yearTypeMasterId : '',
                yearMasterId: req.query.yearMasterId ? req.query.yearMasterId : '',
            }
        }).then(results => {
            //console.log("results : ", results);
            responseHelper.success(res, 200, results, 'Self Audit Score Summary Details', '-1', results.length);
        }).catch(err => {
            responseHelper.error(res, err.code ? err.code : codes.ERROR, err, 'Error in data details');
        });
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting report Details');
    }
};

const selfAudit_ScoreSummary_SectionWise = async (req, res) => {
    try {

        db.sequelize.query('call Asp_HRA_Report_SelfAudit_Get_SummaryDetails_SectionWise(:selfAuditPlanDetailsID, :sectionMasterId, :selfAuditPlanBasicDetailsId, :companyMasterId, :plantMasterId,:yearTypeMasterId,:yearMasterId)', {
            replacements: {
                selfAuditPlanDetailsID: req.query.selfAuditPlanDetailsID ? req.query.selfAuditPlanDetailsID : '',
                sectionMasterId: req.query.sectionMasterId ? req.query.sectionMasterId : '',
                selfAuditPlanBasicDetailsId: req.query.selfAuditPlanBasicDetailsId ? req.query.selfAuditPlanBasicDetailsId : '',
                companyMasterId: req.query.companyMasterId ? req.query.companyMasterId : '',
                plantMasterId: req.query.plantMasterId ? req.query.plantMasterId : '',
                yearTypeMasterId: req.query.yearTypeMasterId ? req.query.yearTypeMasterId : '',
                yearMasterId: req.query.yearMasterId ? req.query.yearMasterId : '',
            }
        }).then(results => {
            //console.log("results : ", results);
            responseHelper.success(res, 200, results, 'Self Audit Score Summary Details', '-1', results.length);
        }).catch(err => {
            responseHelper.error(res, err.code ? err.code : codes.ERROR, err, 'Error in data details');
        });
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting report Details');
    }
};
//#endregion

//#region  Final Audit Score Summery

const finalAudit_ScoreSummary_SubSectionWise = async (req, res) => {
    try {
        db.sequelize.query('call Asp_HRA_Report_FinalAudit_Get_SummaryDetails_SubSectionWise(:auditPlanDetailsID, :sectionMasterId, :selfAuditPlanDetailsId, :companyMasterId, :plantMasterId,:yearTypeMasterId,:yearMasterId)', {
            replacements: {
                auditPlanDetailsID: req.query.auditPlanDetailsId ? req.query.auditPlanDetailsId : '',
                sectionMasterId: req.query.sectionMasterId ? req.query.sectionMasterId : '',
                selfAuditPlanDetailsId: req.query.selfAuditPlanDetailsId ? req.query.selfAuditPlanDetailsId : '',
                companyMasterId: req.query.companyMasterId ? req.query.companyMasterId : '',
                plantMasterId: req.query.plantMasterId ? req.query.plantMasterId : '',
                yearTypeMasterId: req.query.yearTypeMasterId ? req.query.yearTypeMasterId : '',
                yearMasterId: req.query.yearMasterId ? req.query.yearMasterId : '',
            }
        }).then(results => {
            //console.log("results : ", results);
            responseHelper.success(res, 200, results, 'Final Audit Score Summary Details', '-1', results.length);

        }).catch(err => {
            responseHelper.error(res, err.code ? err.code : codes.ERROR, err, 'Error in data details');
        });
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting report Details');
    }
};
const finalAudit_ScoreSummary_SectionWise = async (req, res) => {
    try {

        db.sequelize.query('call Asp_HRA_Report_FinalAudit_Get_SummaryDetails_SectionWise(:auditPlanDetailsID, :sectionMasterId, :selfAuditPlanDetailsId, :companyMasterId, :plantMasterId,:yearTypeMasterId,:yearMasterId)', {
            replacements: {
                auditPlanDetailsID: req.query.auditPlanDetailsId ? req.query.auditPlanDetailsId : '',
                sectionMasterId: req.query.sectionMasterId ? req.query.sectionMasterId : '',
                selfAuditPlanDetailsId: req.query.selfAuditPlanDetailsId ? req.query.selfAuditPlanDetailsId : '',
                companyMasterId: req.query.companyMasterId ? req.query.companyMasterId : '',
                plantMasterId: req.query.plantMasterId ? req.query.plantMasterId : '',
                yearTypeMasterId: req.query.yearTypeMasterId ? req.query.yearTypeMasterId : '',
                yearMasterId: req.query.yearMasterId ? req.query.yearMasterId : '',
            }
        }).then(results => {
            //console.log("results : ", results);
            responseHelper.success(res, 200, results, 'Final Audit Score Summary Details', '-1', results.length);
        }).catch(err => {
            responseHelper.error(res, err.code ? err.code : codes.ERROR, err, 'Error in data details');
        });
    }
    catch (error) {
        responseHelper.error(res, error, error.code ? error.code : codes.ERROR, 'getting report Details');
    }
};
//#endregion


module.exports.report_GetSelfScoreVsFinalScore_plantWise = report_GetSelfScoreVsFinalScore_plantWise;
module.exports.selfAudit_ScoreSummary_SubSectionWise = selfAudit_ScoreSummary_SubSectionWise;
module.exports.selfAudit_ScoreSummary_SectionWise = selfAudit_ScoreSummary_SectionWise;

module.exports.finalAudit_ScoreSummary_SubSectionWise = finalAudit_ScoreSummary_SubSectionWise;
module.exports.finalAudit_ScoreSummary_SectionWise = finalAudit_ScoreSummary_SectionWise;

module.exports.getSelfVsFinalAuditScoreCompanySectionWise = getSelfVsFinalAuditScoreCompanySectionWise;
