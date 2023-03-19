import { FC } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Sector,
  ComposedChart,
  Scatter,
} from "recharts";

import { ChartTypes, AdCampaignExcelDataProps } from "../../services/DataProvider";

interface ExcelDataChartProps {
  adExpenses: AdCampaignExcelDataProps[];
  chooseChartType: ChartTypes;
}

const ExcelDataChart:FC<ExcelDataChartProps> = ({adExpenses,chooseChartType}) => {
    return (
        <div>
          {/* Area Chart */}
    
          {ChartTypes.Area_Chart === chooseChartType && adExpenses.length >= 1 && (
            <AreaChart
              width={700}
              height={300}
              data={adExpenses}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Legend />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="totalSpends"
                stroke="#8884d8"
                fill="#8884d8"
              />
    
              <Area
                type="monotone"
                dataKey="totalRevenue"
                stroke="#C32148"
                fill="#C32148"
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#008000"
                fill="#008000"
              />
            </AreaChart>
          )}
    
          {/* Line Chart */}
    
          {ChartTypes.Line_Chart === chooseChartType && (
            <LineChart
              width={700}
              height={300}
              data={adExpenses}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="6 6" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalSpends"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
    
              <Line
                type="monotone"
                dataKey="totalRevenue"
                stroke="#82ca9d"
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#1F45FC"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          )}
    
          {/* Bar Chart */}
    
          {ChartTypes.Bar_Chart === chooseChartType && (
            <BarChart
              width={700}
              height={300}
              data={adExpenses}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalSpends" fill="#8884d8" />
              <Bar dataKey="totalRevenue" fill="#B21807" />
    
              <Bar dataKey="count" fill="#C32148" />
            </BarChart>
          )}
    
          {/* LineBarAreaComposedChart */}
    
          {ChartTypes.Line_Bar_Area_Composed_Chart === chooseChartType && (
            <ComposedChart
              width={700}
              height={400}
              data={adExpenses}
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="_id" scale="band" />
              <YAxis />
              <Legend />
              <Tooltip />
              <Area type="monotone" dataKey="amt" fill="#8884d8" stroke="#8884d8" />
              <Bar dataKey="totalSpends" barSize={20} fill="#413ea0" />
              <Line type="monotone" dataKey="count" stroke="#ff7300" />
              <Scatter dataKey="totalRevenue" fill="orange" />
            </ComposedChart>
          )}
        </div>
      );
}

export default ExcelDataChart