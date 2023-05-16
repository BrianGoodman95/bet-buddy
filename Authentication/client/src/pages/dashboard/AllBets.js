import { useAppContext } from '../../context/appContext';
import Wrapper from '../../assets/wrappers/DashboardFormPage';
import { AllBetsContainer, SearchContainer } from '../../components';

const AllBets = () => {
  return (
    <Wrapper>
      <SearchContainer />
      <AllBetsContainer />
    </Wrapper>
  )
}

export default AllBets