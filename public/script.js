// Fetch expenses and update UI
fetch('/expenses')
    .then(response => response.json())
    .then(expenses => {
        const expenseList = document.getElementById('expenseList');
        expenseList.innerHTML = '';

        expenses.forEach(expense => {
            const expenseItem = document.createElement('div');
            expenseItem.innerHTML = `
      <div>
        <span>Title: ${expense.title}</span>
        <span>Amount: ${expense.amount}</span>
        <span>Type: ${expense.type}</span>
        <button onclick="editExpense('${expense._id}')">Edit</button>
        <button onclick="deleteExpense('${expense._id}')">Delete</button>
      </div>
    `;
            expenseList.appendChild(expenseItem);
        });
    })
    .catch(err => {
        console.error('Error fetching expenses:', err);
    });

// Function to delete an expense
function deleteExpense(id) {
    fetch(`/expenses/${id}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            location.reload(); // Refresh the page to update the expense list
        })
        .catch(err => {
            console.error('Error deleting expense:', err);
        });
}

// Function to edit an expense
function editExpense(id) {
    const modal = document.getElementById('editModal');
    const span = document.getElementsByClassName('close')[0];

    fetch(`/expenses/${id}`)
        .then(response => response.json())
        .then(expense => {
            document.getElementById('editExpenseId').value = expense._id;
            document.getElementById('editTitle').value = expense.title;
            document.getElementById('editAmount').value = expense.amount;
            document.getElementById('editType').value = expense.type;

            modal.style.display = 'block';
        })
        .catch(err => {
            console.error('Error fetching expense:', err);
            res.status(500).send('Failed to fetch expense.');
          });
          span.onclick = function () {
        modal.style.display = 'none';
    };

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}

// Form submission from the edit modal
document.getElementById('editExpenseForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(this);

    fetch(`/expenses/${formData.get('id')}`, {
        method: 'PUT',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            console.log('Expense updated:', data);
            location.reload(); // Refresh the page to update the expense list
        })
        .catch(err => {
            console.error('Error updating expense:', err);
        });
});