const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();

const winston = require('./config/winston');

const AppDAO = require('./db/dao');
const ProjectRepository = require('./db/project.repository');
const TaskRepository = require('./db/task.repository');

const dao = new AppDAO('./database.sqlite3');
const blogProjectData = { name: 'Write Node.js - SQLite Tutoriral' };
const projectRepo = new ProjectRepository(dao);
const taskRepo = new TaskRepository(dao);

const PORT = 8080;
const HOST = '0.0.0.0';

app.use(morgan('combined', {
  stream: winston.stream,
}));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Works!\n');
});

app.get('/project/:id', (req, res) => {
  projectRepo.getById(req.params.id)
    .then((project) => {
      res.json(project);
    });
});

app.get('/project/:id/tasks', (req, res) => {
  projectRepo.getById(req.params.id)
    .then((project) => {
      projectRepo.getTasks(project.id)
        .then((tasks) => {
          res.json(tasks);
        });
    });
});

function init() {
  app.listen(PORT, HOST, () => {
    winston.log(`Server is running on http://${HOST}:${PORT}`);
  });
}

function main() {
  let projectId;

  projectRepo.createTable()
    .then(() => taskRepo.createTable())
    .then(() => projectRepo.create(blogProjectData.name))
    .then((data) => {
      winston.log(data);
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
      ];

      return Promise.all(tasks.map((task) => {
        return taskRepo.create(task);
      }));
    })
    .then(() => projectRepo.getById(projectId))
    .then((project) => {
      winston.log('\nRetreived project from database');
      winston.log(`project id = ${project.id}`);
      winston.log(`project name = ${project.name}`);
      return projectRepo.getTasks(project.id);
    })
    .then((tasks) => {
      winston.log('\nRetrieved project tasks from database');
      return new Promise((resolve) => {
        tasks.forEach((task) => {
          winston.log(`task id = ${task.id}`);
          winston.log(`task name = ${task.name}`);
          winston.log(`task description = ${task.description}`);
          winston.log(`task isComplete = ${task.isComplete}`);
          winston.log(`task projectId = ${task.projectId}`);
          resolve('success');
        });
      });
    })
    .then(() => init())
    .catch((err) => {
      winston.error('Error: ');
      winston.error(JSON.stringify(err));
    });
}

main();
