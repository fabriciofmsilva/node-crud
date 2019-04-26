const AppDAO = require('./dao');
const ProjectRepository = require('./project.repository');
const TaskRepository = require('./task.repository');

function main() {
  const dao = new AppDAO('./database.sqlite3');
  const blogProjectData = { name: 'Write Node.js - SQLite Tutoriral' };
  const projectRepo = new ProjectRepository(dao);
  const taskRepo = new TaskRepository(dao);
  let projectId

  projectRepo.createTable()
    .then(() => taskRepo.createTable())
    .then(() => projectRepo.create(blogProjectData.name))
    .then((data) => {
      console.log(data)
      projectId = data.id;
      const tasks = [
        {
          name: 'Outline',
          description: 'High level overview of sections',
          isComplete: 1,
          projectId
        },
        {
          name: 'Write',
          description: 'Write article contents and code examples',
          isComplete: 0,
          projectId
        }
      ]

      return Promise.all(tasks.map((task) => {
        return taskRepo.create(task);
      }));
    })
    .then(() => projectRepo.getById(projectId))
    .then((project) => {
      console.log(`\nRetreived project from database`)
      console.log(`project id = ${project.id}`)
      console.log(`project name = ${project.name}`)
      return projectRepo.getTasks(project.id)
    })
    .then((tasks) => {
      console.log('\nRetrieved project tasks from database')
      return new Promise((resolve, reject) => {
        tasks.forEach((task) => {
          console.log(`task id = ${task.id}`)
          console.log(`task name = ${task.name}`)
          console.log(`task description = ${task.description}`)
          console.log(`task isComplete = ${task.isComplete}`)
          console.log(`task projectId = ${task.projectId}`)
        })
      })
      resolve('success')
    })
    .catch((err) => {
      console.log('Error: ')
      console.log(JSON.stringify(err))
    })
}

main();
