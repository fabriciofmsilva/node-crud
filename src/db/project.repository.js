class ProjectRepository {
  constructor(dao) {
    this.dao = dao;
  }

  createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT
      )
    `;
    return this.dao.run(sql);
  }

  create(name) {
    return this.dao.run(
      'INSERT INTO projects (name) VALUES (?)',
      [name]
    );
  }

  delete(id) {
    return this.dao.run(
      'DELETE FROM projects WHERE id = ?',
      [id]
    );
  }

  getAll() {
    return this.dao.all('SELECT * FROM projects');
  }

  getById(id) {
    return this.dao.get(
      'SELECT * FROM projects WHERE id = ?',
      [id]
    );
  }

  getTasks(projectId) {
    return this.dao.all(
      'SELECT * FROM tasks WHERE projectId = ?',
      [projectId]
    );
  }

  update({id, name}) {
    return this.dao.run(
      'UPDATE projects SET name = ? WHERE id = ?',
      [name, id]
    );
  }
}

module.exports = ProjectRepository;
