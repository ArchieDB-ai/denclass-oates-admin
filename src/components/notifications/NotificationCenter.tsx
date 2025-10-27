import { Alert, Snackbar } from '@mui/material';
import type { AlertColor } from '@mui/material/Alert';
import type { SyntheticEvent } from 'react';
import { useAppStore } from '../../store/appStore';

const NotificationCenter = () => {
  const notifications = useAppStore((state) => state.notifications);
  const removeNotification = useAppStore((state) => state.removeNotification);

  const handleClose = (
    id: string,
    _event?: SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    removeNotification(id);
  };

  return (
    <>
      {notifications.map(({ id, message, severity, autoHideDuration }) => (
        <Snackbar
          key={id}
          open
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          autoHideDuration={autoHideDuration ?? 6000}
          onClose={(event: SyntheticEvent | Event, reason?: string) =>
            handleClose(id, event, reason)
          }
        >
          <Alert
            elevation={6}
            variant="filled"
            severity={severity as AlertColor}
            onClose={(event: SyntheticEvent) => handleClose(id, event)}
            sx={{ width: '100%' }}
          >
            {message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default NotificationCenter;
