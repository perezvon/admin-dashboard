import React from 'react';
import {BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Bar} from 'recharts';

export const UserSpendChart = ({chartData, tooltipContent}) => (
    	<BarChart width={500} height={300} data={chartData}
            margin={{top: 5, right: 100, left: 20, bottom: 15}}>
       <XAxis dataKey='name'/>
       <YAxis/>
       <CartesianGrid strokeDasharray='3 3'/>
       <Tooltip />
       <Bar dataKey='total' fill={'green'} isAnimationActive={false} />
      </BarChart>
    );
