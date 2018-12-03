import React from "react";
import './line-chart.scss';
import Chart from "react-google-charts";

const LineChart = ({ deviceId, deviceData }) => {

  return (
    <div >
      <Chart
        className="chart-contents"
        data={deviceData}
        chartType="Line"
        options={{
          chart: {
            title:
              deviceId,
          },
          width: 950,
          height: 300,
          series: {
            // Gives each series an axis name that matches the Y-axis below.
            0: { axis: 'CPU Usage' },
            1: { axis: 'Memory Usage' },
          },
          axes: {
            // Adds labels to each axis; they don't have to match the axis names.
            y: {
              CPU: { label: 'CPU Usage' },
              Memory: { label: 'Memory Usage' },
            },
          },
        }}
      />
    </div>
  );
}
    

export default LineChart;