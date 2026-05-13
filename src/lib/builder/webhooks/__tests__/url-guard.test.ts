import { describe, expect, it } from 'vitest';
import { reasonUrlUnsafe } from '../url-guard';

describe('reasonUrlUnsafe', () => {
  // Allowed: external public hostnames
  it.each([
    'https://hooks.example.com/path',
    'https://api.example.com:8443/webhook',
    'http://customer-domain.io/x',
    'https://1.1.1.1/dns', // public DNS resolver IP
    'https://8.8.8.8/path',
    'https://[2001:db8::1]/path', // documentation range — not in our deny list
  ])('allows %s', (url) => {
    expect(reasonUrlUnsafe(url)).toBeNull();
  });

  it('rejects invalid URL', () => {
    expect(reasonUrlUnsafe('not a url')).toBe('invalid_url');
    expect(reasonUrlUnsafe('')).toBe('invalid_url');
  });

  it.each([
    ['file:///etc/passwd', 'protocol_not_allowed'],
    ['gopher://internal:70/', 'protocol_not_allowed'],
    ['data:text/plain,hi', 'protocol_not_allowed'],
    ['ftp://example.com', 'protocol_not_allowed'],
    ['javascript:alert(1)', 'protocol_not_allowed'],
  ])('rejects non-http protocol %s', (url, reason) => {
    expect(reasonUrlUnsafe(url)).toBe(reason);
  });

  it.each([
    'http://localhost/x',
    'http://LOCALHOST:3000/',
    'http://service.localhost/',
    'http://0.0.0.0/',
    'http://0/',
  ])('rejects loopback / wildcard host %s', (url) => {
    expect(reasonUrlUnsafe(url)).toMatch(/loopback|wildcard|private/);
  });

  it.each([
    '127.0.0.1',
    '127.255.255.254',
    '0.0.0.1',
    '10.0.0.1',
    '10.255.255.255',
    '100.64.0.1', // CGNAT
    '100.127.255.255',
    '169.254.169.254', // AWS/GCP IMDS — the dangerous one
    '169.254.1.1',
    '172.16.0.1',
    '172.31.255.255',
    '192.168.0.1',
    '192.168.255.255',
    '198.18.0.1', // benchmarking
    '224.0.0.1', // multicast
    '255.255.255.255', // broadcast
  ])('rejects private/loopback IPv4 %s', (ip) => {
    expect(reasonUrlUnsafe(`http://${ip}/`)).toBe('private_ipv4');
  });

  it.each([
    '11.0.0.1',
    '172.15.0.1', // just outside 172.16-31
    '172.32.0.1',
    '192.169.0.1',
  ])('allows non-private IPv4 lookalikes %s', (ip) => {
    expect(reasonUrlUnsafe(`http://${ip}/`)).toBeNull();
  });

  it.each([
    '[::1]',
    '[::]',
    '[fe80::1]',
    '[fd12:3456:789a::1]',
    '[fc00::1]',
  ])('rejects loopback/link-local/ULA/wildcard IPv6 %s', (ip) => {
    expect(reasonUrlUnsafe(`http://${ip}/`)).toMatch(/private_ipv6|loopback|wildcard/);
  });

  it('rejects IPv4-mapped IPv6 that points to private v4', () => {
    expect(reasonUrlUnsafe('http://[::ffff:127.0.0.1]/')).toBe('private_ipv6');
    expect(reasonUrlUnsafe('http://[::ffff:169.254.169.254]/')).toBe('private_ipv6');
    expect(reasonUrlUnsafe('http://[::ffff:10.0.0.1]/')).toBe('private_ipv6');
  });

  it('allows public IPv4-mapped IPv6', () => {
    expect(reasonUrlUnsafe('http://[::ffff:1.1.1.1]/')).toBeNull();
  });
});
