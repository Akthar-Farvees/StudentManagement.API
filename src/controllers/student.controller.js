const { sql } = require('../config/dbConfig');

const getUsers = async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM Students');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: 'Database query failed', error });
    }
};

const addUser = async (req, res) => {
    const { name, email } = req.body;
    try {
        await sql.query(`INSERT INTO Students (name, email) VALUES ('${name}', '${email}')`);
        res.status(201).json({ message: 'User added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Database query failed', error });
    }
};

module.exports = { getUsers, addUser };
