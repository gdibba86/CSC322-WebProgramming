const db = require('../db');

exports.getTasks = async (req, res) => {
    const userId = req.user.id;
    const { status, sort } = req.query;

    let query = 'SELECT * FROM tasks WHERE user_id = ?';
    const params = [userId];

    if (status) {
        query += ' AND status = ?';
        params.push(status);
    }

    if (sort === 'due_date') {
        query += ' ORDER BY due_date ASC';
    } else if (sort === 'created_at') {
        query += ' ORDER BY created_at DESC';
    }

    try {
        const [tasks] = await db.execute(query, params);
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createTask = async (req, res) => {
    const { title, description, due_date } = req.body;
    const userId = req.user.id;

    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    try {
        const [result] = await db.execute(
            'INSERT INTO tasks (user_id, title, description, due_date) VALUES (?, ?, ?, ?)',
            [userId, title, description, due_date]
        );

        const newTask = {
            id: result.insertId,
            user_id: userId,
            title,
            description,
            status: 'pending',
            due_date,
            created_at: new Date()
        };

        res.status(201).json(newTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateTask = async (req, res) => {
    const taskId = req.params.id;
    const { title, description, status, due_date } = req.body;
    const userId = req.user.id;

    try {
        // Check if task belongs to user
        const [tasks] = await db.execute('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId]);

        if (tasks.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await db.execute(
            'UPDATE tasks SET title = ?, description = ?, status = ?, due_date = ? WHERE id = ?',
            [title, description, status, due_date, taskId]
        );

        res.json({ message: 'Task updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteTask = async (req, res) => {
    const taskId = req.params.id;
    const userId = req.user.id;

    try {
        const [result] = await db.execute('DELETE FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
