import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import Form from '../Form/Form';
import IncomeItem from '../IncomeItem/IncomeItem';
import ExpenseForm from './ExpenseForm';

function Expenses() {
    const {addIncome,expenses, getExpenses, deleteExpense, totalExpenses} = useGlobalContext()

    useEffect(() =>{
        getExpenses()
    }, [])
    return (
        <ExpenseStyled>
            <InnerLayout>
                <h1>Expenses</h1>
                <h2 className="total-income">Total Expense: <span>${totalExpenses()}</span></h2>
                <div className="income-content">
                    <div className="form-container">
                        <ExpenseForm />
                    </div>
                    <div className="incomes">
                        {expenses.map((income) => {
                            const {_id, title, amount, date, category, description, type} = income;
                            console.log(income)
                            return <IncomeItem
                                key={_id}
                                id={_id} 
                                title={title} 
                                description={description} 
                                amount={amount} 
                                date={date} 
                                type={type}
                                category={category} 
                                indicatorColor="var(--color-green)"
                                deleteItem={deleteExpense}
                            />
                        })}
                    </div>
                </div>
            </InnerLayout>
        </ExpenseStyled>
    )
}

const ExpenseStyled = styled.div`
    display: flex;
    overflow: auto;
    padding: 2rem;

    h1 {
        color: #2c3e50;
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 2rem;
        text-align: center;
        background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .total-income{
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
        box-shadow: 0 20px 40px rgba(240, 147, 251, 0.3);
        border-radius: 25px;
        padding: 2rem;
        margin: 2rem 0;
        font-size: 1.8rem;
        gap: 1rem;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;

        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
        }

        &:hover::before {
            left: 100%;
        }

        &:hover {
            transform: translateY(-5px);
            box-shadow: 0 30px 50px rgba(240, 147, 251, 0.4);
        }

        span{
            font-size: 3rem;
            font-weight: 800;
            color: #ffffff;
        }
    }

    .income-content{
        display: flex;
        gap: 3rem;
        align-items: flex-start;

        .form-container {
            flex: 0 0 400px;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-radius: 20px;
            padding: 2rem;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;

            &:hover {
                transform: translateY(-5px);
            }
        }

        .incomes{
            flex: 1;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 2rem;
        }
    }

    @media (max-width: 1200px) {
        .income-content {
            flex-direction: column;
            .form-container {
                flex: none;
                margin-bottom: 2rem;
            }
            .incomes {
                grid-template-columns: 1fr;
            }
        }
    }
`;

export default Expenses
