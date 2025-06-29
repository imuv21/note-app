//toasts
import { toast } from 'react-hot-toast';
import VerifiedIcon from '@mui/icons-material/Verified';
import NewReleasesIcon from '@mui/icons-material/NewReleases';

export const showToast = (type, message) => {
    const commonConfig = {
        duration: 3000,
        position: 'top-center',
        ariaProps: { role: 'status', 'aria-live': 'polite' },
    };

    if (type === 'success') {
        toast(
            <div className="flex center g5">
                <VerifiedIcon />
                {message}
            </div>,
            {
                ...commonConfig,
                style: { color: 'rgb(0, 189, 0)' },
                className: 'success',
            }
        );
    } else if (type === 'error') {
        toast(
            <div className="flex center g5">
                <NewReleasesIcon />
                {message}
            </div>,
            {
                ...commonConfig,
                style: { color: 'red' },
                className: 'failed',
            }
        );
    }
};