'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { ChevronDown } from 'lucide-react'

export const PaymentOptions = ({ orderData }: any) => {
  const router = useRouter()
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [accountName, setAccountName] = useState("")

  const paymentMethods = [
    { label: 'JazzCash', method: 'jazzcash', img: '/images/jazzcash-logo.png' },
    { label: 'EasyPaisa', method: 'easypaisa', img: '/images/easypaisa-logo.jpg' },
    { label: 'NayaPay', method: 'nayapay', img: '/images/nayapay-logo.png' },
    { label: 'Cash on Delivery', method: 'cod', img: '/images/cod-logo.jpg' },
  ]

  const paymentDetails: any = {
    jazzcash: { number: '+923205421692', link: 'https://play.google.com/store/apps/details?id=com.techlogix.mobilinkcustomer&hl=en' },
    easypaisa: { number: '03182325757', link: 'https://play.google.com/store/apps/details?id=pk.com.telenor.phoenix&hl=en' },
    nayapay: { number: 'PK91NAYA1234503182325757', link: 'https://play.google.com/store/apps/details?id=com.nayapay.app&hl=en' },
  }

  const handleConfirm = async () => {
    if (!selectedMethod) {
      toast.error('Please select a payment method')
      return
    }

    if (selectedMethod !== 'cod' && !accountName.trim()) {
      toast.error('Please enter your account name')
      return
    }

    setOpenModal(true)

    const mergedItems = orderData.items.reduce((acc: any, item: any, index: number) => {
      acc[`item${index + 1}`] = item
      return acc
    }, {})

    const paymentData = {
      orderData: {
        ...orderData,
        items: mergedItems,
      },
      selectedMethod: selectedMethod,
      accountName: accountName,
      paymentDetails: paymentDetails[selectedMethod],
      delivered: false,
      total_pay_completed: false,
    }

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData, null, 2),
      })

      if (response.ok) {
        const result = await response.json()
        console.log(result)
        toast.success('Order placed successfully!')
      } else {
        console.error('Error saving payment data')
        toast.error('Failed to place order. Please try again.')
      }
    } catch (error) {
      console.error('Something went wrong:', error)
      toast.error('An error occurred. Please try later!')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Payment Method</h2>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Payment Method
        </label>
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="flex items-center">
              {selectedMethod ? (
                <>
                  <img 
                    src={paymentMethods.find(pm => pm.method === selectedMethod)?.img} 
                    alt={paymentMethods.find(pm => pm.method === selectedMethod)?.label}
                    className="w-6 h-6 mr-2 object-contain"
                  />
                  <span className="text-gray-700">
                    {paymentMethods.find(pm => pm.method === selectedMethod)?.label}
                  </span>
                </>
              ) : (
                <span className="text-gray-500">Choose an option</span>
              )}
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${open ? 'transform rotate-180' : ''}`} />
          </button>

          {open && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-300">
              <ul className="py-1 max-h-60 overflow-auto">
                {paymentMethods.map((pm) => (
                  <li
                    key={pm.method}
                    onClick={() => {
                      setSelectedMethod(pm.method)
                      setOpen(false)
                    }}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <img src={pm.img} alt={pm.label} className="w-6 h-6 mr-3 object-contain" />
                    <span className="text-gray-700">{pm.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Payment Details */}
      {selectedMethod && selectedMethod !== 'cod' && (
        <div className="mb-6 p-4 bg-blue-50 rounded-md border border-blue-100">
          <h3 className="text-sm font-medium text-blue-800 mb-3">Payment Instructions</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Recipient Number:</span>
              <span className="font-mono font-medium text-gray-800">
                {paymentDetails[selectedMethod]?.number}
              </span>
            </div>
            <a
              href={paymentDetails[selectedMethod]?.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full mt-3 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Open Payment App
            </a>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            After payment, please enter the account name used for the transaction below.
          </p>
        </div>
      )}

      {/* Account Name Input */}
      {(selectedMethod && selectedMethod !== 'cod') && (
        <div className="mb-6">
          <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-1">
            Account Holder Name
          </label>
          <input
            type="text"
            id="accountName"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter name as registered with payment service"
            required
          />
        </div>
      )}

      {/* Confirm Button */}
      <button
        onClick={handleConfirm}
        disabled={!selectedMethod || (selectedMethod !== 'cod' && !accountName.trim())}
        className={`w-full px-4 py-3 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          (!selectedMethod || (selectedMethod !== 'cod' && !accountName.trim())) 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        }`}
      >
        Confirm Order
      </button>

      {/* Success Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Order Confirmed</h3>
            <p className="text-sm text-gray-500 mb-4">
              Thank you for your order! We've received your payment details and will process your order shortly.
            </p>
            <button
              onClick={() => router.push('/')}
              className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  )
}'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { ChevronDown } from 'lucide-react'

export const PaymentOptions = ({ orderData }: any) => {
  const router = useRouter()
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [accountName, setAccountName] = useState("")

  const paymentMethods = [
    { label: 'JazzCash', method: 'jazzcash', img: '/images/jazzcash-logo.png' },
    { label: 'EasyPaisa', method: 'easypaisa', img: '/images/easypaisa-logo.jpg' },
    { label: 'NayaPay', method: 'nayapay', img: '/images/nayapay-logo.png' },
    { label: 'Cash on Delivery', method: 'cod', img: '/images/cod-logo.jpg' },
  ]

  const paymentDetails: any = {
    jazzcash: { number: '+923205421692', link: 'https://play.google.com/store/apps/details?id=com.techlogix.mobilinkcustomer&hl=en' },
    easypaisa: { number: '03182325757', link: 'https://play.google.com/store/apps/details?id=pk.com.telenor.phoenix&hl=en' },
    nayapay: { number: 'PK91NAYA1234503182325757', link: 'https://play.google.com/store/apps/details?id=com.nayapay.app&hl=en' },
  }

  const handleConfirm = async () => {
    if (!selectedMethod) {
      toast.error('Please select a payment method')
      return
    }

    if (selectedMethod !== 'cod' && !accountName.trim()) {
      toast.error('Please enter your account name')
      return
    }

    setOpenModal(true)

    const mergedItems = orderData.items.reduce((acc: any, item: any, index: number) => {
      acc[`item${index + 1}`] = item
      return acc
    }, {})

    const paymentData = {
      orderData: {
        ...orderData,
        items: mergedItems,
      },
      selectedMethod: selectedMethod,
      accountName: accountName,
      paymentDetails: paymentDetails[selectedMethod],
      delivered: false,
      total_pay_completed: false,
    }

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData, null, 2),
      })

      if (response.ok) {
        const result = await response.json()
        console.log(result)
        toast.success('Order placed successfully!')
      } else {
        console.error('Error saving payment data')
        toast.error('Failed to place order. Please try again.')
      }
    } catch (error) {
      console.error('Something went wrong:', error)
      toast.error('An error occurred. Please try later!')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Payment Method</h2>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Payment Method
        </label>
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="flex items-center">
              {selectedMethod ? (
                <>
                  <img 
                    src={paymentMethods.find(pm => pm.method === selectedMethod)?.img} 
                    alt={paymentMethods.find(pm => pm.method === selectedMethod)?.label}
                    className="w-6 h-6 mr-2 object-contain"
                  />
                  <span className="text-gray-700">
                    {paymentMethods.find(pm => pm.method === selectedMethod)?.label}
                  </span>
                </>
              ) : (
                <span className="text-gray-500">Choose an option</span>
              )}
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${open ? 'transform rotate-180' : ''}`} />
          </button>

          {open && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-300">
              <ul className="py-1 max-h-60 overflow-auto">
                {paymentMethods.map((pm) => (
                  <li
                    key={pm.method}
                    onClick={() => {
                      setSelectedMethod(pm.method)
                      setOpen(false)
                    }}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <img src={pm.img} alt={pm.label} className="w-6 h-6 mr-3 object-contain" />
                    <span className="text-gray-700">{pm.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Payment Details */}
      {selectedMethod && selectedMethod !== 'cod' && (
        <div className="mb-6 p-4 bg-blue-50 rounded-md border border-blue-100">
          <h3 className="text-sm font-medium text-blue-800 mb-3">Payment Instructions</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Recipient Number:</span>
              <span className="font-mono font-medium text-gray-800">
                {paymentDetails[selectedMethod]?.number}
              </span>
            </div>
            <a
              href={paymentDetails[selectedMethod]?.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full mt-3 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Open Payment App
            </a>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            After payment, please enter the account name used for the transaction below.
          </p>
        </div>
      )}

      {/* Account Name Input */}
      {(selectedMethod && selectedMethod !== 'cod') && (
        <div className="mb-6">
          <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-1">
            Account Holder Name
          </label>
          <input
            type="text"
            id="accountName"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter name as registered with payment service"
            required
          />
        </div>
      )}

      {/* Confirm Button */}
      <button
        onClick={handleConfirm}
        disabled={!selectedMethod || (selectedMethod !== 'cod' && !accountName.trim())}
        className={`w-full px-4 py-3 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          (!selectedMethod || (selectedMethod !== 'cod' && !accountName.trim())) 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        }`}
      >
        Confirm Order
      </button>

      {/* Success Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Order Confirmed</h3>
            <p className="text-sm text-gray-500 mb-4">
              Thank you for your order! We've received your payment details and will process your order shortly.
            </p>
            <button
              onClick={() => router.push('/')}
              className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
