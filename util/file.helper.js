const multer = require('multer');
const fso = require('fs');
const path = require('path');
const util = require('./index');
const responseHelper = require('./response.helper');
const codes = require('./codes').codes;
const fetch = require('./fetch');

let staticPath = undefined;

const storage = multer.diskStorage({
	onFileSizeLimit: function (file) {
		console.log("onFileSizeLimit", file);
		file.error = {
			message: "Upload failed",
			status: codes.FILE_READING_ERROR
			// status: -6
		};
	}, onFileUploadComplete: function (file, req, res) {
		console.log("onFileUploadComplete", file);
		if (file.error) {
			res.send(file.error);
		}
	},
	destination: function (req, file, cb) {
		console.log('destie: ', staticPath);
		cb(null, staticPath)
	},
	filename: function (req, file, cb) {
		console.log('file generated: ', file);
		let fileName = '';
		let extension = '';
		const splitter = file.originalname.split('.');

		if (splitter.length > 1) {
			extension = '.' + splitter[splitter.length - 1];
			fileName = file.originalname.replace(extension, '');
		}
		else {
			fileName = file.originalname;
		}

		req.body.fileNameWOExtension = fileName + '-' + Date.now();
		req.body.fileName = req.body.fileNameWOExtension + extension;
		req.body.fullFilePath = path.resolve(staticPath, req.body.fileName);
		req.body.extension = extension;
		cb(null, req.body.fileName);
	}
});

const upload = multer({
	storage: storage
});
module.exports.upload = upload;


const init = async (app, _staticPath, _appName = 'shopping') => {
	staticPath = _staticPath || 'uploads/';
	 console.log("_appName i,g ", _appName);
	let PostURL = process.env.DOMAIN_TMC
	app.post('/api-tmc/' + _appName + '/imageUpload', upload.array('image', 200), async function (req, res) {
		//console.log("Sucess:file upload multiple");
		//console.log("Sucess:file upload multiple req",JSON.parse(JSON.stringify(req.body.image)))
		//console.log("Sucess:file upload multiple req", req.files )
		//console.log("Sucess:file upload multiple req 2",req)
		//setTimeout(() => {
		responseHelper.success(res, 200, req.files, 'Multiple Image uploaded successfully');
		//}, 200); 
	});
	// app.post('/api-reco/' + _appName + '/imageUpload', upload.single('image'), async function (req, res) {
	// 	console.log("Sucess:file upload single")
	// 	//setTimeout(() => {
	// 	responseHelper.success(res, 200, req.body.fileName, 'Image uploaded successfully');
	// 	//}, 200); 
	// });
	// app.post('/api-reco/' + _appName + '/imageUpload', upload.single('image'), async function (req, res) {

	// 	if (req.body.saveToUser && req.body.userId) {
	// 		// let's resize as it is user profile pic
	// 		const newFileName = req.body.fileNameWOExtension + '.cropped' + req.body.extension;
	// 		const targetPath = 'images/' + newFileName;
	// 		await util.resizeFile(req.body.fullFilePath, path.resolve(staticPath, newFileName), targetPath);

	// 		const url = process.env.AUTH_URL + '/api/shopping/user/';

	// 		const userData = {
	// 			id: req.body.userId,
	// 			profilePic: targetPath
	// 		};


	// 		const userResult = await fetch.get(url, {
	// 			method: 'put',
	// 			headers: {
	// 				'x-access-token': req.headers['x-access-token'],
	// 				'content-type': 'application/json'
	// 			},
	// 			body: JSON.stringify(userData)
	// 		});

	// 		console.log('success: ', userResult);

	// 		responseHelper.success(res, 200, req.body.fileName, 'Image uploaded successfully');

	// 	}
	// 	else {
	// 		console.log("Sucess:file uploF")
	// 		//setTimeout(() => {
	// 		responseHelper.success(res, 200, req.body.fileName, 'Image uploaded successfully');
	// 		//}, 200);

	// 	}


	// });

};


const checkFileExists = (path) => {
	return new Promise(resolve => {
		fso.exists(path, (exists) => resolve(exists));
	});
};


module.exports.checkFileExists = checkFileExists;
module.exports.init = init;

