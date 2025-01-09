import { useTheme } from './ThemeProvider';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => handleThemeChange('light')}>Light Theme</button>
      <button onClick={() => handleThemeChange('dark')}>Dark Theme</button>
      <button onClick={() => handleThemeChange('system')}>System Theme</button>
    </div>
  );
};
