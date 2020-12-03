import { inject } from 'aurelia-framework';
import { activationStrategy } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import { DataContext } from 'services/datacontext';
import { Filters } from 'components/filters';
import { StageConfig } from '../stageConf';

@inject(DataContext, Filters, EventAggregator, StageConfig)
export class Results {

  constructor(dataContext, filters, ea, stageConfig) {
    this.dataContext = dataContext;
    this.filters = filters;
    this.ea = ea;
    this.stageConfig = stageConfig;

    this.searchText = '';
    this.resultCount = 0;
    this.searchDone = false;

    this.projects = [];
    this.categories = [];
    this.categoriesFilter = [];
    this.organizationsFilter = [];
    this.languagesFilter = [];

    this.sortDirection = 'descending';

    this.selectedSort = 'default';
    this.sortOptions = [
      { value: 'generatedData.rank', name: 'Rank' },
      { value: 'sourceData.stars', name: 'Stars' },
      { value: 'sourceData.watchers', name: 'Watchers' },
      { value: 'sourceData.releases', name: 'Releases' },
      { value: 'sourceData.commits', name: 'Commits' },
      { value: 'sourceData.contributors', name: 'Contributors' },
      { value: 'sourceData.forksCount', name: 'Forks' }
    ];
    this.openReadmeLinkId = null;
    this.ariaLabel = '';
    this.exitDialogLinkId = null;
  }

  determineActivationStrategy() {
    return activationStrategy.replace; // Must be replace due to virtualization
  }

  activate(params) {
    this.projects = [];
    this.categories = [];
    this.searchDone = false;
    this.resultCount = 0;
    this.searchText = params.searchText;

    return Promise.all([this.dataContext.search(params.searchText), this.dataContext.getCategories()])
      .then(response => {
          this.projects = response[0] ? response[0] : [];
          this.categories = response[1] ? response[1] : [];
          this.resultCount = this.projects.length;
          this.searchDone = true;
          this.filters.selectedCategories = [];
          this.filters.selectedOrganizations = [];
          this.filters.selectedLanguages = [];
          this.categoriesFilter = this.filters.buildFilterCategories(this.categories, this.projects);
          this.organizationsFilter = this.filters.buildFilterOrganizations(this.projects);
          this.languagesFilter = this.filters.buildFilterLanguages(this.projects);
          this.ariaLabel = this.getResultsAriaLabel(this.resultCount, this.searchText);
          let searchResult = {text: params.searchText, count: this.resultCount};
          this.ea.publish('searchExecuted', searchResult);
          const resultsText = document.querySelector('#results-result-text');
          if(resultsText)
            resultsText.focus();
          return this.projects;
      });
  }

  getResultsAriaLabel(resultCount, searchText) {
    return `${resultCount} results for search text: ${searchText}`
  }

  categoriesChanged(val) {
    if(!val) {
      return;
    }
    if (val && val.length > 0) {
      this.filters.selectedCategories =  val.map(x => x.id+'|'+x.option);
      this.filterCategoriesEmpty = false;
    } else {
      this.filters.selectedCategories.splice(0, this.filters.selectedCategories.length);
      this.filterCategoriesEmpty = true;
    }
    this.applyFilters();
  }

  organizationsChanged(val) {
    if(!val) {
      return;
    }
    if (val && val.length > 0) {
      this.filters.selectedOrganizations =  val.map(x => x.option);
      this.filterOrgEmpty = false;
    } else {
      this.filters.selectedOrganizations.splice(0, this.filters.selectedOrganizations.length);
      this.filterOrgEmpty = true;
    }
    this.applyFilters();
  }

  languagesChanged(val) {
    if(!val) {
      return;
    }
    if (val && val.length > 0) {
      this.filters.selectedLanguages =  val.map(x => x.option);
      this.filterLanguageEmpty = false;
    } else {
      this.filters.selectedLanguages.splice(0, this.filters.selectedLanguages.length);
      this.filterLanguageEmpty = true;
    }
    this.applyFilters();
  }

  applyFilters() {
    let filterArr = this.filters.filterArray(this.projects, this.filters.selectedLanguages, 'sourceData.language');
    filterArr = this.filters.filterArray(filterArr, this.filters.selectedOrganizations, 'sourceData.owner.name');
    filterArr = this.filters.filterArrayCategories(filterArr, this.filters.selectedCategories);
    this.resultCount = filterArr.length;
  }

  detached() {
    this.ea.publish('detachResults');
  }
}
