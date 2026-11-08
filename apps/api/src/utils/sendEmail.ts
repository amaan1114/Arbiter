import nodemailer, { type Transporter } from "nodemailer";
import { config } from "./config";

const getTransporter = (): Transporter => {
    const requiredConfig = {
        SMTP_HOST: config.SMTP_HOST,
        SMTP_USER: config.SMTP_USER,
        SMTP_PASSWORD: config.SMTP_PASSWORD,
        SMTP_FROM_EMAIL: config.SMTP_FROM_EMAIL,
    };

    const missingConfig = Object.entries(requiredConfig)
        .filter(([, value]) => !value)
        .map(([key]) => key);

    if (missingConfig.length > 0) {
        throw new Error(`Missing email configuration: ${missingConfig.join(", ")}`);
    }

    return nodemailer.createTransport({
        host: config.SMTP_HOST,
        port: Number(config.SMTP_PORT),
        secure: config.SMTP_SECURE,
        auth: {
            user: config.SMTP_USER,
            pass: config.SMTP_PASSWORD,
        },
    });
};

export const sendEmail = async (
    email: string,
    verificationToken: string,
): Promise<void> => {
    const verificationUrl = new URL("/verify-email", config.CLIENT_URL);
    verificationUrl.searchParams.set("token", verificationToken);

    await getTransporter().sendMail({
        from: config.SMTP_FROM_EMAIL,
        to: email,
        subject: "Verify your Arbiter account",
        text: `Verify your email address by visiting: ${verificationUrl.toString()}`,
        html: `
            <p>Verify your email address by clicking the link below:</p>
            <p>
                <a
                    href="${verificationUrl.toString()}"
                    role="button"
                    style="display:inline-block;padding:12px 24px;background-color:#2563eb;color:#ffffff;text-decoration:none;border-radius:6px;"
                >
                    Verify your email address
                </a>
            </p>
        `,
    });
};