import ReactApexChart from "react-apexcharts";
import "./styles.css";

type Props = {
  labels: string[];
  name: string;
  series: number[];
  width: number;
};

const PieChart = ({ name, labels = [], series = [], width }: Props) => {
  return (
    <div className="pie-chart-card-container" style={{width: width + "%"}}>
      <label className="pie-chart-label" htmlFor={`#pie-chart-${name}`}>{name}</label>
      <ReactApexChart
        type="pie"
        width={300}
        height={400}
        id={`pie-chart-${name}`}
        series={series}
        options={{
          colors: [
            "#1848D9",
            "#325CD9",
            "#242D40",
            "#8498BF",
            "#CEDAF2",
            "#04BF45",
            "#E1F2DF",
            "#CDD9A0",
            "#BFA004",
            "#403232",
            "#B8D9CD",
            "#148C54",
            "#56A681",
            "#434343",
            "#55645F",
            "#011B0F",
            "#073520",
            "#294E3D",
            "#D9ED26",
            "#313131",
            "#F23005",
            "#F25E3D",
            "#BF9B93",
            "#380C91",
            "#1B0645",
            "#37245E",
          ],
          labels,
          noData: {
            text: "No results",
            align: "center",
            verticalAlign: "middle",
            offsetX: 0,
            offsetY: 0,
            style: {
              color: "#F2F0F2",
              fontSize: "14px",
              fontFamily: "Montserrat Alternates, sans-serif",
            },
          },
          legend: {
            show: true,
            floating: false,
            position: "bottom",
            offsetY: -5,
            offsetX: -20,
            containerMargin: {
              left: 5,
            },
            labels: {
              colors: "#F2F0F2",
            },
            fontFamily: "Montserrat Alternates, sans-serif",
            fontSize: "14px",
            itemMargin: {
              vertical: 3,
              horizontal: 7,
            },
            onItemHover: {
              highlightDataSeries: true
            }
          },
          dataLabels: {
            enabled: false,
          },
          plotOptions: {
            pie: {
              donut: {
                size: "100%",
                labels: {
                  show: true,
                  name: {
                    show: false,
                    offsetY: 5,
                    formatter: function () {
                      return name;
                    },
                  },
                  total: {
                    show: true,
                    showAlways: false,
                    fontSize: "15px",
                    color: "#313131",
                    fontFamily: "Montserrat Alternates, sans-serif",
                    formatter: function () {
                      return "";
                    },
                  },
                  value: {
                    formatter: function (val) {
                      return `R$ ${val}`;
                    },
                    color: "#313131",
                    fontFamily: "Montserrat Alternates, sans-serif",
                    fontWeight: "500",
                    fontSize: "25px",
                  },
                },
              },
            },
          },
          tooltip: {
            theme: "dark",
            y: {
              formatter: function (val: number) {
                return `R$ ${val}`;
              },
            },
          },
        }}
      />
    </div>
  );
};

export default PieChart;
