import "server-only";
import nodemailer from "nodemailer";

export async function sendResetCode(to: string, code: string) {
  const smtpUrl = process.env.SMTP_URL;
  if (!smtpUrl) {
    if (process.env.NODE_ENV !== "production") {
      // Dev only: no SMTP configured → print the code to the server console.
      console.info(`[dev] código de recuperação para ${to}: ${code}`);
      return;
    }
    console.error("[mail] SMTP_URL não configurado: código de recuperação não enviado.");
    return;
  }
  const transporter = nodemailer.createTransport(smtpUrl);
  await transporter.sendMail({
    from: process.env.MAIL_FROM ?? "Rosa do Deserto <nao-responda@localhost>",
    to,
    subject: "Seu código de acesso — Rosa do Deserto",
    text: `Seu código para redefinir a senha da Área da loja é ${code}.\nEle vale por 15 minutos.\n\nSe não foi você, ignore este e-mail.`,
  });
}
