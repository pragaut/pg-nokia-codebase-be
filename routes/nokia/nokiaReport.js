
var express = require('express');
var router = express.Router();
const util = require('../../util');
const report = require('../../controllers/nokia/report');
 

//#region  Self Vs Final Score Plant Wise
router.get('/selfScoreVsFinalScore_PlantWise', (req, res) => report.report_GetSelfScoreVsFinalScore_plantWise(req, res));
 //#endregion

 //#region  Score Summary
 router.get('/selfAudit_ScoreSummary_SubSectionWise', (req, res) => report.selfAudit_ScoreSummary_SubSectionWise(req, res));
router.get('/selfAudit_ScoreSummary_SectionWise', (req, res) => report.selfAudit_ScoreSummary_SectionWise(req, res));
router.get('/finalAudit_ScoreSummary_SubSectionWise', (req, res) => report.finalAudit_ScoreSummary_SubSectionWise(req, res));
router.get('/finalAudit_ScoreSummary_SectionWise', (req, res) => report.finalAudit_ScoreSummary_SectionWise(req, res));
 
 //#endregion
 //#region  Self V/s Final Score
router.get('/GetSelfVsFinalAuditScoreCompanySectionWise',(req,res)=> report.getSelfVsFinalAuditScoreCompanySectionWise(req,res));
  //#endregion
module.exports = router;