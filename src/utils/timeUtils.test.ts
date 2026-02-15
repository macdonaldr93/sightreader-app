import { describe, it, expect } from 'vitest';
import { formatDuration } from './timeUtils';

describe('formatDuration', () => {
  it('formats seconds correctly', () => {
    expect(formatDuration(45)).toBe('45s');
  });

  it('formats minutes correctly', () => {
    expect(formatDuration(60)).toBe('1m 0s');
    expect(formatDuration(90)).toBe('1m 30s');
    expect(formatDuration(3599)).toBe('59m 59s');
  });

  it('formats hours correctly', () => {
    expect(formatDuration(3600)).toBe('1h 0m');
    expect(formatDuration(3660)).toBe('1h 1m');
    expect(formatDuration(86399)).toBe('23h 59m');
  });

  it('formats days correctly', () => {
    expect(formatDuration(86400)).toBe('1d 0h');
    expect(formatDuration(90000)).toBe('1d 1h');
    expect(formatDuration(172800)).toBe('2d 0h');
  });
});
