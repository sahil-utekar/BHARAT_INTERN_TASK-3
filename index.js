const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/money_tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Expense model
const Expense = mongoose.model('Expense', {
  title: String,
  amount: Number,
  type: String, // 'income' or 'expense'
  date: { type: Date, default: Date.now }
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Route to fetch all expenses
app.get('/expenses', (req, res) => {
  Expense.find()
    .then(expenses => {
      res.json(expenses);
    })
    .catch(err => {
      console.error('Error fetching expenses:', err);
      res.status(500).send('Failed to fetch expenses.');
    });
});

// Route to fetch a single expense by ID
app.get('/expenses/id', (req, res) => {
    const { id } = req.params;
  
    Expense.findById(id)
      .then(expense => {
        if (!expense) {
          return res.status(404).json({ message: 'Expense not found.' });
        }
        res.json(expense);
      })
      .catch(err => {
        console.error('Error fetching expense:', err);
        res.status(500).send('Failed to fetch expense.');
      });
  });

// Route to delete an expense
app.delete('/expenses/id', (req, res) => {
  const { id } = req.params;

  Expense.findByIdAndDelete(id)
    .then(() => {
      res.json({ message: 'Expense deleted successfully.' });
    })
    .catch(err => {
      console.error('Error deleting expense:', err);
      res.status(500).send('Failed to delete expense.');
    });
});

// Route to update an expense
app.put('/expenses/id', (req, res) => {
  const { id } = req.params;
  const { title, amount, type } = req.body;

  Expense.findByIdAndUpdate(id, { title, amount, type }, { new: true })
    .then(updatedExpense => {
      res.json(updatedExpense);
    })
    .catch(err => {
      console.error('Error updating expense:', err);
      res.status(500).send('Failed to update expense.');
    });
});

// Route to add an expense
app.post('/addExpense', (req, res) => {
  const { title, amount, type } = req.body;

  const newExpense = new Expense({
    title,
    amount,
    type
  });

  newExpense.save()
    .then(() => {
      res.redirect('/');
    })
    .catch(err => {
      res.status(500).send('Failed to add expense.');
    });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});