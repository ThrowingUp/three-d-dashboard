'use client';

import { useEffect } from 'react';

/**
 * Global keyboard shortcuts for Three.js toolkit
 */
export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      const { key, ctrlKey, metaKey } = event;
      const isModifierPressed = ctrlKey || metaKey;

      switch (key.toLowerCase()) {
        case 'h':
          if (!isModifierPressed) {
            event.preventDefault();
            window.dispatchEvent(new CustomEvent('toggleHUD'));
          }
          break;
          
        case 'w':
          if (!isModifierPressed) {
            event.preventDefault();
            window.dispatchEvent(new CustomEvent('toggleWireframe'));
          }
          break;
          
        case 'r':
          if (!isModifierPressed) {
            event.preventDefault();
            window.dispatchEvent(new CustomEvent('resetScene'));
          }
          break;
          
        case 's':
          if (!isModifierPressed) {
            event.preventDefault();
            window.dispatchEvent(new CustomEvent('takeScreenshot'));
          }
          break;
          
        case 'g':
          if (!isModifierPressed) {
            event.preventDefault();
            window.dispatchEvent(new CustomEvent('toggleGrid'));
          }
          break;
          
        case 'x':
          if (!isModifierPressed) {
            event.preventDefault();
            window.dispatchEvent(new CustomEvent('toggleAxes'));
          }
          break;
          
        case 'e':
          if (isModifierPressed) {
            event.preventDefault();
            window.dispatchEvent(new CustomEvent('exportData'));
          }
          break;
          
        case 'd':
          if (isModifierPressed) {
            event.preventDefault();
            window.dispatchEvent(new CustomEvent('toggleDataDashboard'));
          }
          break;
          
        case 't':
          if (!isModifierPressed) {
            event.preventDefault();
            window.dispatchEvent(new CustomEvent('stressTest'));
          }
          break;
          
        case '1':
          if (!isModifierPressed) {
            event.preventDefault();
            window.dispatchEvent(new CustomEvent('presetChange', { detail: { preset: 'basic' } }));
          }
          break;
          
        case '2':
          if (!isModifierPressed) {
            event.preventDefault();
            window.dispatchEvent(new CustomEvent('presetChange', { detail: { preset: 'advanced' } }));
          }
          break;
          
        case '3':
          if (!isModifierPressed) {
            event.preventDefault();
            window.dispatchEvent(new CustomEvent('presetChange', { detail: { preset: 'debug' } }));
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
}

/**
 * Display keyboard shortcuts help
 */
export const KEYBOARD_SHORTCUTS = {
  'H': 'Toggle HUD',
  'W': 'Toggle Wireframe',
  'R': 'Reset Scene',
  'S': 'Take Screenshot',
  'G': 'Toggle Grid',
  'X': 'Toggle Axes',
  'T': 'Stress Test',
  'Ctrl+E': 'Export Data',
  'Ctrl+D': 'Data Dashboard',
  '1': 'Basic Preset',
  '2': 'Advanced Preset',
  '3': 'Debug Preset'
};
