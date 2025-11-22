import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface SubscribeButtonProps {
  sessionTypeId: number;
  className?: string;
}

export function SubscribeButton({ sessionTypeId, className }: SubscribeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const createCheckout = trpc.stripe.createPublicCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      console.error('Checkout error:', error);
      alert('Failed to create checkout session. Please try again.');
      setIsLoading(false);
    },
  });

  const handleSubscribe = async () => {
    setIsLoading(true);
    createCheckout.mutate({ sessionTypeId });
  };

  return (
    <Button
      onClick={handleSubscribe}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        'Start Now'
      )}
    </Button>
  );
}
