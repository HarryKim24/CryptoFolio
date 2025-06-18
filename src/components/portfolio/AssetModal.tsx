'use client'

import React, { useEffect, useState } from 'react'
import type { Asset } from './types'

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
      if (!isNaN(parsed) && parsed >= 0) {
        setInput(prev => ({ ...prev, [field]: parsed }))
      } else {
        setInput(prev => ({ ...prev, [field]: undefined }))
      }
    } else {
      setInput(prev => ({ ...prev, [field]: value }))
    }
  }

  const totalPrice = (input.quantity ?? 0) * (input.averagePrice ?? 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (
      input.symbol &&
      input.name &&
      input.quantity !== undefined &&
      input.averagePrice !== undefined &&
      input.date &&
      input.type
    ) {
      onSave({
        symbol: input.symbol,
        name: input.name,
        quantity: input.quantity,
        averagePrice: input.averagePrice,
        currentPrice: input.averagePrice,
        date: input.date,
        type: input.type,
      })
      onClose()
    } else {
      alert('모든 필드를 올바르게 입력해주세요.')
    }
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-[#1E1E2F] text-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">거래 추가</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-white">&#10005;</button>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4 text-sm font-medium">
          <button
            type="button"
            className={`rounded-lg py-2 ${input.type === 'buy' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`}
            onClick={() => handleChange('type', 'buy')}
          >
            구매하기
          </button>
          <button
            type="button"
            className={`rounded-lg py-2 ${input.type === 'sell' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`}
            onClick={() => handleChange('type', 'sell')}
          >
            매도
          </button>
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            placeholder="코인 검색"
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-3"
            value={inputValue}
            onChange={e => {
              const value = e.target.value
              setInputValue(value)
              setFilteredMarkets(
                marketList.filter(
                  m =>
                    m.korean_name.includes(value) ||
                    m.english_name.toLowerCase().includes(value.toLowerCase()) ||
                    m.market.replace('KRW-', '').toLowerCase().includes(value.toLowerCase())
                )
              )
            }}
          />
          {filteredMarkets.length > 0 && (
            <ul className="absolute z-10 w-full bg-gray-700 mt-1 rounded-lg shadow max-h-48 overflow-y-auto">
              {filteredMarkets.map((m, idx) => (
                <li
                  key={idx}
                  className="px-4 py-2 hover:bg-gray-600 cursor-pointer"
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
            placeholder="0.00"
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-3"
            value={input.quantity ?? ''}
            onChange={e => handleChange('quantity', e.target.value)}
          />
          <div className="relative w-full">
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-md text-gray-400">₩</span>
            <input
              type="number"
              min="0"
              step="any"
              placeholder="코인당 가격"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 pr-14"
              value={input.averagePrice ?? ''}
              onChange={e => handleChange('averagePrice', e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4">
          <input
            type="date"
            className="w-full bg-gray-800 text-neutral-100 rounded-lg px-4 py-3 text-base"
            value={input.date ?? ''}
            onChange={e => handleChange('date', e.target.value)}
          />
        </div>

        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-400">사용된 총액</p>
          <p className="text-xl font-semibold">₩ {totalPrice.toLocaleString()}</p>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
        >
          거래 추가
        </button>
      </form>
    </div>
  )
}

export default AssetModal