const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sendEmail = async (to, subject, html) => {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;
    sendSmtpEmail.sender = { "name": "PrepNerve", "email": process.env.EMAIL_USER }; // Must be the email you used to signup on Brevo
    sendSmtpEmail.to = [{ "email": to }];

    try {
        console.log(`📨 Sending email to: ${to} via Brevo...`);
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('✅ Email sent successfully. Message ID: ' + data.messageId);
        return true;
    } catch (error) {
        console.error('❌ Brevo Email Error:', error);
        return false;
    }
};

module.exports = { sendEmail };