import { useEffect } from 'react'
import Router from 'next/router'

export const useWarnIfUnsavedChanges = (unsavedChanges: Array<any>) => {

    const message = 'É possível que as alterações feitas não sejam salvas.';

    useEffect(() => {
        const routeChangeStart = url => {
            if (Router.asPath !== url && unsavedChanges.length > 0 && !confirm(message)) {
                Router.events.emit('routeChangeError');
                Router.replace(Router.asPath, Router.asPath);
                throw 'Abort route change. Please ignore this error.';
            }
        };

        const beforeunload = e => {
            if (unsavedChanges.length > 0) {
                e.preventDefault();
                e.returnValue = message;
                return message;
            }
        };

        window.addEventListener('beforeunload', beforeunload);
        Router.events.on('routeChangeStart', routeChangeStart);

        return () => {
            window.removeEventListener('beforeunload', beforeunload);
            Router.events.off('routeChangeStart', routeChangeStart);
        };
    }, [unsavedChanges]);
};