import { inject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import { StageConfig } from '../stageConf';

const baseUrl = '/api/v1';

@inject(HttpClient, StageConfig)
export class DataContext {
  constructor(httpClient, stageConfig, env) {
    this.http = httpClient;
    this.stageConfig = stageConfig;
  }

  // TODO Wrap API calls in promises to catch errors

  getRepositories(owners) {
    let url = `${baseUrl}/repositories` + (owners ? `?owner=${owners}` : '');
    return this.http.fetch(url, {
      method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
      if(data.code == 200) {
          return data.result;
        }
        return null;
      });
  }

  findPopular() {
    return this.http.fetch(`${baseUrl}/repositories?limit=6&rank=popular`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        if (data.code == 200) {
          return data.result;
        }
        return null;
      })
      .catch( e => { return null; });
  }

  findFeatured() {
    return this.http.fetch(`${baseUrl}/repositories?limit=5&rank=featured`, {
      method: 'GET'
    })
    .then( (response) => response.json())
    .then( data => {
      if (data.code == 200) {
        return data.result;
      }
      return null;
    })
    .catch( e => {return null;});
  }

  getMetrics(organizations) {
    let url = `${baseUrl}/metrics` + (organizations ? `/${organizations}` : '')
    return this.http.fetch(url, {
      method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
      if (data.code == 200) {
          return data.result;
        }
        return null;
      });
  }

  search(searchText) {
    let searchObj = {
      term: searchText,
      limit: 1000,
      matchAll: false
    }
    return this.http.fetch(`${baseUrl}/search`, {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        'Accept': 'application/json'
      },
      body: json(searchObj),
    })
      .then(response => response.json())
      .then(data => {
        if (data.code == 200) {
          return data.result;
        }
        return null;
      });
  }

  findById(id) {
    const adjustedURL = `${baseUrl}/repositories/${id}`;
    return this.http.fetch(adjustedURL)
      .then(response => response.json())
      .then(data => {
        if (data.code == 200 && data.result.length>0 ) {
          return data.result[0];
        }
        return null;
      });
  }

  findByIds(ids) {
    return this.http.fetch(`${baseUrl}/repositories/${ids}`)
      .then(response => response.json())
      .then(data => {
        if (data.code == 200 && data.result.length>0) {
          return data.result;
        }
        return null;
      });
  }

  postUsedProject(postObject, id) {
    return this.http.fetch(`${baseUrl}/addForkedProjects/${id}`, {
      method: 'POST',
      body: json(postObject),
    })
    .then(response => response.json())
    .then(data => {
      if (data.code == 200) {
        return data.result;
      }
      return null;
    });
  }

  registerUserEmail(email) {
    let payload = {
      'email': email,
      'listId': this.stageConfig.EMAIL_LISTID
    }
    return this.http.fetch(`/apicc/v1/contacts`, {
      method: 'POST',
      body: json(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      if (response && response.ok) {
        let jObj = response.json();

        return jObj;
      }
      return null;
    });
  }

  getCategories() {
    let url = `${baseUrl}/configurations/categories`;
    return this.http.fetch(url, {
      method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
      if(data.code == 200) {
          return data.result;
        }
        return null;
      });
  }

  getEngagementPopups() {
    let url = `${baseUrl}/configurations/engagementpopups`;
    return this.http.fetch(url, {
      method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
      if(data.code == 200) {
          return data.result;
      }
      return [];
    });
  }
}
