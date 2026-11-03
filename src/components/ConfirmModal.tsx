'use client'

import { AlertTriangle } from 'lucide-react'
import Modal from './Modal'

interface Props {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  onClose: () => void
  onConfirm: () => void
}

export default function ConfirmModal({ open, title, description, confirmLabel, onClose, onConfirm }: Props) {
  return (
    <Modal open={open} onClose={onClose} title={title} description={description}>
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-500"><AlertTriangle size={23} /></div>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" className="btn-secondary" onClick={onClose}>Keep it</button>
        <button type="button" className="btn-danger" onClick={() => { onConfirm(); onClose() }}>{confirmLabel}</button>
      </div>
    </Modal>
  )
}
