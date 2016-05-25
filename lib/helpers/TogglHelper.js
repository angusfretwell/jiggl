import debug from 'debug';
import toggl from 'toggl-got';
import { JaroWinklerDistance as distance } from 'natural';
import { Config } from '../models/Config';
import configTypes from '../constants/configTypes';

const { PROJECT_MAPPINGS } = configTypes;
const { TOGGL_WORKSPACE_ID } = process.env;

export default class TogglHelper {
  static debug(message) {
    debug('jiggl:TogglHelper')(message);
  }

  static async getProjectByName(name) {
    this.debug('getProjectByName called');
    const projects = await toggl(`workspaces/${TOGGL_WORKSPACE_ID}/projects`);

    const [project] = projects.body.sort((a, b) =>
      distance(b.name, name) - distance(a.name, name)
    );

    if (distance(project.name, name) < 0.9) {
      this.debug('string distance below threshold');
      return null;
    }

    return project;
  }

  static async getProjectById(id) {
    this.debug('getProjectById called');
    const { body } = await toggl(`projects/${id}`);
    return body.data;
  }

  static async createTask(task) {
    this.debug('createTask called');
    return await toggl.post('tasks', {
      body: JSON.stringify({ task }),
    });
  }

  static async updateTask(id, task) {
    this.debug('updateTask called');
    return await toggl.put(`tasks/${id}`, {
      body: JSON.stringify({ task }),
    });
  }

  static async createProject(project) {
    this.debug('createProject called');
    return await toggl.post('projects', {
      body: JSON.stringify({ project }),
    });
  }

  static async getProject({ key, name }) {
    this.debug('getProject called');
    let togglProject;
    let map = await new Config({ key: PROJECT_MAPPINGS }).fetch();

    if (!map) {
      this.debug('no project map found, initializing one');
      map = new Config({
        key: PROJECT_MAPPINGS,
        value: [],
      });
    }

    const [togglPid] = map.get('value').filter(m => m.jiraKey === key).map(m => m.togglPid);

    if (togglPid) {
      this.debug('mapped toggl project found');
      togglProject = await TogglHelper.getProjectById(togglPid);
    }

    // If mapped project was not found, try to find project by name
    if (!togglProject) {
      togglProject = await TogglHelper.getProjectByName(name);
    }

    // Create a new project if we couldn't find one
    if (!togglProject) {
      this.debug('no toggl project found, creating one');
      const response = await TogglHelper.createProject({ name });
      togglProject = response.body.data;

      map.get('value').push({
        togglPid: togglProject.id,
        jiraKey: key,
      });

      await map.save();
    }

    return togglProject;
  }
}
