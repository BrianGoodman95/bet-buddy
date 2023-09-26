import moment from 'moment';
import { FaMoneyBill, FaBookOpen, FaBalanceScale, FaCalendarAlt } from 'react-icons/fa';
import { FiTarget } from 'react-icons/fi';
import { useAppContext } from '../context/appContext';
import { Link } from 'react-router-dom';
import Wrapper from '../assets/wrappers/Bet'
import BetInfo from './BetInfo'


const Bet = ({
    _id,
    eventCategory,
    eventDescription,
    sportsBook,
    odds,
    pick,
    wager,
    gameLocation,
    betStatus,
    createdAt
}) => {
    const { setEditBet, deleteBet } = useAppContext();


    let date = moment(createdAt).format('MMMM Do, YYYY');

    return (
        <Wrapper>
            <header>
                <div className="main-icon">{betStatus.charAt(0)}</div>
                <div className="info">
                    <h5>{eventCategory}</h5>
                    <p>{eventDescription}</p>
                </div>
            </header>
            <div className='content'>
                <div className='content'>
                    <div className='content-center'>
                        <div className={`status ${betStatus}`}>{betStatus}</div>
                        <BetInfo icon={<FaCalendarAlt />} text={date} />
                        <BetInfo icon={<FiTarget />} text={pick} />
                        <BetInfo icon={<FaBalanceScale />} text={odds} />
                        <BetInfo icon={<FaBookOpen />} text={sportsBook} />
                        <BetInfo icon={<FaMoneyBill />} text={`$${wager}`} />
                    </div>
                </div>
                <footer>
                    <div className="actions">
                        <Link
                            to={`/add-bet`}
                            className='btn edit-btn'
                            onClick={() => setEditBet(_id)}
                        >
                            Edit
                        </Link>
                        <button
                            type='button'
                            className='btn delete-btn'
                            onClick={() => deleteBet(_id)}
                        >
                            Delete
                        </button>
                    </div>
                </footer>
            </div>
        </Wrapper>
    )
}

export default Bet;