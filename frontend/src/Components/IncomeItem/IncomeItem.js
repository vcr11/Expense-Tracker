import React from 'react'
import styled from 'styled-components'
import { dateFormat } from '../../utils/dateFormat';
import { bitcoin, book, calender, card, circle, clothing, comment, dollar, food, freelance, medical, money, piggy, stocks, takeaway, trash, tv, users, yt } from '../../utils/Icons';
import Button from '../Button/Button';

function IncomeItem({
    id,
    title,
    amount,
    date,
    category,
    description,
    deleteItem,
    indicatorColor,
    type
}) {

    const categoryIcon = () =>{
        switch(category) {
            case 'salary':
                return money;
            case 'freelancing':
                return freelance
            case 'investments':
                return stocks;
            case 'stocks':
                return users;
            case 'bitcoin':
                return bitcoin;
            case 'bank':
                return card;
            case 'youtube':
                return yt;
            case 'other':
                return piggy;
            default:
                return ''
        }
    }

    const expenseCatIcon = () => {
        switch (category) {
            case 'education':
                return book;
            case 'groceries':
                return food;
            case 'health':
                return medical;
            case 'subscriptions':
                return tv;
            case 'takeaways':
                return takeaway;
            case 'clothing':
                return clothing;
            case 'travelling':
                return freelance;
            case 'other':
                return circle;
            default:
                return ''
        }
    }

    console.log('type', type)

    return (
        <IncomeItemStyled indicator={indicatorColor}>
            <div className="icon">
                {type === 'expense' ? expenseCatIcon() : categoryIcon()}
            </div>
            <div className="content">
                <h5>{title}</h5>
                <div className="inner-content">
                    <div className="text">
                        <p>{dollar} {amount}</p>
                        <p>{calender} {dateFormat(date)}</p>
                        <p>
                            {comment}
                            {description}
                        </p>
                    </div>
                    <div className="btn-con">
                        <Button 
                            icon={trash}
                            bPad={'1rem'}
                            bRad={'50%'}
                            bg={'var(--primary-color'}
                            color={'#fff'}
                            iColor={'#fff'}
                            hColor={'var(--color-green)'}
                            onClick={() => deleteItem(id)}
                        />
                    </div>
                </div>
            </div>
        </IncomeItemStyled>
    )
}

const IncomeItemStyled = styled.div`
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    width: 100%;
    color: #2c3e50;
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
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        transition: left 0.6s;
    }

    &:hover::before {
        left: 100%;
    }

    &:hover {
        transform: translateY(-8px);
        box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
    }

    .icon{
        width: 70px;
        height: 70px;
        border-radius: 18px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        position: relative;
        z-index: 2;

        i{
            font-size: 2.2rem;
            color: white;
        }
    }

    .content{
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        h5{
            font-size: 1.4rem;
            font-weight: 600;
            padding-left: 2rem;
            position: relative;
            margin: 0;
            color: #2c3e50;

            &::before{
                content: '';
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                width: 1rem;
                height: 1rem;
                border-radius: 50%;
                background: ${props => props.indicator};
                box-shadow: 0 0 10px ${props => props.indicator}50;
            }
        }

        .inner-content{
            display: flex;
            justify-content: space-between;
            align-items: center;

            .text{
                display: flex;
                flex-direction: column;
                gap: 0.5rem;

                p{
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #5a6c7d;
                    font-size: 0.9rem;
                    margin: 0;
                    font-weight: 500;

                    i {
                        color: #667eea;
                    }
                }
            }

            .btn-con {
                .btn {
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
                    border: none;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
                    transition: all 0.3s ease;
                    position: relative;
                    z-index: 2;

                    &:hover {
                        transform: scale(1.1);
                        box-shadow: 0 12px 35px rgba(255, 107, 107, 0.4);
                    }

                    &:active {
                        transform: scale(0.95);
                    }

                    i {
                        font-size: 1.2rem;
                    }
                }
            }
        }
    }

    @media (max-width: 768px) {
        flex-direction: column;
        text-align: center;
        gap: 1rem;

        .content {
            .inner-content {
                flex-direction: column;
                gap: 1rem;

                .text {
                    align-items: center;
                }
            }
        }
    }
`;

export default IncomeItem
