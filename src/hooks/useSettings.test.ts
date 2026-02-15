import { renderHook, act } from '@testing-library/react';
import { useSettings } from './useSettings';
import type { GameSettings } from '../types/musical';

const initialSettings: GameSettings = {
  clef: 'treble',
  maxLedgerLines: 1,
  onlyLedgerLines: false,
  timeLimitEnabled: false,
  timeLimitSeconds: 10,
};

describe('useSettings', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with provided settings and open by default', () => {
    const { result } = renderHook(() => useSettings(initialSettings));
    expect(result.current.settings).toEqual(initialSettings);
    expect(result.current.isSettingsOpen).toBe(true);
  });

  it('should load settings from localStorage if they exist', () => {
    const savedSettings = { ...initialSettings, maxLedgerLines: 3 };
    localStorage.setItem('ledger_settings', JSON.stringify(savedSettings));

    const { result } = renderHook(() => useSettings(initialSettings));
    expect(result.current.settings.maxLedgerLines).toBe(3);
  });

  it('should fall back to initial settings if localStorage is invalid', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem('ledger_settings', 'invalid-json');

    const { result } = renderHook(() => useSettings(initialSettings));
    expect(result.current.settings).toEqual(initialSettings);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should save settings to localStorage when updated', () => {
    const { result } = renderHook(() => useSettings(initialSettings));
    act(() => {
      result.current.updateSettings({ maxLedgerLines: 2 });
    });
    
    const saved = JSON.parse(localStorage.getItem('ledger_settings') || '{}');
    expect(saved.maxLedgerLines).toBe(2);
  });

  it('should update settings', () => {
    const { result } = renderHook(() => useSettings(initialSettings));
    act(() => {
      result.current.updateSettings({ maxLedgerLines: 2 });
    });
    expect(result.current.settings.maxLedgerLines).toBe(2);
    expect(result.current.settings.clef).toBe('treble');
  });

  it('should close and open settings', () => {
    const { result } = renderHook(() => useSettings(initialSettings));
    act(() => {
      result.current.closeSettings();
    });
    expect(result.current.isSettingsOpen).toBe(false);
    act(() => {
      result.current.openSettings();
    });
    expect(result.current.isSettingsOpen).toBe(true);
  });
});
