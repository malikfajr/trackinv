const db = require('./src/app/db');

(async () => {
  try {
    const users = await db.query('SELECT * FROM users WHERE status = 1', {
      type: db.QueryTypes.SELECT,
    });

    users.forEach(async (user) => {
      const { id } = user;
      const membership = await db.query(
        'SELECT * FROM memberships WHERE userId = :id ORDER BY  createdAt DESC LIMIT 1',
        {
          type: db.QueryTypes.SELECT,
          replacements: { id },
        }
      );

      if (membership.length > 0) {
        const { expiryDate } = membership[0];
        const currentDate = new Date();

        if (currentDate > expiryDate) {
          await db.query('UPDATE users SET status = 0 WHERE id = :id', {
            replacements: { id },
          });
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
})();

console.log('Reset done');
