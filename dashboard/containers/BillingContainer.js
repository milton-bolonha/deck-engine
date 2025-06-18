"use client";

import { useDashboard } from "../contexts/DashboardContext";

export default function BillingContainer() {
  const { state } = useDashboard();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Billing & Payments
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Gerencie pagamentos, planos e receita
          </p>
        </div>

        <button className="btn-primary">
          <i className="fas fa-credit-card mr-2"></i>
          Novo Plano
        </button>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="gaming-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">MRR</p>
              <p className="text-2xl font-bold text-victory">R$ 12.5k</p>
              <p className="text-xs text-victory">+12% this month</p>
            </div>
            <i className="fas fa-chart-line text-2xl text-victory"></i>
          </div>
        </div>

        <div className="gaming-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">ARR</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                R$ 150k
              </p>
              <p className="text-xs text-slate-500">annual recurring</p>
            </div>
            <i className="fas fa-dollar-sign text-2xl text-gaming-gold"></i>
          </div>
        </div>

        <div className="gaming-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Churn Rate
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                2.3%
              </p>
              <p className="text-xs text-defeat">+0.5% this month</p>
            </div>
            <i className="fas fa-user-minus text-2xl text-defeat"></i>
          </div>
        </div>

        <div className="gaming-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Active Subs
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                347
              </p>
              <p className="text-xs text-victory">+23 this month</p>
            </div>
            <i className="fas fa-users text-2xl text-blue-500"></i>
          </div>
        </div>
      </div>

      {/* Plans Overview */}
      <div className="gaming-card p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Planos de Assinatura
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Starter", price: "R$ 29", users: 156, color: "blue" },
            {
              name: "Professional",
              price: "R$ 79",
              users: 98,
              color: "purple",
            },
            { name: "Enterprise", price: "R$ 199", users: 23, color: "gold" },
          ].map((plan) => (
            <div
              key={plan.name}
              className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-slate-900 dark:text-slate-100">
                  {plan.name}
                </h3>
                <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {plan.price}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">
                  {plan.users} usuários
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    plan.color === "gold"
                      ? "bg-yellow-100 text-yellow-800"
                      : plan.color === "purple"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  Ativo
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="gaming-card overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Transações Recentes
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Plano</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  id: 1,
                  customer: "João Silva",
                  plan: "Professional",
                  amount: "R$ 79,00",
                  status: "paid",
                  date: "2 min ago",
                },
                {
                  id: 2,
                  customer: "Maria Santos",
                  plan: "Starter",
                  amount: "R$ 29,00",
                  status: "paid",
                  date: "1 hour ago",
                },
                {
                  id: 3,
                  customer: "Pedro Costa",
                  plan: "Enterprise",
                  amount: "R$ 199,00",
                  status: "failed",
                  date: "2 hours ago",
                },
              ].map((transaction) => (
                <tr key={transaction.id}>
                  <td className="font-medium">{transaction.customer}</td>
                  <td>{transaction.plan}</td>
                  <td className="font-medium">{transaction.amount}</td>
                  <td>
                    <span
                      className={`status-indicator ${
                        transaction.status === "paid"
                          ? "status-online"
                          : "status-offline"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td>{transaction.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
