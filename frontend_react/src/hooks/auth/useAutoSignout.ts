import { useEffect } from 'react';

const useAutoSignout = (logoutFunction: () => void, inactivityTime: number = 600000): void => {
    useEffect(() => {
        let timer: NodeJS.Timeout;
        const resetTimer = (): void => {
            clearTimeout(timer);
            timer = setTimeout(logoutFunction, inactivityTime);
        };

        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('keydown', resetTimer);
        window.addEventListener('scroll', resetTimer);

        resetTimer();

        return () => {
            clearTimeout(timer);
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('keydown', resetTimer);
            window.removeEventListener('scroll', resetTimer);
        };
    }, [logoutFunction, inactivityTime]);
};

export default useAutoSignout;
