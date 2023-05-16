import React, { useState } from 'react';
import BarChart from './BarChart';
import AreaChart from './AreaChart'
import { useAppContext } from '../context/appContext';
import Wrapper from '../assets/wrappers/ChartsContainer';

const ChartsContainer = () => {
    const [barChart, setBarChart] = useState(true);
    const { monthlyBets: data } = useAppContext()

    return (
        <Wrapper>
            <h2>Monthly Bets</h2>
            <button type='button' onClick={() => setBarChart(!barChart)}>
                {barChart ? 'Area Chart' : 'Bar Chart'}
            </button>
            {barChart ? <BarChart data={data} /> : <AreaChart data={data} />}
        </Wrapper>
    )
}

export default ChartsContainer