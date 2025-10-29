import React from 'react'

export default function DashboardLayout({children}: {children: React.ReactNode}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0 }}>
      {/* Ensure dashboard children can grow inside the app main area */}
      {children}
    </div>
  )
}
