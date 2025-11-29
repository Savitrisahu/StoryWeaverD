const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();

// Models
const Story = require('./models/storyBackend');
const User = require('./models/user');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Session setup
app.use(session({
    secret: 'Savitri7@',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Make user available in EJS
app.use((req, res, next) => {
    res.locals.user = req.session.username || null;
    next();
});

// MongoDB connection
// mongoose.connect('mongodb://localhost:27017/mydb')
mongoose.connect('mongodb+srv://gunjan11normal_db_user:ErceBYMPef4na7We@cluster0.wfzf9os.mongodb.net/mydb')

    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

// Login protection
function requireLogin(req, res, next) {
    if (!req.session.userId) return res.redirect('/login');
    next();
}

/* ----------- ROUTES ------------ */

// Home page
app.get('/index', async (req, res) => {
    const stories = await Story.find().limit(3);
    res.render('index', { stories });
});

// Library
app.get('/library', async (req, res) => {
    const genreFilter = req.query.genre;

    const stories = await Story.find();

    const genres = [
        "Horror", "Mystery", "Action", "Sci-Fi", "Romance", "Fantasy",
        "Comedy", "Adventure", "Historical", "Children"
    ];

    const genreCounts = { all: stories.length };
    genres.forEach(g => {
        genreCounts[g] = stories.filter(story => story.genre === g).length;
    });

    const filteredStories = genreFilter
        ? stories.filter(s => s.genre === genreFilter)
        : stories;

    res.render('library', { stories: filteredStories, genreCounts });
});

// Genre page
app.get('/StoryGenrePage', async (req, res) => {
    const genre = req.query.genre || 'All';
    let stories = genre === 'All' ? await Story.find() : await Story.find({ genre });
    res.render('storyGenrePage', { stories, genre });
});

// Single story
app.get('/story/:id', async (req, res) => {
    const story = await Story.findById(req.params.id);
    if (!story) return res.send('Story not found');
    res.render('story', { story });
});

// Submit page
app.get('/submit', requireLogin, (req, res) => res.render('submit'));

// Submit POST
app.post('/Story-Submit', requireLogin, async (req, res) => {
    const { storyTitle, AuthorName, Genre, StoryContent } = req.body;
    const story = new Story({ title: storyTitle, author: AuthorName, genre: Genre, content: StoryContent });
    await story.save();
    res.redirect('/library');
});

// SIGNUP — AUTO LOGIN
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) return res.send("Username or email already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    // Auto login after signup
    req.session.userId = user._id;
    req.session.username = user.username;

    res.redirect('/index');
});

// LOGIN
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.send("User not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.send("Invalid password");

    req.session.userId = user._id;
    req.session.username = user.username;

    res.redirect('/index');
});

// LIKE STORY
app.post('/like/:storyId', requireLogin, async (req, res) => {
    try {
        const storyId = req.params.storyId;
        const user = await User.findById(req.session.userId);

        if (!user.likedStories.includes(storyId)) {
            user.likedStories.push(storyId);
            await user.save();
        }

        const story = await Story.findById(storyId);
        story.likes += 1;
        await story.save();

        res.json({ likes: story.likes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// MARK READ
app.post('/read/:storyId', requireLogin, async (req, res) => {
    try {
        const storyId = req.params.storyId;
        const user = await User.findById(req.session.userId);

        if (!user.readStories.includes(storyId)) {
            user.readStories.push(storyId);
            await user.save();
        }

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// MY LIBRARY
app.get('/myLibrary', requireLogin, async (req, res) => {
    const user = await User.findById(req.session.userId)
        .populate('likedStories')
        .populate('readStories');

    res.render('myLibrary', {
        likedStories: user.likedStories,
        readStories: user.readStories
    });
});

// LOGIN PAGE
app.get('/login', (req, res) => {
    res.render('login');
});

// SIGNUP PAGE
app.get('/signUp', (req, res) => {
    res.render('signUp');
});

// Unlike
app.post('/unlike/:storyId', requireLogin, async (req, res) => {
    const user = await User.findById(req.session.userId);
    user.likedStories = user.likedStories.filter(id => id != req.params.storyId);
    await user.save();
    res.redirect('/myLibrary');
});

// Unread
app.post('/unread/:storyId', requireLogin, async (req, res) => {
    const user = await User.findById(req.session.userId);
    user.readStories = user.readStories.filter(id => id != req.params.storyId);
    await user.save();
    res.redirect('/myLibrary');
});

// LOGOUT
app.get('/logout', requireLogin, (req, res) => {
    req.session.destroy(err => {
        if (err) return res.send('Error logging out');
    });
    res.redirect('/login');
});

// DELETE ACCOUNT
app.delete("/delete-account", requireLogin, async (req, res) => {
    try {
        const userId = req.session.userId;
        await User.findByIdAndDelete(userId);

        req.session.destroy(err => {
            if (err) return res.status(500).send("Error destroying session");
            res.status(200).send("Account deleted");
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting account");
    }
});

// Check login (used in navbar)
app.get("/current-user", (req, res) => {
    if (req.session.userId) {
        res.json({ loggedIn: true, username: req.session.username });
    } else {
        res.json({ loggedIn: false });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
