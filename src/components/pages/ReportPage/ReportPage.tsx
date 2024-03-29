import RefreshIcon from "@mui/icons-material/Refresh";
import { Button, ButtonGroup, IconButton, Paper } from "@mui/material";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import "chart.js/auto";
import { Chart } from "react-chartjs-2";
import { ChartData, ChartOptions } from "chart.js/auto";


interface Props { }

interface State {
  chartType: string;
  chartData1: number[];
  chartData2: number[];
}

const MyComponent: React.FC<Props> = (props: Props): JSX.Element => {
  const [chartType, setChartType] = useState<string>("bar");
  const [chartData1, setChartData1] = useState<number[]>([]);
  const [chartData2, setChartData2] = useState<number[]>([]);

  function getRandomInt(): number[] {
    let randoms: number[] = [];
    for (let index = 0; index < 8; index++) {
      randoms.push(Math.floor(Math.random() * (50000 - 5 + 1)) + 5);
    }
    return randoms;
  }

  const data: ChartData<"bar" | "line" | "pie", number[], string> = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Revenue 2022",
        fill: false,
        // lineTension: 0.1, // line curve
        backgroundColor: [
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 99, 132, 0.2)",
        ],
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 10, // circle
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: chartData1,
      },
      {
        label: "Revenue 2023",
        fill: false,
        // lineTension: 0.1, // line curve
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        borderColor: "rgba(0, 0, 0, 0.3)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(220,220,220,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 10, // circle
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(220,220,220,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: chartData2,
      },
    ],
  };

  const chartOption: ChartOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          title: function () {
            return "CMS";
          },
        },
      },
      legend: { display: true },
      title: {
        display: true,
        text: "CMS",
        position: "top",
      },
    },
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          // beginAtZero: true,
          callback: function (value: any, _index: any) {
            return "฿" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          },
        },
      },
    },
  };

  useEffect(() => {
    setChartData1(getRandomInt());
    setChartData2(getRandomInt());
  }, []);

  return (
    <Paper sx={{ padding: 4 }}>
      <Typography variant="h1">Sale Chart</Typography>
      <ButtonGroup size="large" color="primary" aria-label="large outlined primary button group">
    
      </ButtonGroup>
      <IconButton
        aria-label="refresh"
        onClick={() => {
          setChartData1(getRandomInt());
          setChartData2(getRandomInt());
        }}
      >
        <RefreshIcon />
      </IconButton>
      <div style={{ height: "55vh" }}>
      <Chart type={"line"} data={data} options={chartOption} />
      </div>
    </Paper>
  );
};

export default MyComponent;