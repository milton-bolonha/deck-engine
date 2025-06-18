"use client";

export default function SectionInfo({ section }) {
  const sectionData = {
    overview: {
      title: "Dashboard Overview",
      description: "Visão geral completa do sistema DeckEngine",
      icon: "fas fa-tachometer-alt",
      features: [
        "Métricas em tempo real",
        "Status do sistema",
        "Atividade recente",
        "Matches ativos",
      ],
    },
    pipelines: {
      title: "Pipeline Builder",
      description: "Construtor visual de pipelines DeckEngine",
      icon: "fas fa-project-diagram",
      features: [
        "Editor drag & drop",
        "Preview de código",
        "Execução em tempo real",
        "Biblioteca de cards",
      ],
    },
    execution: {
      title: "Live Execution",
      description: "Monitoramento de execução ao vivo",
      icon: "fas fa-play-circle",
      features: [
        "Logs em tempo real",
        "Métricas de performance",
        "Debug de matches",
        "Alertas automáticos",
      ],
    },
    library: {
      title: "Pipeline Library",
      description: "Biblioteca de pipelines salvos",
      icon: "fas fa-layer-group",
      features: [
        "Templates pré-construídos",
        "Versionamento",
        "Compartilhamento",
        "Importar/Exportar",
      ],
    },
    users: {
      title: "User Management",
      description: "Gestão completa de usuários",
      icon: "fas fa-users",
      features: [
        "Cadastro automatizado",
        "Roles e permissões",
        "Onboarding",
        "Analytics de usuários",
      ],
    },
    billing: {
      title: "Billing & Revenue",
      description: "Sistema de faturamento integrado",
      icon: "fas fa-credit-card",
      features: [
        "Stripe integration",
        "Cobrança automática",
        "Métricas de receita",
        "Gestão de planos",
      ],
    },
    analytics: {
      title: "Analytics Dashboard",
      description: "Analytics básicos do sistema",
      icon: "fas fa-chart-line",
      features: [
        "Métricas de uso",
        "Performance",
        "Relatórios básicos",
        "Exportação de dados",
      ],
    },
    analytics_pro: {
      title: "Analytics Pro",
      description: "Analytics avançados e insights",
      icon: "fas fa-chart-area",
      features: [
        "Machine Learning insights",
        "Predições avançadas",
        "Relatórios customizados",
        "Business Intelligence",
      ],
    },
    automation: {
      title: "Email Automation",
      description: "Sistema de automação de emails",
      icon: "fas fa-robot",
      features: [
        "Templates de email",
        "Workflows automáticos",
        "Triggers personalizados",
        "Analytics de campanhas",
      ],
    },
    addons: {
      title: "Addons Store",
      description: "Loja de complementos e extensões",
      icon: "fas fa-puzzle-piece",
      features: [
        "Marketplace de addons",
        "Instalação automática",
        "Configuração simplificada",
        "Atualizações automáticas",
      ],
    },
    providers: {
      title: "Provider Configuration",
      description: "Configuração de provedores externos",
      icon: "fas fa-cogs",
      features: [
        "Stripe, SendGrid, MongoDB",
        "Teste de conexões",
        "Configuração segura",
        "Monitoramento de status",
      ],
    },
    meta_admin: {
      title: "Meta Administration",
      description: "Administração avançada do sistema",
      icon: "fas fa-crown",
      features: [
        "Configurações globais",
        "Backup e restore",
        "Logs do sistema",
        "Manutenção avançada",
      ],
    },
    devtools: {
      title: "Developer Tools",
      description: "Ferramentas para desenvolvedores",
      icon: "fas fa-code",
      features: [
        "API explorer",
        "Code generator",
        "Debug tools",
        "Performance profiler",
      ],
    },
  };

  const data = sectionData[section] || sectionData.overview;

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
          <i
            className={`${data.icon} text-2xl text-primary-600 dark:text-primary-400`}
          ></i>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          {data.title}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {data.description}
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
          Principais Funcionalidades:
        </h3>
        <ul className="space-y-2">
          {data.features.map((feature, index) => (
            <li
              key={index}
              className="flex items-center text-sm text-slate-600 dark:text-slate-400"
            >
              <i className="fas fa-check-circle text-green-500 mr-3 flex-shrink-0"></i>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <i className="fas fa-info-circle text-blue-500"></i>
          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Dica
          </span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Use a navegação à esquerda para acessar diferentes seções do
          DeckEngine Dashboard. Cada seção oferece ferramentas específicas para
          gerenciar seu sistema.
        </p>
      </div>
    </div>
  );
}
