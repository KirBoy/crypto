import React, {useEffect, useRef, useState} from 'react';
import axios from "axios";
import {Line} from 'react-chartjs-2';
import './index.css'
import Chart from 'chart.js/auto';
import {coinsData, coins} from '../../constans'


const Converter = () => {
    const [fromCurrency, setFromCurrency] = useState('BTC');
    const [toCurrency, setToCurrency] = useState('USD');
    const [valueLeft, setValueLeft] = useState(1);
    const [valueRight, setValueRight] = useState(29623.0899);
    const [openLeft, setOpenLeft] = useState(false);
    const [openRight, setOpenRight] = useState(false);
    const [days, setDays] = useState([])
    const [prices, setPrices] = useState([])
    const [lineChart, setLineChart] = useState({
        coin: 'bitcoin', color: '#f7931a'
    })
    const leftRef = useRef();
    const rightRef = useRef();

    useEffect(() => {
        getCurrentExchangeRateDaily(coinsData[fromCurrency].id, fromCurrency)
        document.addEventListener('mousedown', clickOutside)
        return () => document.removeEventListener('mousedown', clickOutside)
    }, [])

    useEffect(() => {
        getCurrentExchangeRate(coinsData[fromCurrency].id, toCurrency, 'left')
        if (fromCurrency !== 'USD') {
            getCurrentExchangeRateDaily(coinsData[fromCurrency].id, fromCurrency)
        } else getCurrentExchangeRateDaily(coinsData[toCurrency].id, toCurrency)
    }, [fromCurrency])

    useEffect(() => {
        getCurrentExchangeRate(coinsData[toCurrency].id, fromCurrency, 'right')
        if (toCurrency !== 'USD') {
            getCurrentExchangeRateDaily(coinsData[toCurrency].id, toCurrency)
        } else getCurrentExchangeRateDaily(coinsData[fromCurrency].id, fromCurrency)
    }, [toCurrency])

    const getCurrentExchangeRate = async (from, to, side) => {
        const resp = await axios('https://api.coingecko.com/api/v3/simple/price?ids=' + from + '&vs_currencies=' + to)
            .then(res => res.data)
        const exchangeRate = resp[from][to.toLowerCase()]

        if (side === 'left') {
            setValueRight(valueLeft * exchangeRate)
        } else {
            setValueLeft(valueRight * exchangeRate)
        }
    }

    const getCurrentExchangeRateDaily = async (coin, coinName) => {

        const resp = await axios('https://api.coingecko.com/api/v3/coins/' + coin + '/market_chart?vs_currency=usd&days=14&interval=daily')
            .then(res => res.data)

        const pricesList = []
        const daysList = []

        resp.prices.forEach(el => {
            daysList.push(new Date(el[0]).getDate())
            pricesList.push(el[1].toFixed(4))
        })
        setLineChart({
            coin: coin,
            color: coinsData[coinName].color
        })
        setDays(daysList)
        setPrices(pricesList)
    }

    const clickOutside = e => {
        if (!leftRef.current.contains(e.target) && !rightRef.current.contains(e.target)) {
            setOpenRight(false)
            setOpenLeft(false)
        }
    }

    const onClickLeft = () => {
        setOpenLeft(!openLeft)
    }

    const onClickRight = () => {
        setOpenRight(!openRight)
    }

    const onChange = async (e, side) => {
        setOpenLeft(false)
        setOpenRight(false)
        if (side === 'left') {
            setValueLeft(e.target.value)
            const resp = await axios('https://api.coingecko.com/api/v3/simple/price?ids=' + coinsData[fromCurrency].id + '&vs_currencies=' + toCurrency)
                .then(res => res.data)
            const exchangeRate = resp[coinsData[fromCurrency].id][toCurrency.toLowerCase()]
            setValueRight(e.target.value * exchangeRate)
        } else {
            setValueRight(e.target.value)
            const resp = await axios('https://api.coingecko.com/api/v3/simple/price?ids=' + coinsData[toCurrency].id + '&vs_currencies=' + fromCurrency)
                .then(res => res.data)
            const exchangeRate = resp[coinsData[toCurrency].id][fromCurrency.toLowerCase()]
            setValueLeft(e.target.value * exchangeRate)
        }
    }

    return (
        <div className='converter'>
            <div className='converter__inner'>
                <div className='converter__field'>

                    <input className='converter__input'
                           onChange={(e) => onChange(e, 'left')}
                           type="number"
                           value={valueLeft}/>

                    <div className='converter__currency' onClick={onClickLeft}>
                        <img className='converter__img'
                             src={fromCurrency + '.svg'}
                             alt={fromCurrency}/>
                        <span>{fromCurrency}</span>
                        {!openLeft && <span className='converter__arrow'/>}
                    </div>

                    <ul className='converter__list' ref={leftRef}>
                        {openLeft && coins.map((el, i) =>
                            <Coin
                                key={i}
                                coin={el}
                                side={false}
                                closeList={setOpenLeft}
                                fromCurrency={fromCurrency}
                                toCurrency={toCurrency}
                                setCurrency={setFromCurrency}
                            />)}
                    </ul>

                </div>
                <span className='converter__equal'>=</span>

                <div className='converter__field'>

                    <input className='converter__input'
                           onChange={(e) => onChange(e, 'right')}
                           type="number"
                           value={valueRight}/>

                    <div className='converter__currency' onClick={onClickRight}>
                        <img className='converter__img'
                             src={toCurrency + '.svg'}
                             alt={toCurrency}/>
                        <span>{toCurrency}</span>
                        {!openRight && <span className='converter__arrow'/>}
                    </div>

                    <ul className='converter__list' ref={rightRef}>
                        {openRight && coins.map((el, i) =>
                            <Coin
                                key={i}
                                coin={el}
                                side={false}
                                closeList={setOpenRight}
                                fromCurrency={fromCurrency}
                                toCurrency={toCurrency}
                                setCurrency={setToCurrency}
                            />)}
                    </ul>
                </div>
            </div>
            <Line className='converter__canvas' type={"line"}
                  data={{
                      labels: days,
                      datasets: [{
                          data: prices,
                          fill: false,
                          borderColor: lineChart.color,
                          tension: 0.1,
                          pointBorderWidth: 3,
                          borderWidth: 3
                      }],
                  }}

                  options={{
                      animation: {
                          duration: 0
                      },
                      plugins: {
                          legend: {
                              display: false
                          },
                          title: {
                              display: true,
                              text: 'Курс ' + lineChart.coin,
                              color: '#e5e4e4',
                              font: {
                                  size: 25,
                                  weight: 400,
                                  family: 'Inter'
                              }
                          }
                      }
                  }}/>
        </div>
    );
};

const Coin = ({coin, closeList, fromCurrency, toCurrency, setCurrency}) => {

    const onClick = () => {
        setCurrency(coin)
        closeList(prev => !prev)
    }

    if (fromCurrency === coin || toCurrency === coin) {
        return null
    }

    return (
        <li className='converter__item' onClick={onClick}>
            <img className='converter__img' src={coin + '.svg'} alt=""/>
            <span>{coin}</span>
        </li>
    )
}

export default Converter;