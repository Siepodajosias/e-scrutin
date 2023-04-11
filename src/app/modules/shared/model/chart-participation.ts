import {
	ApexAxisChartSeries,
	ApexChart,
	ApexDataLabels,
	ApexFill,
	ApexLegend,
	ApexNonAxisChartSeries,
	ApexPlotOptions,
	ApexResponsive,
	ApexStroke,
	ApexTheme,
	ApexTitleSubtitle,
	ApexTooltip,
	ApexXAxis,
	ApexYAxis
} from 'ng-apexcharts';
import {DonneesTableauDeBord} from "./tableau-bord.model";

export type ChartOptions = {
	series: ApexAxisChartSeries;
	serie: ApexNonAxisChartSeries;
	chart: ApexChart;
	xaxis: ApexXAxis;
	yaxis: ApexYAxis;
	stroke: ApexStroke;
	tooltip: ApexTooltip;
	dataLabels: ApexDataLabels;
	legend: ApexLegend;
	responsive: ApexResponsive[];
	plotOptions: ApexPlotOptions;
	fill: ApexFill;
	colors: string[];
	labels: any;
	theme: ApexTheme;
	title: ApexTitleSubtitle;
	tableauBord: DonneesTableauDeBord;
};
