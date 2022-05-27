import React, {useEffect, useState} from 'react';
import {coinsData} from '../../constans';
import './index.css'
import {Doughnut} from 'react-chartjs-2';
import axios from "axios";


const CriptoPack = () => {
    const [coins, setCoins] = useState([
        {id: 1, name: 'BTC', amount: 1.2771},
        {id: 2, name: 'USD', amount: 1050.2},
        {id: 3, name: 'ETH', amount: 12.005}
    ])
    const [totalArr, setTotalArr] = useState([])
    const [total, setTotal] = useState(0)

    useEffect(() => {
        firePromise()
    }, [])

    useEffect(() => {
        setTotal(totalArr.reduce((previousValue, currentValue) => previousValue + currentValue, 0))
    }, [totalArr])

    useEffect(() => {
        firePromise()
    }, [coins])

    const firePromise = () => {
        return Promise.all(coins.map((coin) => getCurrentExchangeRate(coin.name)))
            .then(resp => {
                setTotalArr(resp.map((el, i) => Math.round(el * coins[i].amount)))
                setTotal(resp.reduce((previousValue, currentValue) => previousValue + currentValue, 0))
            })
    }

    const getCurrentExchangeRate = async (coin) => {
        const coinId = coinsData[coin].id
        const resp = await axios('https://api.coingecko.com/api/v3/simple/price?ids=' + coinId + '&vs_currencies=usd')
            .then(res => res.data)
        return resp[coinId].usd
    }

    return (
        <div className='pack'>
            <div className='pack__coins'>
                <ul>
                    {coins.map(el =>
                        <Coin key={el.id}
                              setCoins={setCoins}
                              coin={el}
                        />)}
                </ul>
                <div className='pack__total'>
                    <span className='pack__balance'>Балланс </span>
                    <span>{total} $</span>
                </div>
            </div>
            <Doughnut className='pack__canvas' type='doughnut' height={300}
                      data={{
                          labels: [
                              'Bitcoin',
                              'USD',
                              'Ethereum'
                          ],
                          datasets: [{
                              label: 'My First Dataset',
                              data: totalArr,
                              backgroundColor: [
                                  '#f7931a',
                                  '#e64949',
                                  '#4a5fa2'
                              ],
                              hoverOffset: 4
                          }]
                      }}
                      options={{
                          plugins: {
                              legend: {
                                  labels: {
                                      color: '#e5e4e4',
                                      font: {
                                          size: 20,
                                      }
                                  }
                              }

                          }
                      }}/>
        </div>
    );
};

const Coin = ({coin, setCoins}) => {

    const onChange = (e) => {
        setCoins(coins => coins.map(el => {
            if (el.name === coin.name) {
                return {...el, amount: e.target.value}
            }
            return el
        }))
    }
    return (
        <li className='pack__item'>
            <input className='pack__input' onChange={onChange} type="number" value={coin.amount}/>
            <div className='pack__currency'>
                <img className='pack__img' src={coin.name + '.svg'} alt={coin.name}/>
                <span>{coin.name}</span>
            </div>
        </li>
    )
}


export default CriptoPack;