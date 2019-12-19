import * as mg from 'mailgun-js';
import {Mailgun} from "mailgun-js";
import {RenderedAttachment} from "./Attachment";
import * as fs from "fs";

export default class MailgunConnector {

    //
    private mailgun: Mailgun;

    constructor(apiKey:string, domain: string) {
        this.mailgun = mg({apiKey, domain});
    }


    // public async sendMail(to: string, from: string, subject: string, html: string, attachmentPath: string) {
    public async sendMail(to: string, from: string, subject: string, html: string, attachments: Array<RenderedAttachment>) {
        return new Promise((resolve, reject) => {
            const data = {
                from: from,
                to: to,
                subject: subject,
                html: html,
                attachment: attachments.map((attachment: RenderedAttachment) => {
                    return new this.mailgun.Attachment({data: fs.readFileSync(attachment.filePath), filename: attachment.fileName});
                })
            };

            // console.log(`Send email ${JSON.stringify(data)}`);
            this.mailgun.messages().send(data,function (error, body) {
                if(error) {
                    reject(error)
                }
                // console.log(`Queued email ${JSON.stringify(body)}`);
                resolve();
            });
        });
    }

}