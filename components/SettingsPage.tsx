import React from 'react';
// Fix: Add file extension to import to ensure module resolution.
import { ThemeName, themes } from '../utils/themes.ts';

interface SettingsPageProps {
  currentTheme: ThemeName;
  onThemeChange: (themeName: ThemeName) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ currentTheme, onThemeChange }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Configurações</h2>
      <div className="bg-surface p-6 rounded-lg shadow-lg">
        <h3 className="font-bold mb-4">Tema</h3>
        <div className="flex space-x-4">
          {(Object.keys(themes) as ThemeName[]).map((themeName) => (
            <button
              key={themeName}
              onClick={() => onThemeChange(themeName)}
              className={`py-2 px-4 rounded border-2 capitalize ${
                currentTheme === themeName
                  ? 'border-primary'
                  : 'border-transparent hover:border-border'
              }`}
            >
              {themeName}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
