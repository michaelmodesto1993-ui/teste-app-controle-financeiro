import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Transaction, TransactionType, Account, AccountType } from '../types.ts';
import { formatCurrency, formatDateRelative } from '../utils/helpers.ts';
import { BellIcon } from './icons.tsx';

interface NotificationsProps {
    transactions: Transaction[];
    onUpdateTransaction: (transaction: Transaction) => void;
    accounts: Account[];
    creditCardAlertThreshold: number;
}

type NotificationItem = {
    id: string;
    type: 'bill' | 'limit';
    message: string;
    details: string;
    amount?: number;
    action?: () => void;
    isUrgent: boolean;
};

const Notifications: React.FC<NotificationsProps> = ({ transactions, onUpdateTransaction, accounts, creditCardAlertThreshold }) => {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownPanelRef = useRef<HTMLDivElement>(null);

    const allNotifications = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const upcomingDateLimit = new Date(today);
        upcomingDateLimit.setDate(today.getDate() + 7);

        // 1. Upcoming Bills
        const billNotifications: NotificationItem[] = transactions
            .filter(t => {
                if (t.type !== TransactionType.EXPENSE || t.isPaid) return false;
                const dueDate = new Date(t.date + 'T00:00:00');
                return dueDate <= upcomingDateLimit;
            })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map(t => {
                const relativeDate = formatDateRelative(t.date);
                return {
                    id: t.id,
                    type: 'bill',
                    message: t.description,
                    details: relativeDate,
                    amount: t.amount,
                    action: () => onUpdateTransaction({ ...t, isPaid: true }),
                    isUrgent: relativeDate.includes('Vencido'),
                };
            });

        // 2. Credit Card Limit Warnings
        const limitNotifications: NotificationItem[] = accounts
            .filter(acc => acc.type === AccountType.CREDIT_CARD && acc.limit && acc.limit > 0)
            .map(acc => {
                const unpaidExpenses = transactions
                    .filter(t => t.accountId === acc.id && t.type === TransactionType.EXPENSE && !t.isPaid)
                    .reduce((sum, t) => sum + t.amount, 0);
                
                const usedPercentage = (unpaidExpenses / acc.limit!) * 100;

                if (usedPercentage >= creditCardAlertThreshold) {
                    return {
                        id: `limit-${acc.id}`,
                        type: 'limit',
                        message: `Limite do ${acc.name} quase atingido!`,
                        details: `Você usou ${usedPercentage.toFixed(0)}% do seu limite.`,
                        isUrgent: true,
                    };
                }
                return null;
            })
            .filter((item): item is NotificationItem => item !== null);

        return [...billNotifications, ...limitNotifications];

    }, [transactions, accounts, creditCardAlertThreshold]);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!isOpen) return;
            if (
                buttonRef.current && !buttonRef.current.contains(event.target as Node) &&
                dropdownPanelRef.current && !dropdownPanelRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div>
            <button ref={buttonRef} onClick={() => setIsOpen(!isOpen)} className="relative p-2 rounded-full hover:bg-surface-dark text-text-secondary hover:text-text-primary">
                <BellIcon className="w-6 h-6" />
                {allNotifications.length > 0 && (
                    <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-expense text-white text-xs flex items-center justify-center ring-2 ring-surface">
                        {allNotifications.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div ref={dropdownPanelRef} className="absolute mt-2 left-4 right-4 max-w-sm sm:left-auto sm:right-8 sm:w-96 bg-surface-dark rounded-lg shadow-xl z-20 border border-border">
                    <div className="p-4 border-b border-border">
                        <h4 className="font-bold">Notificações</h4>
                    </div>
                    {allNotifications.length > 0 ? (
                        <ul className="py-2 max-h-96 overflow-y-auto">
                            {allNotifications.map(item => (
                                <li key={item.id} className="px-4 py-3 hover:bg-surface transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-sm">{item.message}</p>
                                            <p className={`text-xs mt-1 font-semibold ${item.isUrgent ? 'text-expense' : 'text-text-secondary'}`}>
                                                {item.details}
                                            </p>
                                        </div>
                                        <div className="text-right flex-shrink-0 ml-2">
                                            {item.amount && <p className="font-bold text-sm text-expense">{formatCurrency(item.amount)}</p>}
                                            {item.action && (
                                                <button 
                                                    onClick={item.action} 
                                                    className="mt-1 text-xs bg-primary text-white font-bold py-1 px-2 rounded hover:bg-primary-dark transition-colors">
                                                    Pagar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-text-secondary text-center text-sm p-6">Nenhuma notificação pendente.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Notifications;