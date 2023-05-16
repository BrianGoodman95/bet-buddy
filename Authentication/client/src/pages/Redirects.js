import { useAppContext } from "../context/appContext"
import { Navigate } from "react-router-dom"

const SkipSetup = ({children}) => {
    const {user} = useAppContext()
    if (user) {
        return <Navigate to='/' />
    }
    return children
}

export { SkipSetup }