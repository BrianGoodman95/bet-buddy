import NavLinks from "./NavLinks";
import Logo from "./Logo";
import Wrapper from "../assets/wrappers/BigSidebar";
import { useAppContext } from "../context/appContext";

const BigSidebar = () => {
    const {showSidebar} = useAppContext()
    return (
        <Wrapper>
            <div 
                className={
                    showSidebar? 'sidebar-container' : 'sidebar-container show-sidebar'
                }
            >
                <div className="content">
                    <header className='img-big-sidebar'>
                        <Logo/>
                    </header>
                    <NavLinks />
                </div>
            </div>
        </Wrapper>
    )
}

export default BigSidebar