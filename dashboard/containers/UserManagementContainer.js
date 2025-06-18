"use client";

import { useDashboard } from "../contexts/DashboardContext";

export default function UserManagementContainer() {
  const { state } = useDashboard();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            User Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Gerencie usuários, roles e permissões
          </p>
        </div>

        <button className="btn-primary">
          <i className="fas fa-user-plus mr-2"></i>
          Novo Usuário
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="gaming-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Total Users
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                42
              </p>
            </div>
            <i className="fas fa-users text-2xl text-blue-500"></i>
          </div>
        </div>

        <div className="gaming-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Active
              </p>
              <p className="text-2xl font-bold text-victory">38</p>
            </div>
            <i className="fas fa-user-check text-2xl text-victory"></i>
          </div>
        </div>

        <div className="gaming-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Admins
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                5
              </p>
            </div>
            <i className="fas fa-user-shield text-2xl text-purple-500"></i>
          </div>
        </div>

        <div className="gaming-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                New Today
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                3
              </p>
            </div>
            <i className="fas fa-user-plus text-2xl text-green-500"></i>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="gaming-card overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Usuários
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Último Login</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {/* Mock users */}
              {[
                {
                  id: 1,
                  name: "João Silva",
                  email: "joao@exemplo.com",
                  role: "admin",
                  status: "active",
                  lastLogin: "2 min ago",
                },
                {
                  id: 2,
                  name: "Maria Santos",
                  email: "maria@exemplo.com",
                  role: "user",
                  status: "active",
                  lastLogin: "1 hour ago",
                },
                {
                  id: 3,
                  name: "Pedro Costa",
                  email: "pedro@exemplo.com",
                  role: "manager",
                  status: "inactive",
                  lastLogin: "2 days ago",
                },
              ].map((user) => (
                <tr key={user.id}>
                  <td className="font-medium">{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : user.role === "manager"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-indicator ${
                        user.status === "active"
                          ? "status-online"
                          : "status-offline"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td>{user.lastLogin}</td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-500 hover:text-blue-700 text-sm">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="text-red-500 hover:text-red-700 text-sm">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
