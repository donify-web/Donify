import React, { useState } from 'react';
import { PageView } from '../types';
import { ArrowLeft, Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react'; // Removed Terminal, Code2, PlayCircle
import { supabase } from '../lib/supabaseClient';

interface LoginProps {
  onNavigate: (view: PageView) => void;
  initialState?: 'login' | 'signup';
  // Removed onMockLogin
}

// ... (GoogleLogo component remains the same)

export default function Login({ onNavigate, initialState = 'login' }: LoginProps) { // Removed onMockLogin arg
  const [isSignUp, setIsSignUp] = useState(initialState === 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  // Removed showDevMenu state

  // ... (handleGoogleLogin and handleSubmit remain the same)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 relative">
      {/* ... (The rest of the form UI remains the same) ... */}

      {/* DELETE the entire Quick Switcher block starting here: */}
      {/* {showDevMenu && onMockLogin && ( ... )} */} 
      {/* Ensure the closing </div> of the main container is the last thing */}
    </div>
  );
}