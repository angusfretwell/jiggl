import toggl from 'toggl-got';
import { JaroWinklerDistance as distance } from 'natural';

const { TOGGL_WORKSPACE_ID } = process.env;

export default class TogglHelper {
  static async getProject(name) {
    const projects = await toggl(`workspaces/${TOGGL_WORKSPACE_ID}/projects`);

    const [project] = projects.body.sort((a, b) =>
      distance(b.name, name) - distance(a.name, name)
    );

    if (distance(project.name, name) < 0.9) {
      return null;
    }

    return project;
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
}
