import {
    BarChart,
    Bar,
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

const BarChartComponent = ({ data }) => {
    return (
        <ResponsiveContainer width='100%' height={400}>
            <BarChart
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
                <Bar dataKey='count' fill='#2cb1bc' barSize={75} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default BarChartComponent;