'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        window.location.href = '/login'
      } else {
        setSession(data.session)
      }
      setLoading(false)
    })
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Private Dashboard</h1>
      <p>Welcome, {session?.user?.email}</p>
    </div>
  )
}
