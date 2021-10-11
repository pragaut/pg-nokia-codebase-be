
var express = require('express');
var router = express.Router();
const util = require('../../util');
const working = require('../../controllers/tmc/working');


//#region media Details Details
router.put('/selfAuditDetails', (req, res) => working.saveSelfAuditPlanDetails(req, res));
router.post('/selfAuditDetails', (req, res) => working.saveSelfAuditPlanDetails(req, res));
router.get('/selfAuditPlanDetails', (req, res) => working.getSelfAuditDetails(req, res));
router.get('/selfAuditPlanDetails/selfAuditForReschedule', (req, res) => working.getSelfAuditDetails_ByPlantmasterID_ForReschedule(req, res));
router.get('/selfAuditPlanDetails/ByProcedure', (req, res) => working.getSelfAuditDetails_ByProcedure(req, res));
router.put('/selfAuditPlanDetails/CancelAudit', (req, res) => working.cancelSelfAuditPlan(req, res));
router.post('/selfAuditPlanDetails/rescheduleAudit', (req, res) => working.rescheduleSelfAuditPlanDetails(req, res));
router.put('/selfAuditPlanDetails/updateAuditDetails', (req, res) => working.UpdateSelfAuditPlanDetails(req, res));

router.get('/mediaDetails', (req, res) => working.getMediaDetails(req, res));
router.put('/mediaDetails', (req, res) => working.saveMediaDetails(req, res));
router.post('/mediaDetails', (req, res) => working.saveMediaDetails(req, res));
router.delete('/mediaDetails', (req, res) => working.deleteMediaDetails(req, res));
router.post('/mediaDetails/multiplefiles', (req, res) => working.saveMultipleMediaDetails(req, res));

router.get('/pendingTaskDashboard', (req, res) => working.getProcessFlowCompletiondetails_ForPendingTaskDashboard(req, res));
router.get('/selfAuditPlanDetails/selfAuditProcessresponsibilityWise', (req, res) => working.getSelfAuditDetails_ByProcessResponsibilityWise(req, res));
//#endregion

//#region  Audit Observation
router.get('/auditObservationForAudit', (req, res) => working.get_AuditObservationForAudit(req, res));
//#endregion

//#region  Execute Self Audit Details
router.get('/selfAuditPlanDetails/scopeDetails', (req, res) => working.selfAuditDetails_getScopeMaster_byAuditPlanID(req, res));
router.post('/selfAuditPlanDetails/updateSelfAuditScore', (req, res) => working.updateSelfAuditScore(req, res));
router.get('/selfAuditPlanDetails/selfAuditScoreDetails', (req, res) => working.get_selfAuditScoreDetails(req, res));

//#endregion
//#region  Final Audit
router.get('/finalAuditProcessresponsibilityWise', (req, res) => working.getFinalAuditDetails_ByProcessResponsibilityWise(req, res));
router.get('/finalAuditPlanDetails/finalAuditScoreDetails', (req, res) => working.get_finalAuditScoreDetails(req, res));

//#endregion
//#region Final Audit Plan
router.post('/finalAuditPlanDetails/saveFinalAuditPlanning', (req, res) => working.saveFinalAuditPlanning(req, res));
router.put('/updateFinalAuditPlanDetails', (req, res) => working.updateFinalAuditPlanDetails(req, res));
router.put('/updateFinalAuditClosureDetails', (req, res) => working.updateFinalAuditClosureDetails(req, res));

router.get('/finalAuditDetailsForExecution', (req, res) => working.getFinalAuditDetailsForExecution(req, res));
router.get('/finalAuditScopeForExecution', (req, res) => working.getFinalAuditScopeForExecution(req, res));
router.get('/finalAuditScopeForExecutionForAll', (req, res) => working.getFinalAuditScopeForExecution_ForAll(req, res));
router.post('/finalAuditObservationDetails', (req, res) => working.saveFinalAuditObservationDetails(req, res));
router.put('/finalAuditObservationDetails', (req, res) => working.saveFinalAuditObservationDetails(req, res));
router.get('/finalAuditObservationDetails', (req, res) => working.getFinalAuditObservationDetails(req, res));

router.get('/finalAuditPlanDetails', (req, res) => working.getFinalAuditPlanDetails(req, res));
router.get('/finalAuditDetails', (req, res) => working.getFinalAuditDetails(req, res));
router.post('/rescheduleFinalAuditPlanDetails', (req, res) => working.rescheduleFinalAuditPlanDetails(req, res));
router.get('/getSectionDetailsBySelfPlanDetails', (req, res) => working.getSectionDetailsBySelfPlanDetails(req, res));

router.get('/finalAuditActionPlanDetails', (req, res) => working.getFinalAuditActionPlanDetails(req, res));

//#endregion

//#region  Action Plan Update

router.get('/auditActionPlan/actionRequiredAuditObservationDetails', (req, res) => working.getNotApplicableObservationDetails_ForActionPlanUpdate(req, res));
router.post('/auditActionPlan/updateActionPlanDetails', (req, res) => working.updateActionPlanDetails(req, res));
 
//#endregion

//#region  Month Review Update
router.get('/monthlyReview/getMonthlyReviewActionPlanDetails_ForUpdate', (req, res) => working.getMonthlyReviewActionPlanDetails_ForUpdate(req, res));
router.get('/monthlyReview/currentMonth_NotClosedReviewDetails', (req, res) => working.currentMonth_NotClosedReviewDetails(req, res));
router.post('/monthlyReview/saveMonthlyReviewDetails', (req, res) => working.saveMonthlyReviewDetails(req, res));

router.get('/monthlyReview/getReviewDetails', (req, res) => working.getActionPlanMonthlyReviewDetails(req, res));
//#endregion
module.exports = router;