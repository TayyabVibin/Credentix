import { SnackbarProvider as NotistackProvider } from 'notistack';

interface Props {
  children: React.ReactNode;
}

export default function SnackbarProvider({ children }: Props) {
  return (
    <NotistackProvider
      maxSnack={3}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      autoHideDuration={5000}
    >
      {children}
    </NotistackProvider>
  );
}
