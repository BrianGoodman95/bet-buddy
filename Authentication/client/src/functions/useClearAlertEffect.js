import { useEffect } from 'react'

export const useClearAlertEffect = (showAlert, clearAlert, dependencies) => {
    useEffect(() => {
        if (showAlert) {
            clearAlert()
        }
    }, dependencies)
}