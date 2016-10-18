import { DialogService } from 'aurelia-dialog';
import { inject } from 'aurelia-framework';
import { ReadmeModal } from 'components/modals/readme-modal';
import { ContributorsModal } from 'components/modals/contributors-modal.js';
import { FeedbackModal } from 'components/modals/feedback-modal.js';
import { StageConfig } from '../stageConf';

@inject(DialogService, StageConfig)
export class App {
  configureRouter(config, router) {
    config.title = 'Stage';
    config.options.pushState = false;
    config.map([
      { route: '', name: 'popular', viewPorts: { mainContent: { moduleId: 'popular/popular' }, headerContent: { moduleId: 'search/search-bar' } }, nav: true, title: 'Home' },
      { route: 'explore', name: 'explore', viewPorts: { mainContent: { moduleId: 'explore/explore' }, headerContent: { moduleId: 'components/headers/generic-title' } }, nav: true, title: 'Explore', settings: { desc: 'Browse 100s of projects and discover your InnerSource' } },
      { route: 'insight', name: 'insight', viewPorts: { mainContent: { moduleId: 'insight/insight' }, headerContent: { moduleId: 'components/headers/generic-title' } }, nav: true, title: 'Insight', settings: { desc: 'Software Oriented Data Analysis (SODA)', altTitle: 'Enterprise Insight' } },
      { route: 'results', name: 'results', viewPorts: { mainContent: { moduleId: 'search/results' }, headerContent: { moduleId: 'search/search-bar-secondary' } }, nav: false, title: 'Search Results' },
      { route: 'project-details', name: 'project-details', viewPorts: { mainContent: { moduleId: 'project-details/project-details' }, headerContent: { moduleId: 'components/headers/project-details-header' } }, nav: false, title: 'Project Details' },
    ]);
    this.router = router;
  }

  constructor(dialogService) {
    this.dialogService = dialogService;
    this.stageConfig = StageConfig;
  }

  openReadmeModal(repo) {
    this.dialogService.open({ viewModel: ReadmeModal, model: repo });
  }

  openContribModal(repo) {
    this.dialogService.open({ viewModel: ContributorsModal, model: repo });
  }

  openFeedbackModal() {
    this.dialogService.open({ viewModel: FeedbackModal });
  }
}
