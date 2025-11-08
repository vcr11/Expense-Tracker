import React, { useState } from 'react'
import styled from 'styled-components'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from '../../context/globalContext';
import Button from '../Button/Button';
import { plus } from '../../utils/Icons';


function ExpenseForm() {
    const {addExpense, autoCategorizeExpense, error, setError} = useGlobalContext()
    const [inputState, setInputState] = useState({
        title: '',
        amount: '',
        date: null,
        category: '',
        description: '',
    })

    const { title, amount, date, category,description } = inputState;

    const handleInput = name => e => {
        setInputState({...inputState, [name]: e.target.value})
        setError('')
    }

    const handleSubmit = e => {
        e.preventDefault()
        // Convert date to string format for backend
        const submitData = {
            ...inputState,
            date: date ? date.toISOString().split('T')[0] : ''
        }
        addExpense(submitData)
        setInputState({
            title: '',
            amount: '',
            date: null,
            category: '',
            description: '',
        })
    }

    const handleAutoCategorize = async () => {
        if (!title || !description) {
            setError('Title and description are required for auto-categorization')
            return
        }
        const suggestedCategory = await autoCategorizeExpense(title, description)
        if (suggestedCategory) {
            setInputState({...inputState, category: suggestedCategory})
            setError('')
        }
    }

    return (
        <ExpenseFormStyled onSubmit={handleSubmit}>
            {error && <p className='error'>{error}</p>}
            <div className="input-control">
                <input 
                    type="text" 
                    value={title}
                    name={'title'} 
                    placeholder="Expense Title"
                    onChange={handleInput('title')}
                />
            </div>
            <div className="input-control">
                <input value={amount}  
                    type="text" 
                    name={'amount'} 
                    placeholder={'Expense Amount'}
                    onChange={handleInput('amount')} 
                />
            </div>
            <div className="input-control">
                <DatePicker
                    id='date'
                    placeholderText='Enter A Date'
                    selected={date}
                    dateFormat="dd/MM/yyyy"
                    onChange={(selectedDate) => {
                        setInputState({...inputState, date: selectedDate})
                    }}
                />
            </div>
            <div className="selects input-control">
                <select required value={category} name="category" id="category" onChange={handleInput('category')}>
                    <option value="" disabled >Select Option</option>
                    <option value="education">Education</option>
                    <option value="groceries">Groceries</option>
                    <option value="health">Health</option>
                    <option value="subscriptions">Subscriptions</option>
                    <option value="takeaways">Takeaways</option>
                    <option value="clothing">Clothing</option>
                    <option value="travelling">Travelling</option>
                    <option value="other">Other</option>
                </select>
                <button type="button" onClick={handleAutoCategorize} className="auto-categorize-btn">Auto Categorize</button>
            </div>
            <div className="input-control">
                <textarea name="description" value={description} placeholder='Add A Reference' id="description" cols="30" rows="4" onChange={handleInput('description')}></textarea>
            </div>
            <div className="submit-btn">
                <Button 
                    name={'Add Expense'}
                    icon={plus}
                    bPad={'.8rem 1.6rem'}
                    bRad={'30px'}
                    bg={'var(--color-accent'}
                    color={'#fff'}
                />
            </div>
        </ExpenseFormStyled>
    )
}


const ExpenseFormStyled = styled.form`
    display: flex;
    flex-direction: column;
    gap: 2rem;

    .error {
        background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
        color: #721c24;
        padding: 1rem;
        border-radius: 10px;
        border-left: 5px solid #dc3545;
        font-weight: 500;
        animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    .input-control{
        input, textarea, select{
            font-family: inherit;
            font-size: inherit;
            outline: none;
            border: none;
            padding: 1rem 1.5rem;
            border-radius: 15px;
            border: 2px solid rgba(255, 255, 255, 0.8);
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            resize: none;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            color: #2c3e50;
            transition: all 0.3s ease;
            width: 100%;

            &:focus {
                border-color: #667eea;
                box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
                transform: translateY(-2px);
            }

            &::placeholder{
                color: rgba(44, 62, 80, 0.5);
            }
        }

        input{
            width: 100%;
        }
    }

    .selects{
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;

        select{
            flex: 1;
            color: rgba(44, 62, 80, 0.7);
            cursor: pointer;

            &:focus, &:active{
                color: #2c3e50;
            }
        }

        .auto-categorize-btn{
            padding: 0.8rem 1.5rem;
            border: 2px solid rgba(102, 126, 234, 0.3);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 12px;
            cursor: pointer;
            font-family: inherit;
            font-size: 0.9rem;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
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

            &:hover{
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
            }

            &:active {
                transform: translateY(0);
            }
        }
    }

    .submit-btn{
        margin-top: 1rem;

        button{
            width: 100%;
            padding: 1rem 2rem;
            background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
            color: white;
            border: none;
            border-radius: 15px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 8px 32px rgba(250, 112, 154, 0.3);
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

            &:hover{
                transform: translateY(-3px);
                box-shadow: 0 12px 40px rgba(250, 112, 154, 0.4);
            }

            &:active {
                transform: translateY(0);
            }
        }
    }

    @media (max-width: 768px) {
        .selects {
            flex-direction: column;
            gap: 1rem;

            .auto-categorize-btn {
                width: 100%;
            }
        }
    }
`;
export default ExpenseForm
