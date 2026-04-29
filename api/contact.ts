import type { VercelRequest, VercelResponse } from '@vercel/node';

import { Resend } from 'resend';

const resend = new Resend(process.env['RESEND_API_KEY']);
const TO = process.env['CONTACT_TO_EMAIL'] ?? '';
const FROM = 'hola@mail.rootdevs.es';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<VercelResponse> {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, message, name, projectType } = req.body as {
    email?: string;
    message?: string;
    name?: string;
    projectType?: string;
  };

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  try {
    await resend.emails.send({
      from: `Portfolio Contact <${FROM}>`,
      to: TO,
      replyTo: email,
      subject: `[Portfolio] ${projectType ?? 'Contacto'} — ${name}`,
      html: `
        <div style="font-family: 'JetBrains Mono', monospace; background: #0a0a0b; color: #f4f4f5; padding: 40px; border-radius: 8px; max-width: 600px;">
          <p style="color: #22d3ee; font-size: 12px; letter-spacing: 0.2em; margin: 0 0 24px; text-transform: uppercase;">
            Nuevo mensaje desde el portfolio
          </p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="color: #52525b; font-size: 11px; letter-spacing: 0.15em; padding: 12px 0; border-bottom: 1px solid #27272a; text-transform: uppercase; width: 120px;">NOMBRE</td>
              <td style="color: #f4f4f5; padding: 12px 0; border-bottom: 1px solid #27272a;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="color: #52525b; font-size: 11px; letter-spacing: 0.15em; padding: 12px 0; border-bottom: 1px solid #27272a; text-transform: uppercase;">EMAIL</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #27272a;"><a href="mailto:${escapeHtml(email)}" style="color: #22d3ee;">${escapeHtml(email)}</a></td>
            </tr>
            <tr>
              <td style="color: #52525b; font-size: 11px; letter-spacing: 0.15em; padding: 12px 0; border-bottom: 1px solid #27272a; text-transform: uppercase;">TIPO</td>
              <td style="color: #f4f4f5; padding: 12px 0; border-bottom: 1px solid #27272a;">${escapeHtml(projectType ?? '—')}</td>
            </tr>
          </table>
          <div style="margin-top: 24px;">
            <p style="color: #52525b; font-size: 11px; letter-spacing: 0.15em; margin: 0 0 12px; text-transform: uppercase;">MENSAJE</p>
            <p style="color: #f4f4f5; line-height: 1.7; margin: 0; white-space: pre-wrap;">${escapeHtml(message)}</p>
          </div>
          <p style="color: #27272a; font-size: 11px; margin: 32px 0 0;">
            ~/contacto ❯ reply --to ${escapeHtml(email)}
          </p>
        </div>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ error: 'Failed to send email' });
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
