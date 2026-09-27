import test from 'node:test';
import assert from 'node:assert/strict';
import { applyBillingEvent, canUse, newAccount } from '../src/index.js';

test('checkout activates a paid plan', () => {
  const account = applyBillingEvent(newAccount('acct_1'), { type: 'checkout.completed', plan: 'pro' });
  assert.equal(account.plan, 'pro');
  assert.equal(account.subscriptionStatus, 'active');
});

test('cancellation falls back to free', () => {
  let account = applyBillingEvent(newAccount('acct_1'), { type: 'checkout.completed', plan: 'team' });
  account = applyBillingEvent(account, { type: 'subscription.deleted' });
  assert.equal(account.plan, 'free');
});

test('usage is checked against plan entitlements', () => {
  const account = newAccount('acct_1');
  account.usage.projects = 2;
  assert.equal(canUse(account, 'projects', 1), false);
});
