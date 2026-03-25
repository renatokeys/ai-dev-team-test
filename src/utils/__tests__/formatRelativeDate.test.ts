import { describe, it, expect, vi, afterEach } from 'vitest';
import { formatRelativeDate } from '../formatRelativeDate';

describe('formatRelativeDate', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "just now" for dates less than a minute ago', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-15T12:00:30Z'));
    expect(formatRelativeDate('2026-01-15T12:00:00Z')).toBe('just now');
  });

  it('returns minutes ago for dates less than an hour ago', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-15T12:05:00Z'));
    expect(formatRelativeDate('2026-01-15T12:00:00Z')).toBe('5m ago');
  });

  it('returns hours ago for dates less than a day ago', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-15T15:00:00Z'));
    expect(formatRelativeDate('2026-01-15T12:00:00Z')).toBe('3h ago');
  });

  it('returns days ago for dates less than 30 days ago', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-20T12:00:00Z'));
    expect(formatRelativeDate('2026-01-15T12:00:00Z')).toBe('5d ago');
  });

  it('returns formatted date for dates older than 30 days', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-15T12:00:00Z'));
    const result = formatRelativeDate('2026-01-15T12:00:00Z');
    expect(result).toMatch(/1\/15\/2026|15\/1\/2026|2026/);
  });
});
