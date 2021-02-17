import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { DialogFunctions } from '../resources/shared/dialog-functions';
import * as echarts from 'echarts';
import { DataContext } from '../services/datacontext';
import { StageConfig } from '../stageConf';
import { Filters } from '../components/filters';
import { SourceMapGenerator } from '../../../../../../Library/Caches/typescript/4.1/node_modules/source-map/source-map';
@inject(DataContext, Router, DialogFunctions, StageConfig, Filters)
export class Metrics {
  constructor(dataContext, router, dialogFunctions, stageConfig, filters) {
    this.dataContext = dataContext;
    this.router = router;
    this.dialogFunctions = dialogFunctions;
    this.stageConfig = stageConfig;
    this.sonarqube_projects = `${this.stageConfig.SONARQUBE_ADDRESS}`;
    this.insights = [];
    this.projects = [];
    this.mulChart = null;
    this.mfChart = null;
    this.myChart2 = null;
    this.chartMostUsedLanguages = null;
    this.mostUsedLanguages = {};
    this.loading = true;
    this.exitDialogLinkId = null;
    this.filters = filters;
    this.organizations = [];
    this.selectedOrganization = null;
    this.organizationTitle = 'Organizations';
    this.chartIconColor = '#007bff'; //reference USWDS link color
    this.chartIconColorHover = '#0056b3'; //reference USWDS link hover color
    this.chartButtonColorBackground = '#007c85'; //reference variables-colors.scss $primary-color
    this.chartButtonColorText = '#ffffff'; //reference variables-colors.scss $primary-color-inverse
    this.chartTitleColor = '#1b1b1b';
    this.chartSubtextColor = '#333333';
  }

  activate() {
    this.loading = true;
  }

  attached() {
    this.getData('All');
    window.addEventListener('resize', this.handleResize, false);
  }

  deactivate() {
    // this.mostUsedLanguages.destroy();
    window.removeEventListener('resize', this.handleResize);
  }

  getData(organization) {
    if (organization === 'All') {
      return Promise.all([
        this.dataContext.getMetrics(null),
        this.dataContext.getRepositories(null)]).then((values) => {
          this.insights = values[0];
          this.projects = values[1];

          this.organizations = this.buildOrganizations(this.insights.organizations);

          this.prepareInsightData(this.insights, this.projects);
        });
    } else {
      return Promise.all([
        this.dataContext.getMetrics(this.selectedOrganization.name),
        this.dataContext.getRepositories(this.selectedOrganization.name)]).then((values) => {
          this.insights = values[0];
          this.projects = values[1];

          this.prepareInsightData(this.insights, this.projects);
        });
    }

  }

  prepareInsightData(insights, projects) {
    if(typeof insights==='undefined' || typeof projects==='undefined') {
      return;
    }

    this.sortProjects(projects).then((sortedProjects) => {
      Promise.all([
        this.buildChartMostUsed(insights),
        this.buildChartLanguages(insights),
        this.buildChartForks(sortedProjects),
        this.buildChartHealth(sortedProjects),
      ]).then(() => {
        const self = this;
        setTimeout(() => {
          self.handleResize();
        }, 10, self);
        this.loading = false;
      });
    }).catch((e) => {
      return;
    });
  }

  sortProjects(projects) {
    return new Promise((resolve, reject) => {
      try {
        projects.sort((a, b) => {
          if (b.sourceData.forksCount && a.sourceData.forksCount) {
            return Number(b.sourceData.forksCount) - Number(a.sourceData.forksCount);
          }
          if (b.sourceData.forksCount) {
            return 1;
          }
          if (a.sourceData.forksCount) {
            return -1;
          }
          return null;
        });
        let projs = projects.slice(0, 9);
        projs.reverse();
        resolve(projs);
      } catch (e) {
        reject(e);
      }
    });
  }

  handleResize = (event) => {
    if (this.mulChart) {
      this.mulChart.resize();
    }
    if (this.mfChart) {
      this.mfChart.resize();
    }
    if (this.myChart2) {
      this.myChart2.resize();
    }
    if (this.chartMostUsedLanguages) {
      this.chartMostUsedLanguages.resize();
    }
    // this.mostUsedLanguages.resize();
  }

  buildChartMostUsed(insights) {
    const calc = new Promise((resolve, reject) => {
      // Pie Chart
      let mul = insights.languageCountsStat;
      mul = Object.entries(mul);
      mul.sort(this.multiArraySecondColumnDesc);
      mul = mul.filter(x => x[1] != 0);
      const mulTop = mul.slice(0, 5);
      if (mul.length > 5) {
        const mulBot = mul.slice(6, mul.length);
        const mulOther = mulBot.reduce((a, b) => b[1] + a, 0);
        mulTop.push([`Other(${mulBot.length})`, mulOther]);
      }
      let data = mulTop.map((item) => {
        let r = {value:item[1],name:item[0]};
        return r;
      });
      resolve(data);
    });

    calc.then((data) => {
      let dat = this.injectColorStyle(data);
      if (!this.chartMostUsedLanguages) {
        this.chartMostUsedLanguages = echarts.init(document.getElementById('chartMostUsedLanguajes'));
      }
      let chartOption = this.getChartOptionMostUsedLanguages(dat);
      if (chartOption) {
        this.chartMostUsedLanguages.setOption(chartOption);
      }
    });
  }

  getChartOptionMostUsedLanguages(dat) {
    return {
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            show: false,
            title: {
              zoom: 'Zoom',
              back: 'Back',
            },
          },
          dataView: {
            show: true,
            title: 'View Data',
            readOnly: true,
            lang: [' ', 'Close', 'Refresh'],
            buttonColor: [this.chartButtonColorBackground],
            buttonTextColor: [this.chartButtonColorText],
          },
          restore: {
            show: true,
            title: 'Reset',
          },
          saveAsImage: {
            show: true,
            title: 'Save',
            type: 'png',
            name: 'codehub_most_used_languages',
          },
        },
        iconStyle: {
          borderColor: [this.chartIconColor],
        },
        emphasis: {
          iconStyle: {
            borderColor: [this.chartIconColorHover],
          },
        },
      },
      calculable: true,
      
      series: [
        {
            name:'Most Used Languages',
            type:'pie',
            radius : '70%',
            center: ['50%', '50%'],
            data: dat,
            label: {
              normal: {
                  position: 'outside',
                  formatter: '{b}\r\n{d}%',
                  color: [this.chartSubtextColor],
                  fontSize: 16,
              }
            },
            itemStyle: {
              emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },

            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
                return Math.random() * 200;
            }
        }
      ],
    }
  }

  injectColorStyle(data) {
    //wong's palette color
    let colors = ['#D55E00','#0072B2','#F0E442','#CC79A7','#009E73','#56B4E9','#E69F00'];
    let c = 0;
    for(let i=0; i<data.length; i++){
      let item = data[i];
      item.itemStyle = {color: colors[c]};
      data[i] = item;
      c++
      if(c >= data.length) {
        c = 0;
      }
    }
    return data;
  }

  filterZeroStats(arrayNames, arrayValues) {
    let i = 0;
    while(i<arrayValues.length) {
      if (arrayValues[i] === 0) {
        arrayValues.splice(i,1);
        arrayNames.splice(i,1);
      } else {
        i++;
      }
    }
    return {arrayNames, arrayValues};
  }

  buildChartLanguages(insights) {
    const calc = new Promise((resolve, reject) => {
      const list = this.insights.languageCountsStat;
      let arr1 = Object.keys(list).sort((a, b) => list[a] - list[b]);
      arr1 = arr1.slice(-10);
      let arr2 = arr1.map(k => this.insights.languageCountsStat[k]);
      arr2 = arr2.slice(-10);
      const result = this.filterZeroStats(arr1, arr2);
      resolve(result);
    });

    calc.then((data) => {
      if(!this.mulChart) {
        this.mulChart = echarts.init(document.getElementById('main'));
      }

      let chartOption = this.getChartOptionLanguages(data);
      if (chartOption) {
        this.mulChart.setOption(chartOption);
      }
    });
  }

  getChartOptionLanguages(data) {
    return {
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      toolbox: {
        show: true,
        feature: {
          mark: {
            show: true,
            title: {
              mark: 'mark',
              markUndo: 'undo',
              markClear: 'clear',
            },
            lineStyle: {
              width: 2,
              color: '#1e90ff',
              type: 'dashed',
            },
          },
          dataZoom: {
            show: false,
            title: {
              zoom: 'Zoom',
              back: 'Back',
            },
          },
          dataView: {
            show: true,
            title: 'View Data',
            readOnly: true,
            lang: [' ', 'Close', 'Refresh'],
            buttonColor: [this.chartButtonColorBackground],
            buttonTextColor: [this.chartButtonColorText],
          },
          magicType: {
            show: true,
            title: {
              line: 'Line',
              bar: 'Bar',
            },
            type: ['line', 'bar'],
          },
          restore: {
            show: true,
            title: 'Reset',
          },
          saveAsImage: {
            show: true,
            title: 'Save',
            type: 'png',
            name: 'stage_projects_by_language',
          },
        },
        iconStyle: {
          borderColor: [this.chartIconColor],
        },
        emphasis: {
          iconStyle: {
            borderColor: [this.chartIconColorHover],
          },
        },
      },
      calculable: true,
      xAxis: [
        {
          type: 'value',
          boundaryGap: [0, 0.01],
        },
      ],
      yAxis: [
        {
          type: 'category',
          data: data.arrayNames,
        },
      ],
      series: [
        {
          name: 'Projects',
          type: 'bar',
          data: data.arrayValues,
        },
      ],
    }
  }

  buildChartForks(projects) {
    const calc = new Promise((resolve, reject) => {
      const forkProjectNames = projects.map(obj => obj.sourceData.name);
      const forkAmount = projects.map(obj => obj.sourceData.forksCount ? obj.sourceData.forksCount: 0);
      const result = { forkProjectNames, forkAmount };
      resolve(result);
    });

    calc.then((data) => {
      if(!this.mfChart) {
        this.mfChart = echarts.init(document.getElementById('mfChart'));
      }

      let chartOption = this.getChartOptionForks(data);
      if (chartOption) {
        this.mfChart.setOption(chartOption);
      }
    });
  }
//LINE ~396 is color of bars
//LINE ~417 UNICORN close button color?
  getChartOptionForks(data) {
    return {
      color: ['#334aff'],
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      toolbox: {
        show: true,
        feature: {
          mark: {
            show: true,
            title: {
              mark: 'mark',
              markUndo: 'undo',
              markClear: 'clear',
            },
            lineStyle: {
              width: 2,
              color: '#ff0a00',
              type: 'dashed',
            },
          },
          dataZoom: {
            show: false,
            title: {
              zoom: 'Zoom',
              back: 'Back',
            },
          },
          dataView: {
            show: true,
            title: 'View Data',
            readOnly: true,
            lang: [' ', 'Close', 'Refresh'],
            buttonColor: [this.chartButtonColorBackground],
            buttonTextColor: [this.chartButtonColorText],
          },
          magicType: {
            show: true,
            title: {
              line: 'Line',
              bar: 'Bar',
            },
            type: ['line', 'bar'],
          },
          restore: {
            show: true,
            title: 'Reset',
          },
          saveAsImage: {
            show: true,
            title: 'Save',
            type: 'png',
            name: 'stage_most_forked_projects',
          },
        },
        iconStyle: {
          borderColor: [this.chartIconColor],
        },
        emphasis: {
          iconStyle: {
            borderColor: [this.chartIconColorHover],
          },
        },
      },
      calculable: true,
      xAxis: [
        {
          type: 'value',
          boundaryGap: [0, 0.01],
        },
      ],
      yAxis: [
        {
          type: 'category',
          data: data.forkProjectNames,
        },
      ],
      series: [
        {
          name: 'Forks',
          type: 'bar',
          data: data.forkAmount
        },
      ],
    };
  }

  buildChartHealth(projects) {
    const calc = new Promise((resolve, reject) => {
      const reliabilityData = this.getDataForRadarChart(this.insights.metricsSummary.reliability.values);
      const maxReliability = reliabilityData && reliabilityData.length > 0 ? Math.max(...reliabilityData) : 10;
      const securityData = this.getDataForRadarChart(this.insights.metricsSummary.security.values);
      const maxSecurity = securityData && securityData.length > 0 ? Math.max(...securityData) : 10;
      const maintainabilityData = this.getDataForRadarChart(this.insights.metricsSummary.maintainability.values);
      const maxMaintainability = maintainabilityData && maintainabilityData.length > 0 ? Math.max(...maintainabilityData) : 10;

      const result = {
        reliabilityData,
        maxReliability,
        securityData,
        maxSecurity,
        maintainabilityData,
        maxMaintainability,
      };
      resolve(result);
    });

    calc.then((data) => {
      if(!this.myChart2) {
        this.myChart2 = echarts.init(document.getElementById('main2'));
      }

      let chartOption = this.getChartOptionHealth(data);
      if (chartOption) {
        this.myChart2.setOption(chartOption);
      }
    });
  }

  getChartOptionHealth(data) {
    return {
      title: [{
        text: 'Reliability',
        subtext: 'All Projects By Reliability Grade',
        x: '20%',
        textAlign: 'center',
        textStyle: {
          color: [this.chartTitleColor],
        },
        subtextStyle: {
          color: [this.chartSubtextColor],
          fontSize: 15,
        },
      }, {
        text: 'Security',
        subtext: 'All Projects By Security Grade',
        x: '50%',
        textAlign: 'center',
        textStyle: {
          color: [this.chartTitleColor],
        },
        subtextStyle: {
          color: [this.chartSubtextColor],
          fontSize: 15,
        },
      }, {
        text: 'Maintainability',
        subtext: 'All Projects By Maintainability Grade',
        x: '80%',
        textAlign: 'center',
        textStyle: {
          color: [this.chartTitleColor],
        },
        subtextStyle: {
          color: [this.chartSubtextColor],
          fontSize: 15,
        },
      }],
      tooltip: {
        trigger: 'axis',
      },
      radar: [
        {
          name: {
            textStyle: {
              color: [this.chartSubtextColor],
              fontSize: 14,
            },
          },
          indicator: [
            { text: 'A', max: data.maxReliability },
            { text: 'B', max: data.maxReliability },
            { text: 'C', max: data.maxReliability },
            { text: 'D', max: data.maxReliability },
            { text: 'E', max: data.maxReliability },
          ],
          center: ['20%', '57%'],
          radius: 90,
        },
        {
          name: {
            textStyle: {
              color: [this.chartSubtextColor],
              fontSize: 14,
            },
          },
          indicator: [
            { text: 'A', max: data.maxSecurity },
            { text: 'B', max: data.maxSecurity },
            { text: 'C', max: data.maxSecurity },
            { text: 'D', max: data.maxSecurity },
            { text: 'E', max: data.maxSecurity },
          ],
          radius: 90,
          center: ['50%', '57%'],
        },
        {
          name: {
            textStyle: {
              color: [this.chartSubtextColor],
              fontSize: 14,
            },
          },
          indicator: [
            { text: 'A', max: data.maxMaintainability },
            { text: 'B', max: data.maxMaintainability },
            { text: 'C', max: data.maxMaintainability },
            { text: 'D', max: data.maxMaintainability },
            { text: 'E', max: data.maxMaintainability },
          ],
          center: ['80%', '57%'],
          radius: 90,
        },
      ],
      series: [
        {
          type: 'radar',
          tooltip: {
            trigger: 'item',
          },
          itemStyle: { normal: { areaStyle: { type: 'default' } } },
          data: [
            {
              value: data.reliabilityData,
              name: 'Projects',
            },
          ],
        },
        {
          type: 'radar',
          tooltip: {
            trigger: 'item',
          },
          itemStyle: { normal: { areaStyle: { type: 'default' } } },
          radarIndex: 1,
          data: [
            {
              value: data.securityData,
              name: 'Projects',
            },
          ],
        },
        {
          type: 'radar',
          tooltip: {
            trigger: 'item',
          },
          radarIndex: 2,
          itemStyle: { normal: { areaStyle: { type: 'default' } } },
          data: [
            {
              value: data.maintainabilityData,
              name: 'Projects',
            },
          ],
        },
      ],
    };
  }

  getDataForRadarChart(obj) {
    const result = [];

    if (!obj) {
      return result;
    }

    Object.keys(obj).forEach((x) => {
      result.push(obj[x]);
    });
    return result;
  }

  multiArraySecondColumnDesc(a, b) {
    if (a[1] === b[1]) {
      return 0;
    }
    return (a[1] > b[1]) ? -1 : 1;
  }

  buildOrganizations(orgs) {
    orgs.sort();
    let organizations = [];
    let allName = 'All'+(orgs.length > 0 ? ' ('+orgs.length+')' : '');
    organizations.push({id:0, name: allName});
    for(let i=0; i<orgs.length; i++) {
      organizations.push({ id: i+1, name: orgs[i] });
    }
    return organizations;
  }

  organizationChanged(selectedOrganization) {
    if (selectedOrganization.id == 0) {
      this.organizationTitle = 'Organizations';
      this.getData('All');
    } else {
      this.organizationTitle = 'Organization';
      this.getData(selectedOrganization.name);
    }
  }

}
