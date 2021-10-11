const Razorpay = require('razorpay');
const codes = require('../util/codes').codes;

const instance = new Razorpay({
    key_id: process.env.RAZOR_PAY_API_KEY,
    key_secret: process.env.RAZOR_PAY_API_SECRET,
});


const breakRazorPayError = (error, errorReceivedInWhen) => {

    let newError = {};

    if (error.error) {
        newError = new Error(`Error received while ${errorReceivedInWhen}. And the error description is ${error.error.description}`);
    }
    else {
        newError = new Error(`Error received while ${errorReceivedInWhen}. And the error description is ${error.message}`);
    }

    newError.code = codes.RAZOR_PAY_GET_BY_ID

    console.log('razor pay error: ', newError);

    return newError;
}

/**
 * 
 * @param {DateTime} from 
 * @param {DateTime} to 
 * 
 * By default, if you don't send from or to, it will generate the payment list for previous 48 hours
 */
const getPayments = async (from, to) => {
    const paymentTo = to ? Number(new Date(to)) : Number(new Date());
    const paymentFrom = from ? Number(new Date(from)) : (process.env.MODE === 'dev' ? 1545988274 : Number(dateAdd(paymentTo, 'hour', '-48')));

    const payment = await this.instance.payments.all({
        from: paymentFrom,
        to: paymentTo,
        count: 100
    });

    if (payment && payment.count > 0) {
        // payments found
        return payment.items;
    }

    return [];
};


const getPaymentById = async paymentId => {
    try {
        return await this.instance.payments.fetch(paymentId);
    }
    catch (error) {
        throw breakRazorPayError(error, `fetching payment from razor pay with id: ${paymentId}`);
    }
};


const getRefundById = async refundId => {
    try {
        return await this.instance.payments.fetch(refundId);
    }
    catch (error) {
        throw breakRazorPayError(error, `getting refund from razor pay with id: ${refundId}`);
    }
};


const refund = async (paymentId, amount, notes) => {
    try {
        const postData = { };

        if (amount || amount === 0) {
            postData['amount'] = amount;
        }

        console.log('razor pay wrapper says amount is: ', amount);
        const refundResult = await this.instance.payments.refund(paymentId, postData);
        return refundResult;
    }
    catch(error) {
        throw breakRazorPayError(error, `refunding from razor pay with id: ${paymentId}`);
    }
};


/**
 * 
 * @param {*} paymentId Payment id to capture
 * @param {*} amount Amount to capture
 */
const capture = async (paymentId, amount) => {
    try {
        const captureResult = await this.instance.payments.capture(paymentId, amount);
        return captureResult;
    }
    catch(error) {
        throw breakRazorPayError(error, `capturing payment with id: ${paymentId}`);
    }
};

/**
 * 
 * @param {*} planId the plan id to be used for creating a subscription
 */
const createSubscription = async (planId, userId, startDate, totalCount) => {
    try {
            const subscription = {
                plan_id: planId,
                start_at: startDate ? new Date(startDate).getTime() : undefined,
                total_count: totalCount,
                customer_notify: 1,
            };
    
        const captureResult = await this.instance.subscriptions.create(subscription);
        return captureResult;
    }
    catch(error) {
        throw breakRazorPayError(error, `creating subscription for id: ${planId}`);
    }
};


const getPlans = async () => {
    try {
        return [];
        //return await this.instance.plans.all(); 
    }
    catch (error) {
        throw breakRazorPayError(error, `fetching plans from razor pay with`);
    }
};

/**
 * 
 * @param {*} body body sent by razor pay hook
 * @param {*} signature sent to request with header: X-Razorpay-Signature
 */
const validateSignature_subscription = (body, signature) => {
    /** dev mode: */
    if (process.env.MODE !== 'prod') {
        return true;
    }


console.log('got this: ', body, signature, process.env.RAZOR_PAY_HOOKS_SECRET_SUBSCRIPTION);
    const web_hook_secret = process.env.RAZOR_PAY_HOOKS_SECRET_SUBSCRIPTION;
    return Razorpay.validateWebhookSignature(body, signature, web_hook_secret);
};


module.exports.instance = instance;
module.exports.capture = capture;
module.exports.getPayments = getPayments;
module.exports.getPaymentById = getPaymentById;
module.exports.getRefundById = getRefundById;
module.exports.refund = refund;
module.exports.getPlans = getPlans;
module.exports.createSubscription = createSubscription;
module.exports.validateSignature_subscription = validateSignature_subscription;
