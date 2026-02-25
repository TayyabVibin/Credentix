import { createHmac, createHash } from 'crypto';
import { WebhookProcessor } from '../webhook.processor';

describe('WebhookProcessor', () => {
  describe('HMAC verification', () => {
    const hmacKey =
      'a]1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1';
    const hexKey = Buffer.from(hmacKey, 'utf8').toString('hex');

    function computeValidHmac(payload: string, key: string): string {
      return createHmac('sha256', Buffer.from(key, 'hex'))
        .update(payload, 'utf8')
        .digest('base64');
    }

    it('should accept a valid HMAC signature', () => {
      const processor = createProcessorWithKey(hexKey);
      const payload = '{"test":"data"}';
      const signature = computeValidHmac(payload, hexKey);

      expect(processor.verifyHmac(payload, signature)).toBe(true);
    });

    it('should reject an invalid HMAC signature', () => {
      const processor = createProcessorWithKey(hexKey);
      const payload = '{"test":"data"}';

      expect(processor.verifyHmac(payload, 'invalid-signature')).toBe(false);
    });

    it('should reject if payload is tampered', () => {
      const processor = createProcessorWithKey(hexKey);
      const payload = '{"test":"data"}';
      const signature = computeValidHmac(payload, hexKey);

      expect(processor.verifyHmac('{"test":"tampered"}', signature)).toBe(
        false,
      );
    });

    it('should skip verification if no HMAC key configured', () => {
      const processor = createProcessorWithKey('');
      expect(processor.verifyHmac('any-payload', 'any-sig')).toBe(true);
    });
  });

  describe('idempotency hash', () => {
    it('same inputs produce same hash', () => {
      const processor = createProcessorWithKey('');
      const hash1 = processor.computeHash('PSP123', 'AUTHORISATION', 'true');
      const hash2 = processor.computeHash('PSP123', 'AUTHORISATION', 'true');
      expect(hash1).toBe(hash2);
    });

    it('different inputs produce different hashes', () => {
      const processor = createProcessorWithKey('');
      const hash1 = processor.computeHash('PSP123', 'AUTHORISATION', 'true');
      const hash2 = processor.computeHash('PSP456', 'AUTHORISATION', 'true');
      expect(hash1).not.toBe(hash2);
    });

    it('same psp but different event codes produce different hashes', () => {
      const processor = createProcessorWithKey('');
      const hash1 = processor.computeHash('PSP123', 'AUTHORISATION', 'true');
      const hash2 = processor.computeHash('PSP123', 'CAPTURE', 'true');
      expect(hash1).not.toBe(hash2);
    });

    it('same psp and event but different success produce different hashes', () => {
      const processor = createProcessorWithKey('');
      const hash1 = processor.computeHash('PSP123', 'AUTHORISATION', 'true');
      const hash2 = processor.computeHash('PSP123', 'AUTHORISATION', 'false');
      expect(hash1).not.toBe(hash2);
    });
  });
});

function createProcessorWithKey(hmacKey: string): WebhookProcessor {
  const mockConfig = {
    get: (key: string, defaultVal?: string) => {
      if (key === 'ADYEN_WEBHOOK_HMAC_KEY') return hmacKey;
      return defaultVal ?? '';
    },
  };

  const processor = Object.create(WebhookProcessor.prototype);
  processor.hmacKey = hmacKey;
  processor.logger = { warn: () => {}, log: () => {}, error: () => {} };
  return processor;
}
