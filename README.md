# IFFR Ticket Mailer
A small node.js library for sending an email with an e-ticket attachment via [Mailgun](https://www.mailgun.com/).

# Installation
Installing using npm:
```
npm i iffr-ticket-mailer
```

# Usage

```javascript
const ticketMailer = new TicketMailer('my-mailgun-api-key', 'my-domain.com', 'path/to/render/directory/');
ticketMailer.send('path/to/e-ticket/template', 'path/to/email/template', 'email subject', 'SenderName <sender@my-domain.com>', 'recipient@email.com', 'myQrCode', {});
```

# Templates
The [Handlebars](https://handlebarsjs.com/) template engine is used for rendering the attachment and email template. The data property that is passed to the send function will be available in the templates.

For display purposes the rendered QR code will be added to the template data on the property ```___QRCode```. This contains a Data URI representation of the QR Code image. In the attachment template this can be used like ```<img src="{{___QRCode}}" width="150" height="150">```.

# API
## constructor(apiKey, domain, renderDir)
Property | Type | Description
--- | --- | ---
apiKey | string | Mailgun api key.
domain | string | Mailgun domain.
renderDir | string | Path to the directory where attachment pdf's will be rendered to. 


## .send(subject, from, to, emailTemplatePath, emailTemplateData, attachments)
Send e-ticket by email.

Property | Type | Description
--- | --- | ---
subject | string | Subject line of the email.
from | string | Sender email address.
to | string | Recipient email address.
emailTemplatePath | string | Path to the email handlebars template.
emailTemplateData | string | Template data that will be passed to the email template on render.
attachments | string | Collection of attachments that will be send with the email. See description below.

### Attachments
Property | Type | Description
--- | --- | ---
templateFilePath | string | Path to the attachment handlebars template.
token | string | QR code that will be rendered on the ticket.
data | object | Template data that will be passed to the email and attachment template on render.



