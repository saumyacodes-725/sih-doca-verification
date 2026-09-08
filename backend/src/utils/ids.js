import { createHash } from 'node:crypto';

export async function nextId(Model, prefix, pad = 3) {
  const count = await Model.countDocuments();
  return `${prefix}-${String(count + 1).padStart(pad, '0')}`;
}

export function digitalHashOf(payload) {
  const digest = createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  return `SHA256:${digest}`;
}
