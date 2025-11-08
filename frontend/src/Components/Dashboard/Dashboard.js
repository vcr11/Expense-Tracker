import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext';
import History from '../../History/History';
import { InnerLayout } from '../../styles/Layouts';
import { dollar } from '../../utils/Icons';
import Chart from '../Chart/Chart';

function Dashboard() {
    const {totalExpenses,incomes, expenses, totalIncome, totalBalance, getIncomes, getExpenses, getBudgetSuggestions } = useGlobalContext()
    const [suggestions, setSuggestions] = useState([])

    useEffect(() => {
        getIncomes()
        getExpenses()
        fetchSuggestions()
    }, [])

    const fetchSuggestions = async () => {
        const sugg = await getBudgetSuggestions()
        setSuggestions(sugg)
    }

    return (
        <DashboardStyled>
            <InnerLayout>
                <h1>All Transactions</h1>
                <div className="stats-con">
                    <div className="chart-con">
                        <Chart />
                        <div className="amount-con">
                            <div className="income">
                                <h2>Total Income</h2>
                                <p>
                                    {dollar} {totalIncome()}
                                </p>
                            </div>
                            <div className="expense">
                                <h2>Total Expense</h2>
                                <p>
                                    {dollar} {totalExpenses()}
                                </p>
                            </div>
                            <div className="balance">
                                <h2>Total Balance</h2>
                                <p>
                                    {dollar} {totalBalance()}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="history-con">
                        <History />
                        <h2 className="salary-title">Min <span>Salary</span>Max</h2>
                        <div className="salary-item">
                            <p>
                                ${Math.min(...incomes.map(item => item.amount))}
                            </p>
                            <p>
                                ${Math.max(...incomes.map(item => item.amount))}
                            </p>
                        </div>
                        <h2 className="salary-title">Min <span>Expense</span>Max</h2>
                        <div className="salary-item">
                            <p>
                                ${Math.min(...expenses.map(item => item.amount))}
                            </p>
                            <p>
                                ${Math.max(...expenses.map(item => item.amount))}
                            </p>
                        </div>
                        <h2>Budget Suggestions</h2>
                        <div className="suggestions">
                            {suggestions.map((sugg, index) => (
                                <div key={index} className="suggestion-item">
                                    <p><strong>{sugg.category}:</strong> {sugg.suggestion}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </InnerLayout>
        </DashboardStyled>
    )
}

const DashboardStyled = styled.div`
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

    .stats-con{
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 2rem;

        .chart-con{
            grid-column: 1 / 4;
            height: 400px;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-radius: 20px;
            padding: 2rem;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;

            &:hover {
                transform: translateY(-5px);
            }

            .amount-con{
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 2rem;
                margin-top: 2rem;

                .income, .expense{
                    grid-column: span 2;
                }

                .income, .expense, .balance{
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 20px;
                    padding: 2rem;
                    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
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
                        transform: translateY(-10px);
                        box-shadow: 0 20px 40px rgba(102, 126, 234, 0.4);
                    }

                    h2 {
                        font-size: 1.2rem;
                        margin-bottom: 1rem;
                        opacity: 0.9;
                    }

                    p{
                        font-size: 2.5rem;
                        font-weight: 700;
                        margin: 0;
                    }
                }

                .income {
                    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                }

                .expense {
                    background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
                }

                .balance{
                    grid-column: 2 / 4;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);

                    p{
                        color: #2c3e50;
                        opacity: 1;
                        font-size: 3rem;
                        margin: 0;
                    }
                }
            }
        }

        .history-con{
            grid-column: 4 / -1;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            border-radius: 20px;
            padding: 2rem;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            color: white;

            h2{
                margin: 1rem 0;
                font-size: 1.5rem;
                font-weight: 600;
            }

            .salary-title{
                font-size: 1rem;
                margin-bottom: 1rem;
                span{
                    font-size: 1.5rem;
                    font-weight: 700;
                }
            }

            .salary-item{
                background: rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.3);
                padding: 1.5rem;
                border-radius: 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
                transition: all 0.3s ease;

                &:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(1.02);
                }

                p{
                    font-weight: 600;
                    font-size: 1.4rem;
                    margin: 0;
                }
            }

            .suggestions{
                .suggestion-item{
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    padding: 1.5rem;
                    border-radius: 15px;
                    margin-bottom: 1rem;
                    transition: all 0.3s ease;

                    &:hover {
                        background: rgba(255, 255, 255, 0.3);
                        transform: scale(1.02);
                    }

                    p{
                        font-size: 1.2rem;
                        margin: 0;
                        line-height: 1.5;
                    }
                }
            }
        }
    }

    @media (max-width: 1200px) {
        .stats-con {
            grid-template-columns: 1fr;
            .chart-con {
                grid-column: 1;
            }
            .history-con {
                grid-column: 1;
            }
        }
    }
`;

export default Dashboard
