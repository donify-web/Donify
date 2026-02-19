import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { initiateCheckout, PRICE_IDS } from '../../lib/stripeClient';
import { User } from '../../types';

interface OneTimeDonationButtonProps {
    user: User;
    amount?: number;
    className?: string; // Allow custom styling from parent
    children?: React.ReactNode;
    onDonationSuccess?: () => void; // Optional callback for mock mode or post-action
}

export const OneTimeDonationButton: React.FC<OneTimeDonationButtonProps> = ({
    user,
    amount = 5,
    className,
    children,
    onDonationSuccess
}) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const isMock = user.id.startsWith('mock-');

    const handleDonation = async () => {
        setIsUpdating(true);
        // Use price IDs from stripeClient. In this case, DONATION_5 is specifically for 5€
        // If we support other amounts in future, we'd map them here.
        const priceId = amount === 5 ? PRICE_IDS.DONATION_5 : PRICE_IDS.DONATION_5;

        if (isMock) {
            setTimeout(() => {
                setIsUpdating(false);
                alert(`[SIMULACIÓN] ¡Donación puntual de ${amount}€ recibida! Ya puedes votar.`);
                if (onDonationSuccess) onDonationSuccess();
            }, 1500);
        } else {
            const result = await initiateCheckout(priceId, user.id, 'payment');
            if (!result.success) {
                setIsUpdating(false);
                alert("Error al iniciar el proceso de pago.");
            }
            // Redirection happens inside initiateCheckout, so no need to stop loading if success
        }
    };

    return (
        <button
            onClick={handleDonation}
            disabled={isUpdating}
            className={className || "bg-primary text-white py-3 px-6 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"}
        >
            {isUpdating ? (
                <>
                    <Loader2 className="animate-spin" size={18} /> Procesando...
                </>
            ) : (
                children || `Donar ${amount}€`
            )}
        </button>
    );
};
