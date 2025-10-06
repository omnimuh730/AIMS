import { useSnackbar } from "notistack";
import { useCallback, useMemo } from "react";

const useNotification = () => {
	const { enqueueSnackbar } = useSnackbar();

	const showNotification = useCallback((message: string, options: any = {}) => {
		const {
			variant = "default",
			autoHideDuration = 2500,
			...otherOptions
		} = options;

		enqueueSnackbar(message, {
			variant,
			autoHideDuration,
			...otherOptions,
		});
	}, [enqueueSnackbar]);

	const success = useCallback((message: string, options?: any) => {
		showNotification(message, { variant: "success", ...options });
	}, [showNotification]);

	const error = useCallback((message: string, options?: any) => {
		showNotification(message, { variant: "error", ...options });
	}, [showNotification]);

	const warning = useCallback((message: string, options?: any) => {
		showNotification(message, { variant: "warning", ...options });
	}, [showNotification]);

	const info = useCallback((message: string, options?: any) => {
		showNotification(message, { variant: "info", ...options });
	}, [showNotification]);

	return useMemo(() => ({
		showNotification,
		success,
		error,
		warning,
		info,
	}), [showNotification, success, error, warning, info]);
};

export default useNotification;
