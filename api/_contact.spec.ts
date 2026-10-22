import type { VercelRequest, VercelResponse } from '@vercel/node';

import handler from './contact';

import { beforeEach, describe, expect, it, vi } from 'vitest';

const { send } = vi.hoisted(() => ({ send: vi.fn() }));

vi.mock('resend', () => ({
  Resend: class {
    emails = { send };
  },
}));

interface FakeResponse {
  body: unknown;
  statusCode: number;
}

const call = async (body: unknown, method = 'POST'): Promise<FakeResponse> => {
  const result: FakeResponse = { body: undefined, statusCode: 0 };
  const res = {
    json(payload: unknown) {
      result.body = payload;
      return this;
    },
    status(code: number) {
      result.statusCode = code;
      return this;
    },
  };

  await handler({ body, method } as VercelRequest, res as unknown as VercelResponse);

  return result;
};

const valid = {
  email: 'ana@example.com',
  message: 'Hola, ¿hablamos?',
  name: 'Ana',
  projectType: 'consulting',
};

describe('POST /api/contact', () => {
  beforeEach(() => {
    send.mockReset();
    send.mockResolvedValue({ data: { id: '1' }, error: null });
  });

  it('sends a valid message', async () => {
    const res = await call(valid);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ ok: true });
    expect(send).toHaveBeenCalledTimes(1);
    expect(send.mock.calls[0][0]).toMatchObject({
      replyTo: 'ana@example.com',
      subject: '[Portfolio] consulting — Ana',
    });
  });

  it('rejects methods other than POST', async () => {
    const res = await call(valid, 'GET');

    expect(res.statusCode).toBe(405);
    expect(send).not.toHaveBeenCalled();
  });

  it('rejects missing fields and an invalid email', async () => {
    expect((await call({ ...valid, name: '  ' })).statusCode).toBe(400);
    expect((await call({ ...valid, email: 'not-an-email' })).statusCode).toBe(400);
    expect((await call({ ...valid, message: undefined })).statusCode).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it('answers a filled honeypot like a success but sends nothing', async () => {
    const res = await call({ ...valid, website: 'https://spam.example' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ ok: true });
    expect(send).not.toHaveBeenCalled();
  });

  it('rejects fields longer than the form allows', async () => {
    expect((await call({ ...valid, name: 'a'.repeat(101) })).statusCode).toBe(400);
    expect((await call({ ...valid, email: `${'a'.repeat(250)}@x.es` })).statusCode).toBe(400);
    expect((await call({ ...valid, message: 'a'.repeat(5001) })).statusCode).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it('accepts fields at the limit', async () => {
    const res = await call({ ...valid, message: 'a'.repeat(5000), name: 'a'.repeat(100) });

    expect(res.statusCode).toBe(200);
  });

  it('rejects fields that are not strings', async () => {
    expect((await call({ ...valid, name: ['Ana'] })).statusCode).toBe(400);
    expect((await call({ ...valid, website: 1 })).statusCode).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it('keeps the subject on one line and the project type to the known ones', async () => {
    await call({ ...valid, name: 'Ana\r\nBcc: x@evil.com', projectType: 'x\nInjected' });

    expect(send.mock.calls[0][0].subject).toBe('[Portfolio] other — Ana Bcc: x@evil.com');
  });

  it('answers 500 when the email provider fails', async () => {
    send.mockRejectedValue(new Error('down'));

    expect((await call(valid)).statusCode).toBe(500);
  });
});
