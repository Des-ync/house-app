import React, { useState, useMemo } from 'react';
import { formatMoney } from '../utils/currency';

interface MortgageCalculatorProps {
  priceMinorUnits: number;
  currencyCode: string;
}

const MortgageCalculator: React.FC<MortgageCalculatorProps> = ({ priceMinorUnits, currencyCode }) => {
  const price = priceMinorUnits / 100; // Convert to major units for calculation
  const [downPayment, setDownPayment] = useState(price * 0.2);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  
  const downPaymentPercentage = price > 0 ? (downPayment / price) * 100 : 0;

  const monthlyPayment = useMemo(() => {
    const principal = price - downPayment;
    if (principal <= 0) return 0;
    
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    if (monthlyInterestRate === 0) return principal / numberOfPayments;

    const numerator = monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments);
    const denominator = Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1;
    
    return principal * (numerator / denominator);
  }, [price, downPayment, interestRate, loanTerm]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-baseline">
        <h3 className="font-semibold text-slate-700 dark:text-slate-300">Payment Estimate</h3>
        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{formatMoney(monthlyPayment * 100, currencyCode)}<span className="text-base font-normal text-slate-500 dark:text-slate-400">/mo</span></p>
      </div>

      <div className="space-y-3 text-sm">
        {/* Down Payment Slider */}
        <div>
          <div className="flex justify-between">
            <label htmlFor="down-payment" className="font-medium text-slate-600 dark:text-slate-400">Down Payment</label>
            <span className="text-slate-800 dark:text-slate-200 font-semibold">{formatMoney(downPayment * 100, currencyCode)} ({downPaymentPercentage.toFixed(0)}%)</span>
          </div>
          <input
            id="down-payment"
            type="range"
            min="0"
            max={price}
            step={price / 100} // 1% increments
            value={downPayment}
            onChange={(e) => setDownPayment(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Interest Rate Slider */}
         <div>
          <div className="flex justify-between">
            <label htmlFor="interest-rate" className="font-medium text-slate-600 dark:text-slate-400">Interest Rate</label>
            <span className="text-slate-800 dark:text-slate-200 font-semibold">{interestRate.toFixed(2)}%</span>
          </div>
          <input
            id="interest-rate"
            type="range"
            min="1"
            max="15"
            step="0.125"
            value={interestRate}
            onChange={(e) => setInterestRate(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Loan Term Slider */}
        <div>
          <div className="flex justify-between">
            <label htmlFor="loan-term" className="font-medium text-slate-600 dark:text-slate-400">Loan Term</label>
            <span className="text-slate-800 dark:text-slate-200 font-semibold">{loanTerm} years</span>
          </div>
          <input
            id="loan-term"
            type="range"
            min="10"
            max="30"
            step="5"
            value={loanTerm}
            onChange={(e) => setLoanTerm(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculator;