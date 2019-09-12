import * as fs from 'fs';
import {promisify} from 'util';
import MailgunConnector from "./MailgunConnector";
import * as QRCode from 'qrcode';
import * as pdf from 'html-pdf';
import * as handlebars from 'handlebars';
import {CreateOptions} from "html-pdf";


export class TicketMailer {

    private mailgunConnector: MailgunConnector;
    private renderDirectory: string;

    constructor(apiKey:string, domain: string, renderDirectory: string) {
        if(!apiKey) throw new Error('Missing Mailgun api key.');
        if(!domain) throw new Error('Missing Mailgun domain.');
        if(!renderDirectory) throw new Error('Missing render directory.');
        this.mailgunConnector = new MailgunConnector(apiKey, domain);
        this.renderDirectory = renderDirectory;
    }


    public async send(subject: string, from: string, to: string, token: string, emailTemplatePath: string, attachmentTemplatePath: string, templateData: object): Promise<null> {
        const attachmentPath = this.renderDirectory + '/e-ticket-' + token + '.pdf';
        templateData['___QRCode'] = await this._renderQrCode(String(token)); // render QR code
        await this._writePdf(attachmentTemplatePath, attachmentPath, templateData); // write attachment file
        await this._sendEmail(to, from, subject, templateData, emailTemplatePath, attachmentPath);
        return null;
    }


    private async _renderQrCode(code: string): Promise<any> {
        const qr = promisify(QRCode.toDataURL);
        return qr(code);
    }


    private async _renderTemplate(templatePath: string, data: object): Promise<string> {
        // console.log(`Render template ${templatePath}`);
        const source = fs.readFileSync(templatePath, {encoding: 'utf8'});
        const template = handlebars.compile(source);
        return template(data);
    }


    private async _writePdf(templatePath: string, outputPath: string, data: object): Promise<void> {
        const options: CreateOptions = { height: '1018', width: '720' };
        const html = await this._renderTemplate(templatePath, data);
        return new Promise<void>((resolve) => {
            // console.log(`Create attachment ${outputPath}`);
            pdf.create(html, options).toFile(outputPath, function(err: Error, res: any) {
                if (err) return console.error(err);
                // console.log(`Created attachment ${outputPath}: ${JSON.stringify(res)}`);
                resolve();
            });
        });
    }


    private async _sendEmail(to: string, from: string, subject: string, data: object, templatePath: string, attachmentPath: string) {
        const html = await this._renderTemplate(templatePath, data);
        return this.mailgunConnector.sendMail(to, from, subject, html, attachmentPath);
    }

}

