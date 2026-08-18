import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolveSiweDomain, siweDomainMatches } from './siweDomain';

test('resolveSiweDomain prefers a configured public host over Host', () => {
  assert.equal(
    resolveSiweDomain({
      configured: 'app.example.com',
      host: 'localhost:3000',
    }),
    'app.example.com'
  );
});

test('resolveSiweDomain falls back to Host when config is empty', () => {
  assert.equal(
    resolveSiweDomain({ configured: '  ', host: 'app.example.com' }),
    'app.example.com'
  );
});

test('resolveSiweDomain fails closed when neither Host nor config is set', () => {
  assert.equal(resolveSiweDomain({}), undefined);
});

test('siweDomainMatches accepts an exact host bind', () => {
  assert.equal(siweDomainMatches('app.example.com', 'app.example.com'), true);
});

test('siweDomainMatches rejects a phishing-domain replay', () => {
  assert.equal(siweDomainMatches('evil.example', 'app.example.com'), false);
});

test('siweDomainMatches fails closed on a missing message domain', () => {
  assert.equal(siweDomainMatches(undefined, 'app.example.com'), false);
});

test('siweDomainMatches fails closed on a missing expected domain', () => {
  assert.equal(siweDomainMatches('app.example.com', undefined), false);
});
