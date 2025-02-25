import { EChartsData, GetSatType } from '@app/interfaces';
import { keepTrackApi } from '@app/keepTrackApi';
import { getEl } from '@app/lib/get-el';
import { SatMathApi } from '@app/singletons/sat-math-api';
import linePlotPng from '@public/img/icons/scatter-plot4.png';
import * as echarts from 'echarts';
import 'echarts-gl';
import { Degrees, DetailedSatellite, SpaceObjectType } from 'ootk';
import { KeepTrackPlugin } from '../KeepTrackPlugin';
import { SelectSatManager } from '../select-sat-manager/select-sat-manager';

export class Lat2LonPlots extends KeepTrackPlugin {
  readonly id = 'Lat2LonPlots';
  dependencies_: string[] = [SelectSatManager.name];
  private selectSatManager_: SelectSatManager;

  constructor() {
    super();
    this.selectSatManager_ = keepTrackApi.getPlugin(SelectSatManager);
  }


  bottomIconLabel = 'Lat. vs Long. Plot';
  bottomIconImg = linePlotPng;
  bottomIconCallback = () => {
    const chartDom = getEl(this.plotCanvasId);

    this.createPlot(Lat2LonPlots.getPlotData(), chartDom);
  };

  plotCanvasId = 'plot-analysis-chart-lat2lon';
  chart: echarts.ECharts;

  helpTitle = 'Latitude vs Longitude Plot Menu';
  helpBody = keepTrackApi.html`
  <p>
    The Latitude vs Longitude Plot Menu is used for plotting the latitude vs longitude in the GEO belt.
  </p>`;

  sideMenuElementName = 'lat2lon-plots-menu';
  sideMenuElementHtml: string = keepTrackApi.html`
  <div id="lat2lon-plots-menu" class="side-menu-parent start-hidden text-select plot-analysis-menu-normal plot-analysis-menu-maximized">
    <div id="plot-analysis-content" class="side-menu">
      <div id="${this.plotCanvasId}" class="plot-analysis-chart plot-analysis-menu-maximized"></div>
    </div>
  </div>`;

  addHtml(): void {
    super.addHtml();
  }


  createPlot(data: EChartsData, chartDom: HTMLElement) {
    // Dont Load Anything if the Chart is Closed
    if (!this.isMenuButtonActive) {
      return;
    }

    // Delete any old charts and start fresh
    if (!this.chart) {
      // Setup Configuration
      this.chart = echarts.init(chartDom);
      this.chart.on('click', (event) => {
        if ((event.data as any)?.id) {
          this.selectSatManager_.selectSat((event.data as any).id);
        }
      });
    }

    // Setup Chart
    this.chart.setOption({
      title: {
        text: 'Latitude vs Longitude Plot',
        textStyle: {
          fontSize: 16,
          color: '#fff',
        },
      },
      legend: {
        show: true,
        textStyle: {
          color: '#fff',
        },
      },
      tooltip: {
        formatter: (params) => {
          const data = params.value;
          const color = params.color;
          const name = params.name;
          return `
            <div style="display: flex; flex-direction: column; align-items: flex-start;">
              <div style="display: flex; flex-direction: row; flex-wrap: nowrap; justify-content: space-between; align-items: flex-end;">
                <div style="width: 10px; height: 10px; background-color: ${color}; border-radius: 50%; margin-bottom: 5px;"></div>
                <div style="font-weight: bold;"> ${name}</div>
              </div>
              <div><bold>Latitude:</bold> ${data[1].toFixed(3)}°</div>
              <div><bold>Longitude:</bold> ${data[0].toFixed(3)}°</div>
              <div><bold>Time from now:</bold> ${data[2].toFixed(3)} min</div>
            </div>
          `;
        },
      },
      xAxis: {
        name: 'Longitude (°)',
        type: 'value',
        position: 'bottom',
      },
      yAxis: {
        name: 'Latitude (°)',
        type: 'value',
        position: 'left',
      },
      zAxis: {
        name: 'Mean Motion',
        type: 'value',
      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          xAxisIndex: [0],
          start: -180,
          end: 180,
        },
        {
          type: 'slider',
          show: true,
          yAxisIndex: [0],
          left: '93%',
          start: -50,
          end: 50,
        },
        {
          type: 'inside',
          xAxisIndex: [0],
          start: -180,
          end: 180,
        },
        {
          type: 'inside',
          yAxisIndex: [0],
          start: -50,
          end: 50,
        },
      ],
      series: data.map((item) => ({
        type: 'line',
        name: item.country,
        data: item.data.map((dataPoint: any) => ({
          name: item.name,
          id: item.satId,
          value: [dataPoint[2], dataPoint[1], dataPoint[0]],
        })),
        /*
         * symbolSize: 8,
         * itemStyle: {
         * borderWidth: 1,
         * borderColor: 'rgba(255,255,255,0.8)',
         * },
         */
        emphasis: {
          itemStyle: {
            color: '#fff',
          },
        },
      })),
    });
  }

  static getPlotData(): EChartsData {
    const data = [] as EChartsData;

    keepTrackApi.getCatalogManager().objectCache.forEach((obj) => {
      if (obj.type !== SpaceObjectType.PAYLOAD) {
        return;
      }
      let sat = obj as DetailedSatellite;

      // Taking only GEO objects
      if (sat.eccentricity > 0.1) {
        return;
      }
      if (sat.period < 1240) {
        return;
      }
      if (sat.period > 1640) {
        return;
      }

      // Compute LLA for each object
      sat = keepTrackApi.getCatalogManager().getObject(sat.id, GetSatType.POSITION_ONLY) as DetailedSatellite;
      const plotPoints = SatMathApi.getLlaOfCurrentOrbit(sat, 24);
      const plotData: [number, Degrees, Degrees][] = [];

      const now = keepTrackApi.getTimeManager().simulationTimeObj;
      plotPoints.forEach((point) => {
        const pointTime = (point.time - now.getTime()) / 1000 / 60;

        if (pointTime > 1440 || pointTime < 0) {
          return;
        }
        plotData.push([pointTime, point.lat, point.lon]);
      });
      let country = '';
      switch (sat.country) {
        case 'United States of America':
        case 'United States':
        case 'US':
        case 'USA':
        country = 'USA';
        break;

        case 'France':
        case 'FR':
        country = 'France';
          break;

        case 'Russian Federation':
        case 'CIS':
        case 'RU':
        case 'SU':
        case 'Russia':
        country = 'Russia';
          break;

        case 'China':
        case 'China, People\'s Republic of':
        case 'Hong Kong Special Administrative Region, China':
        case 'China (Republic)':
        case 'PRC':
        case 'CN':
        country = 'China'
          break;
        case 'Japan':
        case 'JPN':
          country = 'Japan'
            break;
        case 'India':
        case 'IND':
          country = 'India'
            break;
        default:
          country = 'Other'
          break;
      }
      data.push({
        name: sat.name,
        satId: sat.id,
        country: country,
        data: plotData,
      });
    });

  return data;
  }
}

export const Lat2LonPlotsPlugin = new Lat2LonPlots();
