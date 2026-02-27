import { styled } from '@mui/material/styles';
import { SnackbarProvider as NotistackProvider, MaterialDesignContent } from 'notistack';

interface Props {
  children: React.ReactNode;
}

const StyledMaterialDesignContent = styled(MaterialDesignContent)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    '&.notistack-MuiContent-default': {
      backdropFilter: 'blur(12px)',
      backgroundColor: isDark ? 'rgba(26,29,36,0.9)' : 'rgba(255,255,255,0.95)',
      border: '1px solid',
      borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
      boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.12)',
    },
    '&.notistack-MuiContent-success': {
      backdropFilter: 'blur(12px)',
      backgroundColor: isDark ? 'rgba(26,29,36,0.9)' : 'rgba(255,255,255,0.95)',
      border: '1px solid',
      borderColor: 'rgba(5,150,105,0.4)',
      boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(5,150,105,0.15)' : '0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(5,150,105,0.2)',
    },
    '&.notistack-MuiContent-error': {
      backdropFilter: 'blur(12px)',
      backgroundColor: isDark ? 'rgba(26,29,36,0.9)' : 'rgba(255,255,255,0.95)',
      border: '1px solid',
      borderColor: 'rgba(220,38,38,0.4)',
    },
    '&.notistack-MuiContent-warning': {
      backdropFilter: 'blur(12px)',
      backgroundColor: isDark ? 'rgba(26,29,36,0.9)' : 'rgba(255,255,255,0.95)',
      border: '1px solid',
      borderColor: 'rgba(217,119,6,0.4)',
    },
    '&.notistack-MuiContent-info': {
      backdropFilter: 'blur(12px)',
      backgroundColor: isDark ? 'rgba(26,29,36,0.9)' : 'rgba(255,255,255,0.95)',
      border: '1px solid',
      borderColor: 'rgba(5,150,105,0.3)',
    },
  };
});

export default function SnackbarProvider({ children }: Props) {
  return (
    <NotistackProvider
      maxSnack={3}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      autoHideDuration={5000}
      Components={{
        default: StyledMaterialDesignContent,
        success: StyledMaterialDesignContent,
        error: StyledMaterialDesignContent,
        warning: StyledMaterialDesignContent,
        info: StyledMaterialDesignContent,
      }}
    >
      {children}
    </NotistackProvider>
  );
}
