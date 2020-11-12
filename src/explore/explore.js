import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { DataContext } from 'services/datacontext';
import { Filters } from 'components/filters';

@inject(DataContext, Router, Filters)
export class Explore {

  constructor(dataContext, router, filters) {
    this.dataContext = dataContext;
    this.router = router;
    this.filters = filters;
    this.params = null;

    this.resultCount = 0;
    this.searchDone = false;

    this.projects = [];
    this.categories = [];
    this.categoriesFilter = [];
    this.organizationsFilter = [];
    this.languagesFilter = [];

    this.projectTitle = 'Explore';

    this.sortDirection = 'descending';
    this.selectedSort = 'stars';
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
    this.exitDialogLinkId = null;
  }

  activate(params) {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    this.params = params;
    this.searchDone = false;
    this.getData();
  }

  getData() {
    Promise.all([this.dataContext.getRepositories(null),this.dataContext.getCategories()]).then(response => {
      let projects = response[0];
      let categories = response[1];
      if (!projects) {
        this.searchDone = true;
        return;
      }

      this.projects = projects;
      this.categories = categories;
      this.categoriesFilter = this.filters.buildFilterCategories(this.categories, this.projects);
      this.organizationsFilter = this.filters.buildFilterOrganizations(this.projects);
      this.languagesFilter = this.filters.buildFilterLanguages(this.projects);
      this.filters.selectedCategories = [];
      this.filters.selectedOrganizations = [];
      this.filters.selectedLanguages = [];
      this.resultCount = this.projects.length;

      setTimeout(() => {
        this.manageParams();
        this.searchDone = true;
      }, 100);
    });

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
      this.filterOrgEmpty = false;
    } else {
      this.filters.selectedLanguages.splice(0, this.filters.selectedLanguages.length);
      this.filterOrgEmpty = true;
    }
    this.applyFilters();
  }

  applyFilters() {
    let filterArr = this.filters.filterArray(this.projects, this.filters.selectedLanguages, 'sourceData.language');
    filterArr = this.filters.filterArray(filterArr, this.filters.selectedOrganizations, 'sourceData.owner.name');
    filterArr = this.filters.filterArrayCategories(filterArr, this.filters.selectedCategories);
    this.resultCount = filterArr.length;
  }

  manageParams() {
    if (!this.params) {
      return;
    }

    if(this.params.category) {
      this.filters.selectedCategories = [this.params.category];
      let fc = document.querySelector('#filterCategories').au.controller.viewModel;
      if(fc) {
        let id = this.params.category.split('|')[0];
        fc.picker.methods.val([id]);
      }
    }
  }
}
