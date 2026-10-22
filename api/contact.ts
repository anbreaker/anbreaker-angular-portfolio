import type { VercelRequest, VercelResponse } from '@vercel/node';

import { Resend } from 'resend';

const resend = new Resend(process.env['RESEND_API_KEY']);
const TO = process.env['CONTACT_TO_EMAIL'] ?? '';
const FROM = 'fj@mail.rootdevs.es';

/** The form in `src/app/features/contact` keeps the same limits, so it never sends what is refused here. */
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PROJECT_TYPES = ['collaboration', 'consulting', 'other'];

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    email,
    message,
    name,
    projectType,
    website = '',
  } = (req.body ?? {}) as Record<string, unknown>;

  if (
    typeof email !== 'string' ||
    typeof message !== 'string' ||
    typeof name !== 'string' ||
    typeof website !== 'string'
  ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const input = { email: email.trim(), message: message.trim(), name: oneLine(name) };

  if (
    !input.name ||
    input.name.length > MAX_NAME_LENGTH ||
    !input.message ||
    input.message.length > MAX_MESSAGE_LENGTH
  ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (input.email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(input.email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  // A field people never see: only bots fill it in. They get the same answer as a person,
  // so they have no reason to try again another way.
  if (website !== '') {
    return res.status(200).json({ ok: true });
  }

  const type =
    typeof projectType === 'string' && PROJECT_TYPES.includes(projectType) ? projectType : 'other';

  try {
    await resend.emails.send({
      from: `Portfolio Contact <${FROM}>`,
      to: TO,
      replyTo: input.email,
      subject: `[Portfolio] ${type} — ${input.name}`,
      html: `
        <div style="font-family: 'JetBrains Mono', monospace; background: #0a0a0b; color: #f4f4f5; padding: 40px; border-radius: 8px; max-width: 600px;">
          <p style="color: #22d3ee; font-size: 12px; letter-spacing: 0.2em; margin: 0 0 24px; text-transform: uppercase;">
            Nuevo mensaje desde el portfolio
          </p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="color: #52525b; font-size: 11px; letter-spacing: 0.15em; padding: 12px 0; border-bottom: 1px solid #27272a; text-transform: uppercase; width: 120px;">NOMBRE</td>
              <td style="color: #f4f4f5; padding: 12px 0; border-bottom: 1px solid #27272a;">${escapeHtml(input.name)}</td>
            </tr>
            <tr>
              <td style="color: #52525b; font-size: 11px; letter-spacing: 0.15em; padding: 12px 0; border-bottom: 1px solid #27272a; text-transform: uppercase;">EMAIL</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #27272a;"><a href="mailto:${escapeHtml(input.email)}" style="color: #22d3ee;">${escapeHtml(input.email)}</a></td>
            </tr>
            <tr>
              <td style="color: #52525b; font-size: 11px; letter-spacing: 0.15em; padding: 12px 0; border-bottom: 1px solid #27272a; text-transform: uppercase;">TIPO</td>
              <td style="color: #f4f4f5; padding: 12px 0; border-bottom: 1px solid #27272a;">${escapeHtml(type)}</td>
            </tr>
          </table>
          <div style="margin-top: 24px;">
            <p style="color: #52525b; font-size: 11px; letter-spacing: 0.15em; margin: 0 0 12px; text-transform: uppercase;">MENSAJE</p>
            <p style="color: #f4f4f5; line-height: 1.7; margin: 0; white-space: pre-wrap;">${escapeHtml(input.message)}</p>
          </div>
          <p style="color: #27272a; font-size: 11px; margin: 32px 0 0;">
            ~/contacto ❯ reply --to ${escapeHtml(input.email)}
          </p>
        </div>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ error: 'Failed to send email' });
  }
}

/** Line breaks and runs of spaces become single spaces, so the subject stays one line. */
function oneLine(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
