import { Logo } from '../../components'
import { Link } from 'react-router-dom'
import Wrapper from '../../assets/wrappers/DashboardFormPage'

const Stats = () => {
    return (
      <Wrapper> 
        <div className='Top Bar'> 
            <h1>
                Stats
            </h1>
            <Link to='/landing' className='btn btn-hero'>Landing Page</Link>
        </div>
      </Wrapper>
    )
  }
  
  export default Stats