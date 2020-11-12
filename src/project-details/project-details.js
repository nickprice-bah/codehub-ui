import { inject, computedFrom } from 'aurelia-framework';
import { Router, activationStrategy } from 'aurelia-router';
import { DataContext } from 'services/datacontext';
import { StageConfig } from 'stageConf';
import { NO_DESCRIPTION_MESSAGE, NO_SONAR_DATA_MESSAGE } from 'constants/ch-constants';
import { DialogFunctions } from 'resources/shared/dialog-functions';

@inject(DataContext, Router, StageConfig, DialogFunctions)
export class ProjectDetails {

  constructor(dataContext, router, stageConfig, dialogFunctions) {
    this.dataContext = dataContext;
    this.router = router;
    this.stageConfig = stageConfig;
    this.dialogFunctions = dialogFunctions;

    this.repo = {};
    this.repo.contributors_list = [];
    this.similarProjects = [];
    this.componentDependencies = [];
    this.projectsThatUseUs = [];
    this.releases = [];
    this.downloads = 0;
    this.noSonarData = false;
    this.noSonarDataMessage = NO_SONAR_DATA_MESSAGE;

    this.sonarLink = '';

    this.dependCollapsed = true;
    this.useUsCollapsed = true;
    this.numDepends = 8;
    this.exitDialogLinkId = null;
    this.openReadmeLinkId = null;
    this.addProjectLinkId = null;
    this.contributorsLinkid = null;

    this.health = {};

    this.badge_status_image = '/img/pending_review_final_29w_35h.svg';
  }

  determineActivationStrategy() {
    return activationStrategy.replace;
  }

  activate(params) {
    document.body.scrollTop = document.documentElement.scrollTop = 0;

    this.dataContext.findById(params.id).then(repo => {
      if (!repo) {
        return;
      }
      this.repo = repo;
      this.projectsThatUseUs = repo.sourceData.forks;

      this.releases = this.repo.sourceData.releases;
      this.releases.forEach(r => { this.downloads += r.total_downloads; });

      if (repo.codehubData.badges && repo.codehubData.badges.status) {
        switch(repo.codehubData.badges.status.toLowerCase()) {
          case 'active':
            this.badge_status_image = '/img/active_flame_final_28w_35h.svg';
            break;
          case 'inactive':
            this.badge_status_image = '/img/inactive_zzz_final_32w_35h.svg';
            break;
          case 'pending':
              this.badge_status_image = '/img/pending_review_final_29w_35h.svg';
              break;
          case 'read-only':
              this.badge_status_image = '/img/lock_final_28w_35h.svg';
              break;
          default:
            this.badge_status_image = '/img/pending_review_final_29w_35h.svg';
        }
      }
      this.noSonarData = this.repo.generatedData.sonarMetrics &&
      this.repo.generatedData.sonarMetrics.ncloc &&
      !this.repo.generatedData.sonarMetrics.ncloc.key;

      this.health = this.repo.generatedData.sonarMetrics;

      this.noDependencies = this.projectsThatUseUs.length === 0;
    });

  }

  @computedFrom('repo.sourceData.description')
  get description() {
    return this.repo.sourceData && this.repo.sourceData.description ? this.repo.sourceData.description : NO_DESCRIPTION_MESSAGE;
  }
  get hasdescription() {
    return this.repo.sourceData && this.repo.sourceData.description ? true : false;
  }

  goBack() {
    history.back();
  }
}
