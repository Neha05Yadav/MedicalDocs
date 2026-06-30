"use client";

import { DelayedRender } from '@/components/DelayedRender';
import { ResponsiveContainer as RechartsResponsiveContainer } from 'recharts';

// EXPLICIT EXPORTS ONLY to enable tree-shaking
export { 
  PieChart, Pie, Cell, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line, AreaChart, Area, ComposedChart 
} from 'recharts';

export const ResponsiveContainer = ({ children, ...props }: any) => {
  return (
    <RechartsResponsiveContainer {...props}>
      {children}
    </RechartsResponsiveContainer>
  );
};
