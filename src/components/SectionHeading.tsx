import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

interface Props {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
  inverse?: boolean
}

export default function SectionHeading({ eyebrow, title, description, align = 'left', inverse = false }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center')}
    >
      <p className={cn('eyebrow', inverse && 'text-[#d9ff63]')}>{eyebrow}</p>
      <h2 className={cn('section-title mt-4', inverse && 'text-[#f6f3eb]')}>{title}</h2>
      {description && <p className={cn('mt-5 max-w-xl text-base leading-7 text-muted', align === 'center' && 'mx-auto', inverse && 'text-white/60')}>{description}</p>}
    </motion.div>
  )
}
