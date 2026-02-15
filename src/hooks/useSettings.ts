import { useState, useCallback, useEffect } from 'react';
import type { GameSettings } from '../types/musical';

const SETTINGS_KEY = 'sightreader_settings';

export function useSettings(initialSettings: GameSettings) {
  const [settings, setSettings] = useState<GameSettings>(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      try {
        return { ...initialSettings, ...JSON.parse(saved) };
      } catch (err) {
        console.error('Failed to parse saved settings', err);
      }
    }
    return initialSettings;
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const openSettings = useCallback(() => {
    setIsSettingsOpen(true);
  }, []);

  const closeSettings = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);

  return {
    settings,
    isSettingsOpen,
    updateSettings,
    openSettings,
    closeSettings,
  };
}
