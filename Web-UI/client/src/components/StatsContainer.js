import StatItem from "./StatItem"
import { useAppContext } from "../context/appContext"
import { FaSuitcaseRolling, FaCalendarCheck, FaBug } from "react-icons/fa"
import Wrapper from '../assets/wrappers/StatsContainer'

const StatsContainer = () => {
    const { stats } = useAppContext()
    const defaultStats = [
        {
            title: 'unsettled bets',
            count: stats.Unsettled || 0,
            icon: <FaSuitcaseRolling />,
            color: '#e9b949',
            bcg: '#fcefc7',
        },
        {
            title: 'Bets Won',
            count: stats.Won || 0,
            icon: <FaCalendarCheck />,
            color: '#10A540',
            bcg: '#DAF0E1',
        },
        {
            title: 'Bets Lost',
            count: stats.Lost || 0,
            icon: <FaBug />,
            color: '#d66a6a',
            bcg: '#ffeeee',
        },
        {
            title: 'Bets Pushed',
            count: stats.Lost || 0,
            icon: <FaBug />,
            color: '#647acb',
            bcg: '#e0e8f9',
        },
    ];
    return (
        <Wrapper>
            {defaultStats.map((item, index) => {
                return <StatItem key={index} {...item} />
            })}
        </Wrapper>
    )
}

export default StatsContainer