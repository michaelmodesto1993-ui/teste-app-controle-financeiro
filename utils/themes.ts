export const themes = {
  dark: {
    '--color-background': '#121212',
    '--color-surface': '#1e1e1e',
    '--color-surface-dark': '#2c2c2c',
    '--color-border': '#3a3a3a',
    '--color-text-primary': '#ffffff',
    '--color-text-secondary': '#a0a0a0',
    '--color-primary': '#bb86fc',
    '--color-primary-dark': '#a76ff9',
    '--color-income': '#03dac6',
    '--color-expense': '#cf6679',
  },
  light: {
    '--color-background': '#f5f5f5',
    '--color-surface': '#ffffff',
    '--color-surface-dark': '#eeeeee',
    '--color-border': '#e0e0e0',
    '--color-text-primary': '#212121',
    '--color-text-secondary': '#757575',
    '--color-primary': '#6200ee',
    '--color-primary-dark': '#3700b3',
    '--color-income': '#00c853',
    '--color-expense': '#d50000',
  },
};

export type ThemeName = keyof typeof themes;

export const applyTheme = (themeName: ThemeName) => {
  const theme = themes[themeName];
  const root = document.documentElement;
  Object.entries(theme).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};
