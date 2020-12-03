import {PLATFORM} from 'aurelia-pal';

export class App {
  configureRouter(config, router) {
    config.title = 'ITS CodeHub';
    config.map([
      { route: '', name: 'popular', viewPorts: { mainContent: { moduleId: PLATFORM.moduleName('popular/popular') }, headerContent: { moduleId: PLATFORM.moduleName('search/search-bar') } }, nav: true, title: 'Home', settings: { desc: '', isTopLevelMenu_noChildren: true}},
      { route: 'about', name: 'about', viewPorts: { mainContent: {moduleId: PLATFORM.moduleName('about/about') }, headerContent: { moduleId: PLATFORM.moduleName('components/headers/generic-title') } }, nav: true, title: 'About', settings: { desc: '', isTopLevelMenu_noChildren: true} },
      { route: 'explore', name: 'explore', viewPorts: { mainContent: { moduleId: PLATFORM.moduleName('explore/explore') }, headerContent: { moduleId: PLATFORM.moduleName('components/headers/generic-title') } }, nav: true, title: 'Explore', settings: { desc: '',isTopLevelMenu_noChildren: true} },
      { route: 'results', name: 'results', viewPorts: { mainContent: { moduleId: PLATFORM.moduleName('search/results') }, headerContent: { moduleId: PLATFORM.moduleName('search/search-bar-secondary') } }, nav: false, title: 'Search Results' },
      { route: 'project-details', name: 'project-details', viewPorts: { mainContent: { moduleId: PLATFORM.moduleName('project-details/project-details') }, headerContent: { moduleId: PLATFORM.moduleName('components/headers/project-details-header') } }, nav: false, title: 'Project Details', settings: { desc: '', isTopLevelMenu_noChildren: true }},
      { route: 'templates-and-guides', name: 'templates-and-guides', viewPorts: { mainContent: { moduleId: PLATFORM.moduleName('templates-and-guides/templates-and-guides') }, headerContent: { moduleId: PLATFORM.moduleName('components/headers/generic-title') }}, nav: true, title: 'Resources', settings: { desc: '', isTopLevelMenu_hasChildren: false, child: true, topLevelMenu_parentName: 'Resources', firstchild: true, menuitemLabel: 'Templates & Guides', headerLabel: 'Site Resources', displayheader: true}},
      { route: 'repopublishing', name: 'repopublishing', viewPorts: { mainContent: { moduleId: PLATFORM.moduleName('repopublishing/repopublishing')}, headerContent: { moduleId: PLATFORM.moduleName('components/headers/generic-title')}}, nav: true, title: 'Resources', settings: { desc: '', child: true, topLevelMenu_parentName: 'Resources', firstchild: false, menuitemLabel: 'Repository Registration', headerLabel: 'Site Resources'}},
      { route: 'metrics', name: 'metrics', viewPorts: { mainContent: { moduleId: PLATFORM.moduleName('metrics/metrics')}, headerContent: { moduleId: PLATFORM.moduleName('components/headers/generic-title')}}, nav: true, title: 'Resources', settings: { desc: '', child: true, topLevelMenu_parentName: 'Resources', firstchild: false, menuitemLabel: 'Metrics', headerLabel: 'Site Resources' }},
      { route: 'badges-about', name: 'badges-about', viewPorts: { mainContent: { moduleId: PLATFORM.moduleName('badges-about/badges-about')}, headerContent: { moduleId: PLATFORM.moduleName('components/headers/generic-title')}}, nav: true, title: 'Resources', settings: { desc: '', child: true, topLevelMenu_parentName: 'Resources', firstchild: false, menuitemLabel: 'About Badges', headerLabel: 'Site Resources' }},
      { route: 'faqs', name: 'faqs', viewPorts: { mainContent: { moduleId: PLATFORM.moduleName('faqs/faqs')}, headerContent: { moduleId: PLATFORM.moduleName('components/headers/generic-title')}}, nav: true, title: 'Resources', settings: { desc: '', child: true, topLevelMenu_parentName: 'Resources', firstchild: false, menuitemLabel: 'FAQs', headerLabel: 'Site Resources' }},
      { route: 'additional-information', name: 'additional-information', viewPorts: { mainContent: { moduleId: PLATFORM.moduleName('additional-information/additional-information')}, headerContent: { moduleId: PLATFORM.moduleName('components/headers/generic-title') }}, nav: true, title: 'Resources', settings: { desc: '', child: true, topLevelMenu_parentName: 'Resources', firstchild: false, menuitemLabel: 'Additional Information', headerLabel: 'Site Resources' }},
      { route: 'source-code-guidelines', name: 'source-code-guidelines', viewPorts: { mainContent: { moduleId: PLATFORM.moduleName('source-code-guidelines/source-code-guidelines')}, headerContent: { moduleId: PLATFORM.moduleName('components/headers/generic-title')}}, nav: true, title: 'Resources', settings:{desc: '', isTopLevelMenu_hasChildren: true, child: true, topLevelMenu_parentName: 'Resources', firstchild: true, menuitemLabel: 'Source Code Guidelines', headerLabel: 'Source Code Guidelines'}},
    ]);

    this.router = router;
  }
  scrollToTop() {
    window.scrollTo(0, 0);
  }
}
