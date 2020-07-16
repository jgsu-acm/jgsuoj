import nodemailer from 'nodemailer';
import { SendMailError } from '../error';

// eslint-disable-next-line import/prefer-default-export
export async function sendMail(to: string, subject: string, text: string, html: string) {
    let t: unknown;
    try {
        const { system } = global.Hydro.model;
        const [host, port, secure, user, pass, from] = await Promise.all([
            system.get('smtp.host'),
            system.get('smtp.port'),
            system.get('smtp.secure'),
            system.get('smtp.user'),
            system.get('smtp.pass'),
            system.get('smtp.from'),
        ]);
        const transporter = nodemailer.createTransport({
            host, port, secure, auth: { user, pass },
        });
        t = await new Promise((resolve, reject) => {
            transporter.sendMail({
                from,
                to,
                subject,
                text,
                html,
            }, (err, info) => {
                if (err) reject(err);
                else resolve(info);
            });
        });
    } catch (e) {
        throw new SendMailError(to);
    }
    return t;
}

global.Hydro.lib.mail = {
    sendMail,
};