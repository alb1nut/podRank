// components/ProtectedRoute.tsx
"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppUtils } from '@/context/AppUtils';
import { useToast } from '@/hooks/use-toast';
// import { toast } from '@/components/ui/use-toast';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAppUtils();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      if (!isLoggedIn) {
        toast({
          title: "Access Denied",
          description: "Please log in to continue",
          variant: "destructive",
        });
        router.push('/');
      }
      setLoading(false);
    };
    checkAuth();
  }, [isLoggedIn, router, toast]);

  if (loading || !isLoggedIn) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
}