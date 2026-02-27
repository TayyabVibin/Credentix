import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DarkModeRounded from '@mui/icons-material/DarkModeRounded';
import LightModeRounded from '@mui/icons-material/LightModeRounded';

interface Props {
  mode: 'light' | 'dark';
  onToggle: () => void;
}

export default function ThemeToggle({ mode, onToggle }: Props) {
  return (
    <Tooltip title={mode === 'light' ? 'Dark mode' : 'Light mode'}>
      <IconButton onClick={onToggle} color="inherit" aria-label="Toggle theme">
        {mode === 'light' ? <DarkModeRounded /> : <LightModeRounded />}
      </IconButton>
    </Tooltip>
  );
}
