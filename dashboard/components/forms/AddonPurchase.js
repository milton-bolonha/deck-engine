"use client";

export default function AddonPurchase({ addon, section }) {
  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <i className="fas fa-crown text-4xl text-gaming-gold mb-3"></i>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Premium Feature Required
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          This feature requires the {addon} addon
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
          <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
            {addon} Features:
          </h4>
          <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
            <li>
              <i className="fas fa-check text-victory mr-2"></i>Advanced
              functionality
            </li>
            <li>
              <i className="fas fa-check text-victory mr-2"></i>Priority support
            </li>
            <li>
              <i className="fas fa-check text-victory mr-2"></i>Premium
              templates
            </li>
          </ul>
        </div>

        <div className="text-center">
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            R$ 99
            <span className="text-sm font-normal text-slate-500">/month</span>
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Cancel anytime
          </p>
        </div>

        <div className="space-y-2">
          <button className="btn-gaming-gold w-full">
            <i className="fas fa-crown mr-2"></i>
            Purchase {addon} - R$ 99/month
          </button>
          <button className="w-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-sm p-2">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
