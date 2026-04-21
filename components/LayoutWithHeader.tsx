'use client'

import Header from './Header'

export default function LayoutWithHeader({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
