export const PLANS = {
  free: { seats: 1, projects: 2, apiCalls: 1000 },
  pro: { seats: 5, projects: 25, apiCalls: 50000 },
  team: { seats: 25, projects: Infinity, apiCalls: 500000 }
};

export function entitlement(plan, key) {
  if (!PLANS[plan]) throw new Error(`Unknown plan: ${plan}`);
  return PLANS[plan][key];
}

export function canUse({ plan, usage }, feature, amount = 1) {
  const limit = entitlement(plan, feature);
  const used = usage?.[feature] ?? 0;
  return limit === Infinity || used + amount <= limit;
}

export function newAccount(id) {
  return {
    id,
    plan: 'free',
    subscriptionStatus: 'none',
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
    usage: { seats: 1, projects: 0, apiCalls: 0 },
    eventLog: []
  };
}

export function applyBillingEvent(account, event) {
  const next = structuredClone(account);
  const log = data => next.eventLog.push({ type: event.type, at: event.createdAt ?? new Date().toISOString(), ...data });

  switch (event.type) {
    case 'checkout.completed':
      if (!PLANS[event.plan]) throw new Error('Invalid checkout plan');
      next.plan = event.plan;
      next.subscriptionStatus = 'active';
      next.currentPeriodEnd = event.currentPeriodEnd ?? null;
      next.cancelAtPeriodEnd = false;
      log({ plan: event.plan });
      break;
    case 'subscription.updated':
      if (event.plan && PLANS[event.plan]) next.plan = event.plan;
      if (event.status) next.subscriptionStatus = event.status;
      if ('cancelAtPeriodEnd' in event) next.cancelAtPeriodEnd = Boolean(event.cancelAtPeriodEnd);
      if (event.currentPeriodEnd) next.currentPeriodEnd = event.currentPeriodEnd;
      log({ status: next.subscriptionStatus, plan: next.plan });
      break;
    case 'subscription.deleted':
      next.plan = 'free';
      next.subscriptionStatus = 'canceled';
      next.currentPeriodEnd = null;
      next.cancelAtPeriodEnd = false;
      log({ plan: 'free' });
      break;
    case 'invoice.payment_failed':
      next.subscriptionStatus = 'past_due';
      log({ status: 'past_due' });
      break;
    case 'invoice.paid':
      if (next.plan !== 'free') next.subscriptionStatus = 'active';
      log({ status: next.subscriptionStatus });
      break;
    default:
      log({ ignored: true });
  }
  return next;
}

export function usagePercent(account, feature) {
  const limit = entitlement(account.plan, feature);
  if (limit === Infinity) return 0;
  return Math.min(100, Math.round(((account.usage?.[feature] ?? 0) / limit) * 100));
}
