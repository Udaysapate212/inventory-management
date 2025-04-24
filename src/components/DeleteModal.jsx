import { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'

export default function DeleteModal({ product, onClose, onConfirm }) {
  const [isOpen, setIsOpen] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [generatedCode] = useState(Math.random().toString(36).substr(2, 6).toUpperCase())

  useEffect(() => {
    setIsOpen(!!product)
  }, [product])

  const handleConfirm = () => {
    if (verificationCode === generatedCode) {
      onConfirm()
    } else {
      alert('Invalid nuclear launch code!')
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen bg-black/50">
        <Dialog.Panel className="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <ExclamationTriangleIcon className="w-16 h-16 mx-auto text-danger mb-4" />
            <Dialog.Title className="text-2xl font-bold mb-2">
              Confirm Nuclear Deletion
            </Dialog.Title>
            
            <div className="space-y-4 mb-6">
              <p className="text-slate-400">
                You are about to permanently delete:<br />
                <span className="font-bold text-primary-500">{product?.name}</span>
              </p>
              
              <div className="bg-slate-700 p-4 rounded">
                <p className="text-xs font-mono mb-2">Enter verification code:</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xl font-bold tracking-wider">{generatedCode}</span>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                    className="bg-slate-600 text-center uppercase w-32 px-2 py-1 rounded"
                    autoComplete="off"
                    spellCheck="false"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={onClose}
                className="btn bg-slate-700 hover:bg-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={verificationCode !== generatedCode}
                className="btn bg-danger hover:bg-red-600 disabled:opacity-50"
              >
                CONFIRM DELETE
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}