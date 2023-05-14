import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload) {
        return (
            <div style={{ fontSize: '14px', backgroundColor: '#fff', padding: '1px 5px' }}>
                <p>{`${label}: ${payload[0].value}`}</p>
            </div>
        );
    }

    return null;
};

const AreaChartComponent = ({ data }) => {
    return (
        <ResponsiveContainer width='100%' height={400}>
            <AreaChart
                data={data}
                margin={{
                    top: 50,
                    bottom: 50,
                }}
            >
                <CartesianGrid strokeDasharray='3 3' style={{ fontSize: '1rem' }} />
                <XAxis dataKey='date' style={{ fontSize: '1rem' }} />
                <YAxis allowDecimals={false} style={{ fontSize: '1rem' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey='count' stroke="2cb1cb" fill='#bef8fd' />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default AreaChartComponent;