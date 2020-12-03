import { inject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';
import $ from 'jquery';
import { DataContext } from 'services/datacontext';

@inject(DialogController, DataContext)
export class AddProjectsModal {
  constructor(controller, dataContext) {
    this.controller = controller;
    controller.settings.centerHorizontalOnly = true;
    controller.settings.lock = false;

    this.dataContext = dataContext;
    this.projects = [];

    this.orgFormInput = '';
    this.nameFormInput = '';

    this.selectedProjects = [];
    this.selectedProjectsEmpty = true;
    this.hasFocus = true;
  }

  getData() {
    return this.dataContext.getRepositories(null)
      .then(projects => {
          this.rebuildProjectSelect(projects);
          $('#selectProjects').click();
          $('#addproject-dialog').focus();
          return this.projects;
      })
      .catch((e) => {console.log(e);});
  }

  activate() {
    this.getData();
  }

  attached() {
    this.setupProjectSelect();
    this.rebuildProjectSelect(this.projects);
    this.hasFocus = true;
  }

  rebuildProjectSelect(projects) {
    const options = [];
    projects.sort((a, b) => a.sourceData.name >= b.sourceData.name ? 1 : -1);
    for (let i = 0; i < projects.length; i++) {
      options.push({
        label: `${projects[i].sourceData.name} <small>(${projects[i].sourceData.owner.name})</small>`,
        title: projects[i].sourceData.name,
        value: i,
        selected: false,
      });
    }
    $('#selectProjects').multiselect('dataprovider', options);
    $('#selectProjects').trigger('change');
    $('.multiselect-container').css('display', 'block');
    $('.multiselect').click(e => {
      e.stopPropagation();
    });
    return options;
  }

  setupProjectSelect() {
    $('#selectProjects').multiselect({
      enableFiltering: true,
      disableIfEmpty: true,
      enableCaseInsensitiveFiltering: true,
      maxHeight: 250,
      enableHTML: true,
      buttonText(options, select) {
        return 'Projects';
      },
    });

    $('#selectProjects').on('change', ev => {
      if ($('#selectProjects').val()) {
        this.selectedProjects = $('#selectProject').val();
        this.selectedProjectsEmpty = false;
      } else {
        this.selectedProjects = [];
        this.selectedProjectsEmpty = true;
      }
    });
  }

  addProject() {
    if ($('.nav-tabs .active').attr('id') === 'search_select') {
      const proj = this.projects[$('#selectProjects').val()];
      const postData = {
        id: proj.id,
        name: proj.project_name,
        org_name: proj.organization,
      };
      this.controller.ok(postData);
    } else {
      const postData = {
        name: this.nameFormInput,
        org_name: this.orgFormInput,
      };
      this.controller.ok(postData);
    }
  }


}
