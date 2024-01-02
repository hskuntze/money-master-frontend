import "./styles.css";
import ReactApexChart from "react-apexcharts";
import { ColumnChartConfig } from "types/charts/columnchartconfig";
import { getMonthNameFromDate } from "util/formatters";

type Props = {
  name: string;
  series: ColumnChartConfig[];
  width: number;
  type: "numeric" | "datetime" | "category";
};

const ColumnChart = ({ name, series = [], width, type }: Props) => {
  return (
    <div className="column-chart-card-container" style={{ width: width + "%" }}>
      <label htmlFor={`#column-chart-${name}`} className="column-chart-label">
        {name}
      </label>
      {!(type === "category" || type === "numeric") ? (
        <ReactApexChart
          type="bar"
          series={[{ name: name, data: series }]}
          id={`column-chart-${name}`}
          options={{
            legend: {
              show: false,
            },
            noData: {
              text: "No results",
              align: "center",
              verticalAlign: "middle",
              offsetY: 0,
              style: {
                color: "#fff",
                fontSize: "15px",
                fontFamily: "Montserrat Alternates, sans-serif",
              },
            },
            chart: {
              foreColor: "#f2f0f2",
            },
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: "80%",
                borderRadius: 2,
              },
            },
            dataLabels: {
              enabled: false,
            },
            stroke: {
              show: false,
            },
            xaxis: {
              type: type,
              labels: {
                datetimeFormatter: {
                  day: "dd MMM'",
                  month: "MMM",
                },
              },
            },
            yaxis: {
              labels: {
                formatter: function (val: number) {
                  return `R$ ${val}`;
                },
              },
            },
            fill: {
              opacity: 1,
              colors: ["#B8D9CD"],
            },
            tooltip: {
              theme: "dark",
              y: {
                formatter: function (val: number) {
                  return `R$ ${val}`;
                },
              },
            },
            title: {
              align: "center",
              margin: 5,
            },
          }}
        />
      ) : (
        <ReactApexChart
          type="bar"
          series={[{ name: name, data: series }]}
          id={`column-chart-${name}`}
          options={{
            legend: {
              show: false,
            },
            noData: {
              text: "No results",
              align: "center",
              verticalAlign: "middle",
              offsetY: 0,
              style: {
                color: "#fff",
                fontSize: "15px",
                fontFamily: "Montserrat Alternates, sans-serif",
              },
            },
            chart: {
              foreColor: "#f2f0f2",
            },
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: "80%",
                borderRadius: 2,
              },
            },
            dataLabels: {
              enabled: false,
            },
            stroke: {
              show: false,
            },
            xaxis: {
              type: type,
              labels: {
                formatter: function (val: string) {
                  return getMonthNameFromDate(val);
                },
              },
            },
            yaxis: {
              labels: {
                formatter: function (val: number) {
                  return `R$ ${val}`;
                },
              },
            },
            fill: {
              opacity: 1,
              colors: ["#B8D9CD"],
            },
            tooltip: {
              theme: "dark",
              y: {
                formatter: function (val: number) {
                  return `R$ ${val}`;
                },
              },
            },
            title: {
              align: "center",
              margin: 5,
            },
          }}
        />
      )}
    </div>
  );
};

export default ColumnChart;
