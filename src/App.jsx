import { useState } from 'react'
import './App.css'

function App() {
  const [transactions, setTransactions] = useState([])
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState('식비')

  const categories = {
    expense: ['식비', '교통', '쇼핑', '주거', '통신', '기타'],
    income: ['급여', '용돈', '부수입', '기타']
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!description || !amount) return

    const newTransaction = {
      id: Date.now(),
      description,
      amount: type === 'expense' ? -Math.abs(Number(amount)) : Math.abs(Number(amount)),
      type,
      category,
      date: new Date().toLocaleDateString('ko-KR')
    }

    setTransactions([newTransaction, ...transactions])
    setDescription('')
    setAmount('')
  }

  const handleDelete = (id) => {
    setTransactions(transactions.filter(t => t.id !== id))
  }

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const balance = totalIncome - totalExpense

  const formatMoney = (num) => {
    return num.toLocaleString('ko-KR') + '원'
  }

  return (
    <div className="app">
      <h1>가계부</h1>

      <div className="summary">
        <div className="summary-item balance">
          <span className="label">잔액</span>
          <span className="value">{formatMoney(balance)}</span>
        </div>
        <div className="summary-item income">
          <span className="label">수입</span>
          <span className="value">+{formatMoney(totalIncome)}</span>
        </div>
        <div className="summary-item expense">
          <span className="label">지출</span>
          <span className="value">-{formatMoney(totalExpense)}</span>
        </div>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="type-toggle">
            <button
              type="button"
              className={`toggle-btn ${type === 'expense' ? 'active expense' : ''}`}
              onClick={() => { setType('expense'); setCategory('식비') }}
            >
              지출
            </button>
            <button
              type="button"
              className={`toggle-btn ${type === 'income' ? 'active income' : ''}`}
              onClick={() => { setType('income'); setCategory('급여') }}
            >
              수입
            </button>
          </div>
        </div>
        <div className="form-row">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories[type].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="내용"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="number"
            placeholder="금액"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button type="submit" className="submit-btn">추가</button>
        </div>
      </form>

      <div className="transactions">
        <h2>거래 내역</h2>
        {transactions.length === 0 ? (
          <p className="empty">아직 거래 내역이 없습니다.</p>
        ) : (
          <ul>
            {transactions.map(t => (
              <li key={t.id} className={`transaction ${t.type}`}>
                <div className="transaction-left">
                  <span className="category-badge">{t.category}</span>
                  <div className="transaction-info">
                    <span className="transaction-desc">{t.description}</span>
                    <span className="transaction-date">{t.date}</span>
                  </div>
                </div>
                <div className="transaction-right">
                  <span className="transaction-amount">
                    {t.type === 'income' ? '+' : ''}{formatMoney(t.amount)}
                  </span>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(t.id)}
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App
