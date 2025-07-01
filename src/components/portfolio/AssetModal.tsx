'use client'

import React, { useEffect, useState } from 'react'
import type { Asset } from './types'
import DatePicker from 'react-datepicker'
import { ko } from 'date-fns/locale'
import { format } from 'date-fns'
import 'react-datepicker/dist/react-datepicker.css'

interface Market {
  market: string
  korean_name: string
  english_name: string
}

interface Props {
  show: boolean
  onClose: () => void
  onSave: (asset: Asset) => void
}

const AssetModal = ({ show, onClose, onSave }: Props) => {
  const [marketList, setMarketList] = useState<Market[]>([])
  const [inputValue, setInputValue] = useState('')
  const [filteredMarkets, setFilteredMarkets] = useState<Market[]>([])
  const [input, setInput] = useState<Partial<Asset> & { date?: string; type?: 'buy' | 'sell' }>({})

  useEffect(() => {
    if (show) {
      fetch('https://api.upbit.com/v1/market/all?isDetails=true')
        .then(res => res.json())
        .then(data => {
          const krwMarkets = data.filter((m: Market) => m.market.startsWith('KRW-'))
          setMarketList(krwMarkets)
        })
      setInput({})
      setInputValue('')
      setFilteredMarkets([])

      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [show])

  const handleSelect = (market: Market) => {
    setInput({
      ...input,
      symbol: market.market.replace('KRW-', ''),
      name: market.korean_name,
    })
    setInputValue(`${market.korean_name} (${market.market.replace('KRW-', '')})`)
    setFilteredMarkets([])
  }

  const handleChange = (field: string, value: string) => {
    if (field === 'quantity' || field === 'averagePrice') {
      const parsed = parseFloat(value)
      setInput(prev => ({ ...prev, [field]: isNaN(parsed) || parsed < 0 ? undefined : parsed }))
    } else {
      setInput(prev => ({ ...prev, [field]: value }))
    }
  }

  const totalPrice = (input.quantity ?? 0) * (input.averagePrice ?? 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { symbol, name, quantity, averagePrice, date, type } = input
    if (!symbol || !name) {
      alert('코인을 검색하고 목록에서 선택해주세요.')
    } else if (quantity === undefined || averagePrice === undefined || !date || !type) {
      alert('모든 필드를 올바르게 입력해주세요.')
    } else {
      onSave({
        symbol,
        name,
        quantity,
        averagePrice,
        date,
        type,
      })
      onClose()
    }
  }

  if (!show) return null

  const isFormComplete = input.symbol && input.name && input.quantity !== undefined && input.averagePrice !== undefined && input.date && input.type

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white/5 text-neutral-100 backdrop-blur-3xl rounded-xl shadow-xl w-full max-w-md p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">거래 추가</h2>
          <button type="button" onClick={onClose} className="text-neutral-100 hover:text-neutral-200 text-2xl p-2">&times;</button>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4 text-sm font-medium">
          {['buy', 'sell'].map(type => (
            <button
              key={type}
              type="button"
              className={`rounded-xl py-2 text-sm font-semibold transition focus:outline-none
                ${input.type === type
                  ? 'bg-portfolio hover:bg-portfolio/90 text-neutral-100'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
              onClick={() => handleChange('type', type)}
            >
              {type === 'buy' ? '구매' : '매도'}
            </button>
          ))}
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            placeholder="코인 검색"
            className="w-full bg-white/10 text-neutral-100 rounded-xl px-4 py-3 placeholder-neutral-100 focus:outline-none"
            value={inputValue}
            onChange={e => {
              const value = e.target.value
              setInputValue(value)
              setInput(prev => ({ ...prev, symbol: undefined, name: undefined }))
              setFilteredMarkets(
                marketList.filter(m =>
                  [m.korean_name, m.english_name.toLowerCase(), m.market.replace('KRW-', '').toLowerCase()]
                    .some(field => field.includes(value.toLowerCase()))
                )
              )
            }}
          />
          {filteredMarkets.length > 0 && (
            <ul className="absolute z-50 w-full bg-portfolio mt-1 rounded-xl shadow max-h-48 overflow-y-auto">
              {filteredMarkets.map((m, idx) => (
                <li
                  key={idx}
                  className="px-4 py-2 hover:bg-white/5 cursor-pointer"
                  onClick={() => handleSelect(m)}
                >
                  {m.korean_name} ({m.market.replace('KRW-', '')})
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <input
            type="number"
            min="0"
            step="any"
            placeholder="수량"
            className="w-full bg-white/10 text-neutral-100 rounded-xl px-4 py-3 placeholder-neutral-100 focus:outline-none"
            value={input.quantity ?? ''}
            onChange={e => handleChange('quantity', e.target.value)}
          />
          <div className="relative w-full">
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-md text-neutral-100">₩</span>
            <input
              type="number"
              min="0"
              step="any"
              placeholder="코인당 가격"
              className="w-full bg-white/10 text-neutral-100 rounded-xl px-4 py-3 pr-14 placeholder-neutral-100 focus:outline-none"
              value={input.averagePrice ?? ''}
              onChange={e => handleChange('averagePrice', e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4">
          <DatePicker
            selected={input.date ? new Date(input.date) : null}
            onChange={(date: Date | null) => {
              handleChange('date', date ? format(date, 'yyyy-MM-dd') : '')
            }}
            dateFormat="yyyy-MM-dd"
            placeholderText="날짜 선택"
            locale={ko}
            className="w-full bg-white/10 text-white rounded-xl px-4 py-3 focus:outline-none placeholder-neutral-100"
            wrapperClassName="w-full"
            calendarClassName="!bg-white !text-black rounded-lg shadow-xl"
          />
        </div>

        <div className="bg-white/10 rounded-xl p-4 mb-4">
          <p className="text-sm text-neutral-100">사용된 총액</p>
          <p className="text-xl font-semibold">₩ {totalPrice.toLocaleString()}</p>
        </div>

        <button
          type="submit"
          disabled={!isFormComplete}
          className={`w-full py-3 font-semibold rounded-xl transition focus:outline-none
                      ${isFormComplete
                        ? 'bg-portfolio hover:bg-portfolio/90 text-neutral-100'
                        : 'bg-gray-500 cursor-not-allowed'}`}
        >
          거래 추가
        </button>
      </form>
    </div>
  )
}

export default AssetModal