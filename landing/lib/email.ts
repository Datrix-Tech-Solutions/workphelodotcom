import nodemailer from 'nodemailer';

function requiredEnv(name: string) {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing required email environment variable: ${name}`);
    }

    return value;
}

function escapeHtml(value?: string) {
    return (value || '-')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export async function sendWaitlistNotification(payload: {
    fullName: string;
    email: string;
    phone?: string;
    company?: string;
    module?: string;
}) {
    try {
        const transport = nodemailer.createTransport({
            host: requiredEnv('SMTP_HOST'),
            port: Number(process.env.SMTP_PORT || 587),
            secure: (process.env.SMTP_SECURE || 'false') === 'true',
            auth: {
                user: requiredEnv('SMTP_USER'),
                pass: requiredEnv('SMTP_PASS'),
            },
        });

        await transport.sendMail({
            from: requiredEnv('SMTP_FROM'),
            to: requiredEnv('WAITLIST_TO_EMAIL'),
            subject: 'New waitlist signup from Workphelo',
            html: `
        <h2>New Waitlist Signup</h2>
        <p><strong>Name:</strong> ${escapeHtml(payload.fullName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(payload.phone)}</p>
        <p><strong>Company:</strong> ${escapeHtml(payload.company)}</p>
        <p><strong>Module:</strong> ${escapeHtml(payload.module)}</p>
      `,
        });

        return true;
    } catch (error) {
        console.error('Failed to send waitlist notification email:', error);
        return false;
    }
}
