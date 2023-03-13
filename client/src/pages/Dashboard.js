import {Logo} from '../components'
import { Link } from 'react-router-dom'
import Wrapper from '../assets/wrappers/DashboardFormPage'

const Dashboard = () => {
    return (
      <Wrapper> 
        <nav>
          <Logo />
        </nav>
        <div className='Top Bar'> 
            <h1>
                Make <span>Data</span> Awesome
            </h1>
            <Link to='/landing' className='btn btn-hero'>Landing Page</Link>
        </div>
      </Wrapper>
    )
  }
  
  export default Dashboard

