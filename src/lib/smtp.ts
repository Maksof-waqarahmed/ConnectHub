import nodemailer from "nodemailer";
interface EmailProps {
    to: string;
    subject: string;
    template: any
}
export async function sendEmail({ subject, template, to }: EmailProps) {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })

        const mailOption = {
            from: "ConnectHub <no-reply@connecthub.com>",
            to,
            subject,
            html: template
        }

        await transporter.sendMail(mailOption)
        return true
    } catch (error) {
        return false;
    }
}