
const nodemailer =require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();


class SendEmail {
    // create transporter object with smtp server details
   
    send = async ({to:to,subject:subject,message:message,link:link,link_label:link_label}) => {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                 user: process.env.MAIL_USERNAME,
                 pass: process.env.MAIL_PASSWORD
                 }
              });

         // send email

        const send_mail=await transporter.sendMail({
            from: process.env.MAIL_USERNAME,
            to: to,
            subject: subject,
            html: this.template({message:message,to:to,subject:subject,link:link,link_label:link_label})
          });

        return send_mail?true:false;
    }

    template({message:message,to:to,subject:subject,link:link,link_label:link_label})
    {
        const template="<table width='100%' height='100%' cellpadding='0' cellspacing='0'\
        bgcolor='#f5f6f7'><tbody><tr><td height='50'></td></tr><tr>\
        <td align='center' valign='top'>\
        <table width='600' cellpadding='0' cellspacing='0' bgcolor='#ffffff' style='border:1px solid #f1f2f5'>\
                <tbody><tr>\
                    <td colspan='3' height='60' bgcolor='#ffffff' style='border-bottom:1px solid #eeeeee;padding-left:16px' align='left'>\
                        \
<!--<img src='' width='140' height='41' style='display:block;width:140px;height:41px' class='CToWUd'>\
                        \
                    </td>\
                </tr>\
                <tr><td colspan='3' height='20'></td></tr>\
                <tr>\
                    <td width='20'></td>\
                    <td align='left'>\
                    <table cellpadding='0' cellspacing='0' width='100%'>\
                            <tbody><tr>\
                                <td colspan='3' style='text-align:center'>\
                <span style='font-family:Helvetica,Arial,sans-serif;font-weight:bold;font-size:28px;line-height:28px;color:#333333'>"+subject+"</span></td>\
                              </tr>\
                              <tr><td colspan='3' height='20'></td></tr>\
                              <tr><td colspan='3' height='1' bgcolor='#eeeeee' style='font-size:1px;line-height:1px'>&nbsp;</td></tr>\
                            <tr><td colspan='3' height='20'></td></tr>\
                            <tr><td colspan='3'><p style='font-family:Helvetica,Arial,sans-serif;color:#494747;line-height:140%;text-align:center'>"+message+"</p>\
<table width='100%' style='width:100%!important'>\
    <tbody><tr>\
        <td align='center'>\
<a style='font-family:Helvetica,Arial,sans-serif;width:150px; \
text-align:center;padding:12px 0;background-color:#13aa52;border:1px solid #517b39; \
border-radius:8px;display:block;color:#ffffff;font-size:14px;font-weight:normal; \
text-decoration:none;letter-spacing:normal' href='"+link+"'>"+link_label+"</a>\
</td></tr></tbody></table>\
</td></tr>\
                            <tr><td colspan='3' height='20'></td></tr>\
                            <tr>\
                                <td colspan='3' style='text-align:center'>\
                                    <span style='font-family:Helvetica,Arial,sans-serif;font-size:12px;color:#cccccc'>This message was sent from ECODIER LTD to "+to+"</span>\
                                </td>\
                            </tr>\
                            </tbody></table>\
                    </td>\
                    <td width='20'></td>\
                </tr>\
                <tr><td colspan='3' height='20'></td></tr>\
            </tbody></table>\
        </td>\
    </tr>\
    <tr>\
        <td height='50'>\
            \
        </td>\
    </tr>\
</tbody></table>";
return template;
    }

   
}

module.exports = new SendEmail;