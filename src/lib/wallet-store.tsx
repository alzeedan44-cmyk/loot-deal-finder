import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type TxStatus = "pending" | "approved" | "withdrawal";
export type TxStore = "amazon" | "flipkart" | "myntra" | "ajio" | "nykaa" | "tatacliq" | "upi";

export type Transaction = {
  id: string;
  title: string;
  store: TxStore;
  coins: number; // signed
  timestamp: string;
  status: TxStatus;
};

type WalletState = {
  balance: number; // NeoCoins
  tier: "Bronze Saver" | "Silver Shopper";
  nextTierAt: number;
  transactions: Transaction[];
  addWithdrawal: (amount: number, upi: string) => void;
  credit: (amount: number, title: string, store: TxStore) => void;
};

const defaultTx: Transaction[] = [
  {
    id: "t1",
    title: "Purchase at Myntra",
    store: "myntra",
    coins: 45,
    timestamp: "Today · 2:14 PM",
    status: "pending",
  },
  {
    id: "t2",
    title: "Purchase at Amazon",
    store: "amazon",
    coins: 30,
    timestamp: "Yesterday · 6:48 PM",
    status: "approved",
  },
  {
    id: "t3",
    title: "UPI Payout Withdrawal",
    store: "upi",
    coins: -100,
    timestamp: "12 Jun · 11:02 AM",
    status: "withdrawal",
  },
];

const WalletContext = createContext<WalletState | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(80);
  const [transactions, setTransactions] = useState<Transaction[]>(defaultTx);

  const addWithdrawal = useCallback((amount: number, upi: string) => {
    setBalance((b) => Math.max(0, b - amount));
    setTransactions((tx) => [
      {
        id: `w${Date.now()}`,
        title: `UPI Payout to ${upi}`,
        store: "upi",
        coins: -amount,
        timestamp: "Just now",
        status: "withdrawal",
      },
      ...tx,
    ]);
  }, []);

  const credit = useCallback((amount: number, title: string, store: TxStore) => {
    setBalance((b) => b + amount);
    setTransactions((tx) => [
      {
        id: `c${Date.now()}`,
        title,
        store,
        coins: amount,
        timestamp: "Just now",
        status: "pending",
      },
      ...tx,
    ]);
  }, []);

  const value = useMemo<WalletState>(
    () => ({
      balance,
      tier: "Bronze Saver",
      nextTierAt: 200,
      transactions,
      addWithdrawal,
      credit,
    }),
    [balance, transactions, addWithdrawal, credit],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside WalletProvider");
  return ctx;
}
