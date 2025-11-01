// Fix: Correct import path for types from the root directory.
import { ThemeName } from '../types.ts';

const themes: Record<ThemeName, Record<string, string>> = {
    dark: {
        '--color-background': '#121212',
        '--color-surface': '#1e1e1e',
        '--color-surface-dark': '#2c2c2c',
        '--color-border': '#333333',
        '--color-primary': '#bb86fc',
        '--color-primary-dark': '#a362fa',
        '--color-text-primary': '#ffffff',
        '--color-text-secondary': '#a0a0a0',
        '--color-income': '#03dac6',
        '--color-expense': '#cf6679',
    },
    light: {
        '--color-background': '#f5f5f5',
        '--color-surface': '#ffffff',
        '--color-surface-dark': '#eeeeee',
        '--color-border': '#e0e0e0',
        '--color-primary': '#6200ee',
        '--color-primary-dark': '#3700b3',
        '--color-text-primary': '#000000',
        '--color-text-secondary': '#5f6368',
        '--color-income': '#018786',
        '--color-expense': '#b00020',
    },
    synthwave: {
        '--color-background': '#2d2a55',
        '--color-surface': '#231f44',
        '--color-surface-dark': '#1a163a',
        '--color-border': '#3e3a6e',
        '--color-primary': '#ff7ac6',
        '--color-primary-dark': '#f92f9a',
        '--color-text-primary': '#ffffff',
        '--color-text-secondary': '#9e99d4',
        '--color-income': '#00f5d4',
        '--color-expense': '#f72585',
    }
};

export function applyTheme(themeName: ThemeName) {
    const theme = themes[themeName];
    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
        root.style.setProperty(key, value);
    });
}
