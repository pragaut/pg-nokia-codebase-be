const fs = require('fs');
const path = require('path');
const config = require('../../config').config;
const constants = require('../constants');
const utils = require('..');
/**
 * 
 * @param {*} type the template type, like Register, Change Password
 * @param {*} options the options for template
 * 		@param {*} options.name user name 
 * 		@param {*} options.hash the hash for reset password or registration
 * 		@param {*} options.otp the otp
 */
module.exports.getTemplate = (type, options) => {
	let fileName = '';
	let url = '';
	let subject = '';
	let childTemplate = ''; // for any childData
	console.log('type: ', type, options);
	switch (type) {
		case constants.TEMPLATES.TYPES.VENDOR.REGISTRATION_NORMAL:
			fileName = 'vendor.registration.social.auth.html';
			subject = 'Anand  HR-Audit | Vendor registration confirmation';

			break;
		case constants.TEMPLATES.TYPES.VENDOR.REGISTRATION_SOCIAL:
			fileName = 'vendor.registration.normal.auth.html';
			subject = 'Anand  HR-Audit | Vendor registration confirmation';

			break;
		case constants.TEMPLATES.TYPES.REGISTRATION.EMAIL:
			fileName = 'otp.registration.email.html';
			subject = 'Anand  HR-Audit | Verify OTP';

			break;
		case constants.TEMPLATES.TYPES.REGISTRATION.MOBILE:
			fileName = 'otp.registration.mobile.html';
			break;
		case constants.TEMPLATES.TYPES.FREETRIAL_PASSWORD.MOBILE:
			fileName = 'pwd.freetrial.mobile.html';
			break;
		case constants.TEMPLATES.TYPES.PASSWORD.EMAIL:
			fileName = 'otp.resetpassword.email.html';
			subject = 'Anand  HR-Audit | OTP for Password Reset';

			break;
		case constants.TEMPLATES.TYPES.CHANGE_MOBILE_CONFIRM.EMAIL:
			fileName = 'otp.email.html';
			subject = 'Anand  HR-Audit | OTP for Mobile Change Request';
			break;
		case constants.TEMPLATES.TYPES.PASSWORD.MOBILE:
			fileName = 'otp.resetpassword.mobile.html';

		case constants.TEMPLATES.TYPES.OTP.OTHERS:
		case constants.TEMPLATES.TYPES.CHANGE_MOBILE.MOBILE:
		case constants.TEMPLATES.TYPES.CHANGE_MOBILE_CONFIRM.MOBILE:
		case constants.TEMPLATES.TYPES.DEVICE_VERIFICATION.MOBILE:
			fileName = 'otp.mobile.html';
			break;
		case 'resetpassword':
			fileName = 'resetpassword.html';
			url = (config.DEBUG ? config.URLs.DEV : config.URLs.PROD) + '/resetpassword/' + options.hash;
			subject = 'Anand  HR-Audit | Reset your Password';
			break;
		case constants.TEMPLATES.TYPES.REFUND.SUCCESS:
			fileName = 'refund.success.html';
			subject = 'Anand  HR-Audit | Refund Successful';
			break;

		case constants.TEMPLATES.TYPES.REFUND.REQUESTED:
			fileName = 'refund.requested.html';
			subject = 'Anand  HR-Audit  | Refund Requested | Order ID: ' + options.orderId;
			break;
		case constants.TEMPLATES.TYPES.SUBSCRIPTION.SUCCESS:
			fileName = 'subscription.success.html';
			subject = 'Subscription Confirmed | ANAND GROUP';
		case 'password-reset':
			fileName = 'passwordreset.html';
			subject = 'Anand  HR-Audit | Your Password has been Reset';
			break;
		case 'account-unlocked':
			fileName = 'account.unlocked.html';
			subject = 'Anand  HR-Audit | Your Account has been Unlocked';
			break;
		case 'password-freetrial-mobile':
			fileName = 'pwd.mobile.html';
			break;
		case constants.TEMPLATES.TYPES.LOGIN_SUCCESS.EMAIL:
			fileName = 'login.success.email.html';
			subject = 'Anand  HR-Audit | Your are logged in successfully';
			break;
		case constants.TEMPLATES.TYPES.Invoice_Generated.EMAIL:
			fileName = 'invoice.generated.email.html';
			subject = 'Anand  HR-Audit | ' + options.emailSubject;
			break;
		case constants.TEMPLATES.TYPES.Invoice_Acceptance.EMAIL:
			fileName = 'invoice.acceptance.email.html';
			subject = "Anand  HR-Audit | Invoice " + options.AcceptanceStatus;
			break;
		case constants.TEMPLATES.TYPES.Invoice_Payment.EMAIL:
			fileName = 'invoice.payment.email.html';
			subject = "Anand  HR-Audit | " + options.emailSubject;;
			break;
		case constants.TEMPLATES.TYPES.Invoice_IDAR.EMAIL:
			fileName = 'invoice.idar.email.html';
			subject = "Anand  HR-Audit | " + options.emailSubject;;
			break;
		default:
			break;
	}
	console.log("__dirname", __dirname);
	console.log("fileName", fileName);
	let content = fs.readFileSync(path.join(__dirname, fileName));
	let body = content.toString('utf8');
	/**
	 * patches here
	 * We cannot write a generic function that works for all, so we GOTTA add some patches, for ex, order
	 * 
	 */
	body = body
		.replace('<%userName%>', options.name)
		.replace('<%url%>', url)
		.replace('<%email%>', options.email)
		.replace('<%password%>', options.password)
		.replace('<%otp%>', options.otp ? options.otp : '')
		.replace('<%firstName%>', options.firstName)
		.replace('<%orderNumber%>', options.orderNumber ? options.orderNumber : '')
		.replace('<%paymentStatus%>', options.paymentStatus ? options.paymentStatus : '')
		.replace('<%paymentMethod%>', options.paymentMethod ? options.paymentMethod : '')
		.replace('<%total%>', options.cartTotal + options.shipping - options.discount)
		.replace('<%tax%>', options.tax > 0 ? ('₹' + options.tax) : '(inclusive of tax)')
		.replace('<%discount%>', options.discount ? options.discount : 0)
		.replace('<%paidAmount%>', options.paidAmount ? options.paidAmount : 0)
		.replace('<%date%>', options.date ? options.date : '')
		.replace('<%remaining%>', options.remaining ? options.remaining : 0);

	if (type === constants.TEMPLATES.TYPES.Invoice_Generated.EMAIL || type === constants.TEMPLATES.TYPES.Invoice_Acceptance.EMAIL
		|| type === constants.TEMPLATES.TYPES.Invoice_Payment.EMAIL
		|| type === constants.TEMPLATES.TYPES.Invoice_IDAR.EMAIL
	) {
		body = body
			.replace('<%invoiceNumber%>', options.invoiceNumber ? options.invoiceNumber : '')
			.replace('<%recordNumber%>', options.recordNumber ? options.recordNumber : '')
			.replace('<%rPlantName%>', options.rPlantName ? options.rPlantName : '')
			.replace('<%pPlantName%>', options.pPlantName ? options.pPlantName : '')
			.replace('<%invoiceDate%>', options.invoiceDate ? options.invoiceDate : '')
			.replace('<%totalAmount%>', options.totalAmount ? options.totalAmount : '')
			.replace('<%glCode%>', options.glCode ? options.glCode : '')
			.replace('<%description%>', options.description ? options.description : '')
			.replace('<%Vouchertype%>', options.Vouchertype ? options.Vouchertype : '')
			.replace('<%NatureOftransaction%>', options.NatureOftransaction ? options.NatureOftransaction : '')
			.replace('<%AcceptanceStatus%>', options.AcceptanceStatus ? options.AcceptanceStatus : '')
			.replace('<%AcceptanceRemarks%>', options.AcceptanceRemarks ? options.AcceptanceRemarks : '')
			.replace('<%reasonForNonAcceptance%>', options.reasonForNonAcceptance ? options.reasonForNonAcceptance : '')
			.replace('<%emailBody%>', options.emailBody ? options.emailBody : '')
			.replace('<%mainRemarks%>', options.mainRemarks ? options.mainRemarks : '')
			.replace('<%PaymentdetailsTable%>', options.PaymentdetailsTable ? options.PaymentdetailsTable : '')
			.replace('<%TotalPaid%>', options.TotalPaid ? options.TotalPaid : '')
			.replace('<%MediaDetails%>', options.MediaDetails ? options.MediaDetails : '')
			.replace('<%PendingPayment%>', options.PendingPayment ? options.PendingPayment : '');

	}



	console.log('ok, email subject is: ', subject);

	return {
		subject,
		body
	};
};