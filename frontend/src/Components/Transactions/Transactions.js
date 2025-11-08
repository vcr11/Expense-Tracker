import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import IncomeItem from '../IncomeItem/IncomeItem';

function Transactions() {
    const { incomes, expenses, getIncomes, getExpenses } = useGlobalContext();
    const [allTransactions, setAllTransactions] = useState([]);

    useEffect(() => {
        getIncomes();
        getExpenses();
    }, []);

    useEffect(() => {
        // Combine and sort all transactions by date
        const combined = [
            ...incomes.map(income => ({ ...income, type: 'income' })),
            ...expenses.map(expense => ({ ...expense, type: 'expense' }))
        ];

        // Sort by createdAt in descending order (newest first)
        combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setAllTransactions(combined);
    }, [incomes, expenses]);

    return (
        <TransactionsStyled>
            <InnerLayout>
                <h1>All Transactions</h1>
                <div className="transactions-container">
                    {allTransactions.length === 0 ? (
                        <div className="empty-state">
                            <h3>No transactions yet</h3>
                            <p>Start by adding your first income or expense!</p>
                        </div>
                    ) : (
                        <div className="transactions-list">
                            {allTransactions.map((transaction) => {
                                const { _id, title, amount, date, category, description, type } = transaction;
                                return (
                                    <IncomeItem
                                        key={_id}
                                        id={_id}
                                        title={title}
                                        description={description}
                                        amount={amount}
                                        date={date}
                                        type={type}
                                        category={category}
                                        indicatorColor={type === 'income' ? 'var(--color-green)' : 'var(--color-accent)'}
                                        deleteItem={type === 'income' ? () => {} : () => {}} // Disable delete for now
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </InnerLayout>
        </TransactionsStyled>
    )
}

const TransactionsStyled = styled.div`
    display: flex;
    overflow: auto;
    padding: 2rem;

    h1 {
        color: #2c3e50;
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 2rem;
        text-align: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .transactions-container {
        .empty-state {
            text-align: center;
            padding: 4rem 2rem;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);

            h3 {
                color: #2c3e50;
                font-size: 1.8rem;
                margin-bottom: 1rem;
            }

            p {
                color: #5a6c7d;
                font-size: 1.1rem;
            }
        }

        .transactions-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
            gap: 2rem;

            @media (max-width: 768px) {
                grid-template-columns: 1fr;
            }
        }
    }
`;

export default Transactions;
