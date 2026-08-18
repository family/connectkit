export function resolveSiweDomain(opts: {
  configured?: string;
  host?: string | string[];
}): string | undefined {
  const configured =
    typeof opts.configured === 'string' ? opts.configured.trim() : '';
  if (configured) return configured;
  if (typeof opts.host === 'string' && opts.host.length > 0) return opts.host;
  return undefined;
}

export function siweDomainMatches(
  messageDomain: string | undefined,
  expectedDomain: string | undefined
): boolean {
  if (!expectedDomain || !messageDomain) return false;
  return messageDomain === expectedDomain;
}
