import {TicketMailer} from '../index';


async function run(): Promise<void> {
    const apiKey = String(process.env.MAILGUN_API_KEY);
    const domain = String(process.env.SEND_DOMAIN);
    const renderDirectory = String(process.env.RENDER_DIRECTORY);
    const subject = 'Test email';
    const from = 't.timmerman@iffr.com';
    const to = 'tom@ticketengine.nl';
    // const token = '1';
    const emailTemplatePath = '/Users/tomtimmerman/Sources/iffr/iffr-ticket-mailer/template/mail-tiff-drinks.html';
    const attachmentTemplatePath = '/Users/tomtimmerman/Sources/iffr/iffr-ticket-mailer/template/eticket-tiff-drinks.html';
    const templateData = {
        firstName: 'Tom',
        lastName: 'Timmerman'
    };
    const attachments = [
        {templateFilePath: attachmentTemplatePath, token: '1', data: {firstName: 'Tom'}},
        {templateFilePath: attachmentTemplatePath, token: '2', data: {firstName: 'Tony'}}
    ];

    const ticketMailer = new TicketMailer(apiKey, domain, renderDirectory);
    // await ticketMailer.send(subject, from, to, token, emailTemplatePath, attachmentTemplatePath, templateData);
    await ticketMailer.send(subject, from, to, emailTemplatePath, templateData, attachments);
}

run();