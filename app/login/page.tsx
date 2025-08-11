'use client'

import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <button
        onClick={handleLogin}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Sign in with Google
      </button>
    </div>
  )
}
