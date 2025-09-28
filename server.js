const express = require('express');
const session = require('express-session');
require('dotenv').config();
const mongoose = require('./db/mongoose');
const User = require('./models/User');
const Task = require('./models/Task');
const passport = require('./middleware/passport-config');
const ensureAuthenticated = require('./middleware/auth-check');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, 
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    const newUser = new User({ email, password });
    await newUser.save();

    console.log(`[REGISTER] New user: ${email}`);
    res.send('Registration successful');
  } catch (err) {
    console.error('[REGISTER] Error:', err);
    res.status(500).send('Registration failed');
  }
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/protected',
  failureRedirect: '/login-failed'
}));

app.post('/tasks/add', ensureAuthenticated, async (req, res) => {
  const { title } = req.body;
  try {
    const newTask = new Task({
      title,
      owner: req.user._id
    });
    await newTask.save();
  res.redirect('/protected');
  } catch (err) {
    console.error('[TASK] Creation error:', err);
    res.status(500).send('Failed to create task');
  }
});

app.post('/tasks/delete/:id', ensureAuthenticated, async (req, res) => {
  try {
    const result = await Task.deleteOne({ _id: req.params.id, owner: req.user._id });
    if (result.deletedCount === 0) return res.status(403).send('Not allowed');
  res.redirect('/protected');
  } catch (err) {
    console.error('[TASK] Delete error:', err);
    res.status(500).send('Failed to delete task');
  }
});

app.post('/tasks/update/:id', ensureAuthenticated, async (req, res) => {
  const { title, completed } = req.body;
  try {
    const result = await Task.updateOne(
      { _id: req.params.id, owner: req.user._id },
      { $set: { title, completed: completed === 'true' } }
    );
    if (result.modifiedCount === 0) return res.status(403).send('Not allowed or no changes');
  res.redirect('/protected');
  } catch (err) {
    console.error('[TASK] Update error:', err);
    res.status(500).send('Failed to update task');
  }
});

app.post('/tasks/insert-many', ensureAuthenticated, async (req, res) => {
  const { tasks } = req.body;
  try {
    const withOwner = tasks.map(t => ({ ...t, owner: req.user._id }));
    const result = await Task.insertMany(withOwner);
    res.send(`Inserted ${result.length} tasks`);
  } catch (err) {
    console.error('[TASK] insertMany error:', err);
    res.status(500).send('Failed to insert tasks');
  }
});

app.post('/tasks/update-many', ensureAuthenticated, async (req, res) => {
  try {
    const result = await Task.updateMany(
      { owner: req.user._id, completed: false },
      { $set: { completed: true } }
    );
    res.send(`Updated ${result.modifiedCount} tasks`);
  } catch (err) {
    console.error('[TASK] updateMany error:', err);
    res.status(500).send('Failed to update tasks');
  }
});

app.post('/tasks/replace/:id', ensureAuthenticated, async (req, res) => {
  const { title, completed } = req.body;
  try {
    const replacement = {
      title,
      completed: completed === 'true',
      owner: req.user._id,
      createdAt: new Date()
    };
    const result = await Task.replaceOne(
      { _id: req.params.id, owner: req.user._id },
      replacement
    );
    if (result.modifiedCount === 0) return res.status(403).send('Not allowed or no changes');
    res.redirect('/protected');
  } catch (err) {
    console.error('[TASK] replaceOne error:', err);
    res.status(500).send('Failed to replace task');
  }
});

app.post('/tasks/delete-many', ensureAuthenticated, async (req, res) => {
  try {
    const result = await Task.deleteMany({ owner: req.user._id, completed: true });
    res.send(`Deleted ${result.deletedCount} completed tasks`);
  } catch (err) {
    console.error('[TASK] deleteMany error:', err);
    res.status(500).send('Failed to delete tasks');
  }
});

app.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).send('Logout error');
    res.redirect('/login.html');
  });
});

app.get('/protected', ensureAuthenticated, async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user._id }).sort({ createdAt: -1 });

    let html = `<h1>Protected Page</h1>
      <p>Welcome, ${req.user.email}</p>
      <a href="/add-task.html">➕ Add New Task</a>
      <h2>Your Tasks</h2>
      <ul>`;

    tasks.forEach(task => {
      html += `<li>
        ${task.title} ${task.completed ? '✅' : '❌'}
        <form action="/tasks/delete/${task._id}" method="POST" style="display:inline;">
          <button type="submit">🗑️</button>
        </form>
        <form action="/tasks/update/${task._id}" method="POST" style="display:inline;">
          <input type="text" name="title" value="${task.title}" required>
          <select name="completed">
            <option value="false" ${!task.completed ? 'selected' : ''}>❌</option>
            <option value="true" ${task.completed ? 'selected' : ''}>✅</option>
          </select>
          <button type="submit">💾</button>
        </form>
      </li>`;
    });

    html += `</ul><a href="/logout">Logout</a>`;
    res.send(html);
  } catch (err) {
    console.error('[TASK] Fetch error:', err);
    res.status(500).send('Failed to load tasks');
  }
});

app.get('/add-task.html', ensureAuthenticated, (req, res) => {
  res.sendFile(__dirname + '/public/add-task.html');
});

app.get('/login-failed', (req, res) => {
  res.send('Login failed. <a href="/login.html">Try again</a>');
});

app.get('/login.html', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

app.get('/register.html', (req, res) => {
  res.sendFile(__dirname + '/public/register.html');
});

app.get('/tasks/stream', ensureAuthenticated, (req, res) => {
    // Устанавливаем заголовки для потоковой передачи данных (JSON Lines или HTML)
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    
    // Получаем курсор, который будет перебирать задачи пользователя
    const taskCursor = Task.find({ owner: req.user._id }).cursor();

    res.write('Streaming tasks (one per line):\n');
    res.write('----------------------------------\n');

    //  итерирование по курсору
    taskCursor.eachAsync(task => {
        const taskInfo = `ID: ${task._id}, Title: "${task.title}", Completed: ${task.completed}\n`;
        res.write(taskInfo);
    }).then(() => {
        res.end('\n----------------------------------\nStream complete.');
    }).catch(err => {
        console.error('[CURSOR] Streaming error:', err);
        res.status(500).end('Streaming failed.');
    });
});

app.get('/tasks/stats', ensureAuthenticated, async (req, res) => {
    try {
        const stats = await Task.aggregate([
            { 
                $match: { owner: req.user._id } 
            },
            {
                $group: {
                    _id: null,
                    totalTasks: { $sum: 1 },
                    completedTasks: { 
                        $sum: { 
                            $cond: ['$completed', 1, 0]
                        }
                    },
                    earliestTask: { $min: '$createdAt' }, 
                    latestTask: { $max: '$createdAt' }   
                }
            },

            {
                $project: {
                    _id: 0,
                    totalTasks: 1,
                    completedTasks: 1,
                    pendingTasks: { $subtract: ['$totalTasks', '$completedTasks'] },
                    earliestTask: 1,
                    latestTask: 1
                }
            }
        ]);

        if (stats.length > 0) {
            res.status(200).send(stats[0]);
        } else {
            res.status(200).send({ totalTasks: 0, completedTasks: 0, pendingTasks: 0 });
        }
    } catch (err) {
        console.error('[AGGREGATION] Stats error:', err);
        res.status(500).send({ error: 'Failed to fetch task statistics' });
    }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
