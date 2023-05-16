import Wrapper from "../assets/wrappers/Navbar";
import {FaAlignLeft, FaUserCircle, FaCaretDown} from 'react-icons/fa'
import { useAppContext } from "../context/appContext";
import Logo from './Logo'
import { useState } from "react";

const Navbar = () => {
    // local state
    const [showLogout, setShowLogout] = useState(false)
    const { user, toggleSidebar, logoutUser } = useAppContext()
    
    return (
        <Wrapper>
            <div className="nav-center" >
                <button 
                    className="toggle-btn" 
                    onClick={toggleSidebar}
                    type='button'
                >
                    <FaAlignLeft />
                </button>
                <div>
                    <Logo />
                    <h3 className="logo-text">Dashboard</h3>
                </div>
                <div className="btn-container">
                    <button
                        className="btn"
                        type='button'
                        onClick={() => setShowLogout(!showLogout)}
                    >
                        <FaUserCircle/>
                        {user && user.name}
                        <FaCaretDown/>
                    </button>
                    <div className={showLogout? "dropdown show-dropdown" :"dropdown"} >
                        <button
                            type='button'
                            className="dropdown-btn"
                            onClick={() => logoutUser()}
                        >   
                        Logout
                        </button>
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}

export default Navbar