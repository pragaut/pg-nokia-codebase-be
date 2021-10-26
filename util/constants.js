module.exports = {
    MIN_DATE: '1/1/1970',
    MAX_DATE: '1/1/2050',
    LANGUAGE: 'en',
    ECRYPTIONTYPES: {
        ACTIVATION_HASH: 'ACTIVATION_HASH',
        PASSWORD_HASH: 'PASSWORD_HASH'
    },

    SHARK_SCOPE: {
        TOURNAMENT_STATUS_ONGOING: 'ongoing',
        TOURNAMENT_STATUS_COMPLETED: 'completed',
    },

    EVENT: {
        SCHEDULED: 'scheduled',
        STARTED: 'started',
        COMPLETED: 'completed',
        CANCELLED: 'cancelled',
    },

    GOOGLE: {
        AUTH_URL: 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=',
        APP_ID: '567890717322-sk4egq8ivh75lm5pa3bqtu3ig6p5ucj3.apps.googleusercontent.com'
    },

    FACEBOOK: {
        AUTH_URL: 'https://graph.facebook.com/me?fields=name,email,birthday,location,hometown&access_token=',
        APP_ID: '308433213108388',
        PICTURE_URL: 'https://graph.facebook.com/<%userid%>/picture?type=square'
    },
 
    AUDIT: {
        LINE_ITEM_STATUS: {
            //DELIVERED: 'delivered',
            //RETURNED: 'returned'
        },

        HOST_NAME: {
            AUDIT: 'audit'
        }
    },
    NOKIA: {
        LINE_ITEM_STATUS: {
            //DELIVERED: 'delivered',
            //RETURNED: 'returned'
        },

        HOST_NAME: {
            NOKIA: 'nokia'
        }
    }, 

    TEMPLATES: {
        TYPES: {
            REGISTRATION: {
                MOBILE: 'registration.otp.mobile',
                EMAIL: 'registration.otp.email'
            },
            PASSWORD: {
                MOBILE: 'password.otp.mobile',
                EMAIL: 'password.otp.email',
            },
            CHANGE_MOBILE: {
                MOBILE: 'update-mobile.otp.mobile'
            },
            CHANGE_MOBILE_CONFIRM: {
                MOBILE: 'update-mobile-confirm.otp.mobile',
                EMAIL: 'update-mobile-confirm.otp.email'
            },
            CHANGE_MOBILE: {
                MOBILE: 'update-mobile.otp.mobile'
            },
            DEVICE_VERIFICATION: {
                MOBILE: 'device-verification.otp.mobile'
            },
            REFUND: {
                SUCCESS: 'refund.success',
                REQUESTED: 'refund.requested'
            },
            OTP: {
                OTHERS: 'others.otp.mobile'
            },
            COD: {
                MOBILE: 'cod.mobile'
            },
            ORDER: {
                SUCCESS: 'order.success',
            },
            SUBSCRIPTION: {
                SUCCESS: 'subscription.success',
            },
            ORDERITEM: {
                DELIVERED: 'order-status-delivered',
                PACKED: 'order-status-packed',
                SHIPPED: 'order-status-shipped',
                RETURNED: 'order-status-returned',
                CANCELLED: 'order-status-cancelled'
            },
            VENDOR: {
                REGISTRATION_NORMAL: 'vendor.registration.normal',
                REGISTRATION_SOCIAL: 'vendor.registration.social'
            },
            FREETRIAL_PASSWORD: {
                MOBILE: 'freetrial-password.mobile',
                EMAIL: 'freetrial-password.email'
            },
            LOGIN_SUCCESS:{
                MOBILE:'login-success.mobile',
                EMAIL:'login-success.email'
            },
            Invoice_Generated:{
                MOBILE:'invoice-generated.mobile',
                EMAIL:'invoice-generated.email'
            },
            Invoice_Acceptance:{
                MOBILE:'invoice-acceptance.mobile',
                EMAIL:'invoice-acceptance.email'
            },
            Invoice_Payment:{
                MOBILE:'invoice-payment.mobile',
                EMAIL:'invoice-payment.email'
            },
            Invoice_IDAR:{
                MOBILE:'invoice-IDAR.mobile',
                EMAIL:'invoice-IDAR.email'
            }
        }
    },

    OTP: {
        REQUEST_TYPES: {
            REGISTRATION: 'registration',
            FORGOT_PASSWORD: 'password',
            CHANGE_MOBILE: 'update-mobile',
            CHANGE_MOBILE_CONFIRMATION: 'update-mobile-confirm',
            DEVICE_VERIFICATION: 'device-verification',
            SHOPPING_COD: 'shop-cod',
            FREETRIAL_PASSWORD: "freetrial-password"
        }
    },

    URLs: {
        AUTH: 'http://auth.apptrack.in',
        PAYMENT: 'http://payment.apptrack.in/'
    },

    END_POINTS: {
        EMAIL: "send",
        EmailWithGmail: "sendEmailWithGmail"
    },

    SEND_EMAIL_ON_HOW_MANY_REMAINING_SEARCHES: 10,
};