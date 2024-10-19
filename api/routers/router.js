module.exports = (app, db) => {
  app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (error, results) => {
      if (error) return res.status(500).send(error);
      res.json(results);
    });
  });
};