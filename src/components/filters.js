export class Filters {
  constructor() {
    this.selectedCategories = []
    this.selectedOrganizations = [];
    this.selectedLanguages = [];
  }

  getUniqueValues(array, property) {
    const propertyArray = [];
    for (const object of array) {
      let v = this.getNested(object, property);
      if (v) {
        propertyArray.push(v);
      } else {
        propertyArray.push('None');
      }
    }
    return Array.from(new Set(propertyArray));
  }

  getNested(obj, prop) {
    let props = prop.split('.');
    let result = props.reduce((o, level) => o && o[level], obj);
    return result;
  }

  toggleOrg(event, projects) {
    this.selectedOrganizations = [];
    if (event.target.checked) {
      this.selectedOrganizations = this.getUniqueValues(projects, 'sourceData.owner.name');
    }
  }

  toggleLang(event, projects) {
    this.selectedLanguages = [];
    if (event.target.checked) {
      this.selectedLanguages = this.getUniqueValues(projects, 'sourceData.language');
    }
  }

  countProjectsInCategory(projects, categoryId) {
    let f = projects.filter((x) => {
      return x.codehubData && x.codehubData.categories && x.codehubData.categories.includes(categoryId);
    });
    return f.length;
  }

  // Counts number of results with a value for a certain property
  // (e.g. number of results with 'java' as a 'language' would be countUniqueValues(results, 'language', 'java')
  countUniqueValues(array, property, value) {
    let count = 0;
    for (const object of array) {
      let v = this.getNested(object, property);
      if (v) {
        if (v === value) {
          count++;
        }
      } else if(value == 'None') {
        count++;
      }
    }
    return count;
  }

  filterArray(array, filterArray, propertyName) {
    if (filterArray.length === 0)
      return array;

    let result =  array
      .slice()
      .filter((object) => {
        for (const value of filterArray) {
          let v = this.getNested(object, propertyName);
          if (v) {
            if (v === value) {
              return true;
            }
          } else if (value === 'None') {
            return true;
          }
        }
        return false;
      });

    return result;
  }

  filterArrayCategories(array, selectedCategories) {
    if (selectedCategories.length === 0) {
      return array;
    }

    let result = array.slice().filter( (project) => {
      for(const category of selectedCategories) {
        const categoryId = this.getDataFromPipedString(category,0);
        if (project.codehubData.categories && project.codehubData.categories.length > 0 && project.codehubData.categories.includes(categoryId)) {
          return true;
        }
      }
      return false;
    });
    return result;
  }

  getDataFromPipedString(data, index) {
    if (!data || data == '' || !data.includes('|')) {
      return null;
    }
    let parts = data.split('|');
    if (index >= parts.length) {
      return null;
    }

    return parts[index];
  }

  buildFilterCategories(categories, projects) {
    let options = [];
    for (const category of categories) {
      let count = this.countProjectsInCategory(projects, category.id);
      if(count == 0) {
        continue;
      }
      let op = {
        id: category.id,
        option: category.name.trim(),
        subtext: `(${count})`,
        count: count
       }
       options.push(op);
    }
    options.sort((a,b) => (a.option >= b.option) ? 1 : -1);
    return options;
  }

  buildFilterOrganizations(projects) {
    let options = [];
    const unique = this.getUniqueValues(projects, 'sourceData.owner.name');
    for (const org of unique) {
      let count = this.countUniqueValues(projects, 'sourceData.owner.name', org)
      let op = {
        id: org,
        option: org,
        subtext: `(${count})`
      };
      options.push(op);
    }
    options.sort((a,b) => (a.option >= b.option) ? 1 : -1);
    return options;
  }

  buildFilterLanguages(projects) {
    let options = [];
    const unique = this.getUniqueValues(projects, 'sourceData.language');
    for (const lang of unique) {
      let count = this.countUniqueValues(projects, 'sourceData.language', lang);
      let op = {
        id: lang,
        option: lang,
        subtext: `(${count})`
      }
      options.push(op);
    }
    options.sort((a,b) => (a.option > b.option) ? 1 : -1);
    return options;
  }

  clearAllFilters() {
    this.selectedCategories.splice(0, this.selectedCategories.length);
    this.selectedOrganizations.splice(0, this.selectedOrganizations.length);
    this.selectedLanguages.splice(0, this.selectedLanguages.length);

    let fc = document.querySelector('#filterCategories') ? document.querySelector('#filterCategories').au.controller.viewModel : null;
    if(fc) {
      fc.picker.methods.deselectAll();
    }

    let fo = document.querySelector('#filterOrganizations') ? document.querySelector('#filterOrganizations').au.controller.viewModel : null;
    if(fo) {
      fo.picker.methods.deselectAll();
    }

    let fl = document.querySelector('#filterLanguages') ? document.querySelector('#filterLanguages').au.controller.viewModel : null;
    if(fl) {
      fl.picker.methods.deselectAll();
    }
  }

  removePill(ms, value) {
    let sel = document.querySelector(ms).au.controller.viewModel;
    if(sel) {
      let v = value;
      if(ms == '#filterCategories') {
        v = value.split('|')[0];
      }
      let values = sel.picker.methods.val().filter(x => x != v);
      sel.picker.methods.val(values);
    }
  }

}
