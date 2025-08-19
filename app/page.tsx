// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

import { Separator } from "@/components/ui/separator";
import { ArrowUpRight } from "lucide-react";
import AppDock from "@/components/magicui/appdock";
import dynamic from "next/dynamic";
import { Meteors } from "@/components/magicui/meteors";
import  Hero  from "@/components/hero";

const HelloSplash = dynamic(() => import("@/components/hellosplash"), { ssr: true });

interface PublicNote {
  id: string;
  title: string;
  content: string;
  created_at: string;
}


function LoginPage() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })
  }
  return (
    <a onClick={handleLogin}> © {new Date().getFullYear()} SHREYAJ YADAV. </a> 
  )
}


export default function HomePage() {
  const [notes, setNotes] = useState<PublicNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("notes")
        .select("id, title, content, created_at")
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      if (!error) setNotes(data || []);
      setLoading(false);
    })();
  }, []);

  return (
    <HelloSplash step={160} hold={600} bigger>
    <Meteors />
    <div className="min-h-screen">
      {/* Hero */}
      <Hero />

      {/* Divider */}
      <div className="mx-auto mt-12 max-w-3xl px-6">
        <Separator />
      </div>

      <section className="mx-auto max-w-3xl px-6 py-12">
        
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-3xl px-6 pb-16 text-center text-xs text-muted-foreground">
       <LoginPage />
      </footer>
      <AppDock />
    </div>
    </HelloSplash>
  );
}
