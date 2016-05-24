import toggl from 'toggl-got';
import { JaroWinklerDistance as distance } from 'natural';
import { Config } from '../models/Config';
import configTypes from '../constants/configTypes';

const { PROJECT_MAPPINGS } = configTypes;
const { TOGGL_WORKSPACE_ID } = process.env;

export default class TogglHelper {
  static async getProjectByName(name) {
    const projects = await toggl(`workspaces/${TOGGL_WORKSPACE_ID}/projects`);

    const [project] = projects.body.sort((a, b) =>
      distance(b.name, name) - distance(a.name, name)
    );

    if (distance(project.name, name) < 0.9) {
      return null;
    }

    return project;
  }

  static async getProjectById(id) {
    const { body } = await toggl(`projects/${id}`);
    return body.data;
  }

  static async createTask(task) {
    return await toggl.post('tasks', {
      body: JSON.stringify({ task }),
    });
  }

  static async updateTask(id, task) {
    return await toggl.put(`tasks/${id}`, {
      body: JSON.stringify({ task }),
    });
  }

  static async createProject(project) {
    return await toggl.post('projects', {
      body: JSON.stringify({ project }),
    });
  }

  static async getProject({ key, name }) {
    let togglProject;
    let map = await new Config({ key: PROJECT_MAPPINGS }).fetch();

    if (!map) {
      map = new Config({
        key: PROJECT_MAPPINGS,
        value: [],
      });
    }

    const [togglPid] = map.get('value').filter(m => m.jiraKey === key).map(m => m.togglPid);

    if (togglPid) {
      togglProject = await TogglHelper.getProjectById(togglPid);
    }

    // If mapped project was not found, try to find project by name
    if (!togglProject) {
      togglProject = await TogglHelper.getProjectByName(name);
    }

    // Create a new project if we couldn't find one
    if (!togglProject) {
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
