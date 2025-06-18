# 💳 Guia User Management & Billing - DeckEngine

> **Sistema completo de gestão de usuários e faturamento usando DeckEngine como core de processamento**

## 🎯 **Visão Geral**

O DeckEngine serve como **engine de processamento** para todas as operações de:

- 👥 **User Lifecycle Management** (cadastro, updates, cancelamento)
- 💳 **Billing & Payments** (Stripe integration, cobrança automática)
- 📊 **Usage Analytics** (métricas, limites, overages)
- 🔔 **Notifications** (emails transacionais, alertas)

## 👥 **User Management**

### **🆕 Cadastro de Usuário Completo**

```javascript
// Deck: complete-user-registration
const userRegistrationDeck = engine.createDeck("complete-user-registration", {
  concurrency: 3,
  timeout: 120000, // 2 minutos para todo o processo
  retries: 2,
});

userRegistrationDeck
  .addCard("validate-registration-data", async (context) => {
    const { email, password, planId, paymentMethod, companyInfo } =
      context.payload;

    // Validações
    const validations = await Promise.all([
      validateEmail(email),
      validatePassword(password),
      validatePlan(planId),
      validatePaymentMethod(paymentMethod),
    ]);

    if (validations.some((v) => !v.valid)) {
      throw new Error(
        "Dados inválidos: " +
          validations
            .filter((v) => !v.valid)
            .map((v) => v.error)
            .join(", ")
      );
    }

    return { ...context, validationsPassed: true };
  })

  .addCard("check-email-uniqueness", async (context) => {
    const existingUser = await User.findOne({ email: context.payload.email });

    if (existingUser) {
      throw new Error("Email já cadastrado no sistema");
    }

    return { ...context, emailUnique: true };
  })

  .addCard("create-database-user", async (context) => {
    const hashedPassword = await bcrypt.hash(context.payload.password, 12);

    const user = await User.create({
      email: context.payload.email,
      password: hashedPassword,
      planId: context.payload.planId,
      status: "pending_payment",
      companyInfo: context.payload.companyInfo,
      createdAt: new Date(),
      trial: {
        active: true,
        endsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 dias
      },
    });

    return { ...context, user, userId: user._id };
  })

  .addCard("setup-stripe-customer", async (context) => {
    const plan = await Plan.findById(context.payload.planId);

    // Criar customer no Stripe
    const customer = await stripe.customers.create({
      email: context.payload.email,
      name: context.payload.companyInfo?.name || context.payload.email,
      metadata: {
        userId: context.userId.toString(),
        planId: plan.id,
        source: "app_registration",
      },
    });

    // Anexar método de pagamento
    await stripe.paymentMethods.attach(context.payload.paymentMethod, {
      customer: customer.id,
    });

    // Definir como padrão
    await stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: context.payload.paymentMethod,
      },
    });

    return {
      ...context,
      stripeCustomerId: customer.id,
      paymentMethodAttached: true,
    };
  })

  .addCard("create-subscription", async (context) => {
    const plan = await Plan.findById(context.payload.planId);

    // Criar subscription com trial
    const subscription = await stripe.subscriptions.create({
      customer: context.stripeCustomerId,
      items: [
        {
          price: plan.stripePriceId,
        },
      ],
      trial_period_days: 14,
      expand: ["latest_invoice.payment_intent"],
      metadata: {
        userId: context.userId.toString(),
        planName: plan.name,
      },
    });

    return {
      ...context,
      subscription,
      subscriptionId: subscription.id,
    };
  })

  .addCard("update-user-with-billing", async (context) => {
    // Atualizar usuário com dados de billing
    const updatedUser = await User.findByIdAndUpdate(
      context.userId,
      {
        stripeCustomerId: context.stripeCustomerId,
        subscriptionId: context.subscriptionId,
        status: "active",
        trial: {
          active: true,
          endsAt: new Date(context.subscription.trial_end * 1000),
        },
      },
      { new: true }
    );

    return { ...context, updatedUser };
  })

  .addCard("setup-user-limits", async (context) => {
    const plan = await Plan.findById(context.payload.planId);

    // Configurar limites baseados no plano
    const userLimits = await UserLimit.create({
      userId: context.userId,
      planId: plan.id,
      limits: {
        apiCalls: plan.limits.apiCalls,
        dataStorage: plan.limits.dataStorage,
        users: plan.limits.users,
        pipelines: plan.limits.pipelines,
      },
      usage: {
        apiCalls: 0,
        dataStorage: 0,
        users: 1,
        pipelines: 0,
      },
      resetDate: getNextResetDate(),
    });

    return { ...context, userLimits };
  })

  .addCard("send-welcome-sequence", async (context) => {
    // Enviar sequência de boas-vindas
    const emailsToSend = [
      {
        template: "welcome-immediate",
        delay: 0,
        data: {
          userName:
            context.updatedUser.companyInfo?.name || context.updatedUser.email,
          trialEndsAt: context.updatedUser.trial.endsAt,
          planName: context.payload.planName,
        },
      },
      {
        template: "getting-started-tips",
        delay: 1000 * 60 * 60, // 1 hora depois
        data: {
          setupGuideUrl: `${process.env.APP_URL}/setup`,
          documentationUrl: `${process.env.APP_URL}/docs`,
        },
      },
      {
        template: "trial-day-7-reminder",
        delay: 1000 * 60 * 60 * 24 * 7, // 7 dias depois
        scheduled: true,
      },
    ];

    // Enviar primeiro email imediatamente
    await sendEmail({
      to: context.payload.email,
      ...emailsToSend[0],
    });

    // Agendar outros emails
    for (let i = 1; i < emailsToSend.length; i++) {
      await scheduleEmail({
        to: context.payload.email,
        ...emailsToSend[i],
        sendAt: new Date(Date.now() + emailsToSend[i].delay),
      });
    }

    return { ...context, welcomeSequenceStarted: true };
  })

  .addCard("track-registration-conversion", async (context) => {
    // Analytics de conversão
    await trackEvent("user_registration_completed", {
      userId: context.userId,
      planId: context.payload.planId,
      source: context.payload.source || "direct",
      paymentMethod: context.payload.paymentMethod.type,
      timestamp: new Date(),
    });

    return { ...context, conversionTracked: true };
  });

// Executar registro completo
async function registerNewUser(registrationData) {
  try {
    const result = await engine.playAndWait(
      "complete-user-registration",
      registrationData
    );

    return {
      success: true,
      userId: result.userId,
      user: result.updatedUser,
      trial: result.updatedUser.trial,
      subscription: {
        id: result.subscriptionId,
        status: result.subscription.status,
      },
    };
  } catch (error) {
    // Log error e cleanup se necessário
    console.error("Registration failed:", error);

    // TODO: Implementar rollback se usuário foi criado mas billing falhou

    return {
      success: false,
      error: error.message,
    };
  }
}
```

### **🔄 Upgrade/Downgrade de Plano**

```javascript
// Deck: plan-change
const planChangeDeck = engine
  .createDeck("plan-change")
  .addCard("validate-plan-change", async (context) => {
    const { userId, newPlanId, currentPlanId } = context.payload;

    const [user, currentPlan, newPlan] = await Promise.all([
      User.findById(userId),
      Plan.findById(currentPlanId),
      Plan.findById(newPlanId),
    ]);

    if (!user || !currentPlan || !newPlan) {
      throw new Error("Usuário ou plano não encontrado");
    }

    // Validar se mudança é permitida
    if (
      newPlan.level < currentPlan.level &&
      user.subscription.status === "active"
    ) {
      // Downgrade - verificar se não excede limites do novo plano
      const currentUsage = await getCurrentUsage(userId);

      if (currentUsage.users > newPlan.limits.users) {
        throw new Error(
          `Você tem ${currentUsage.users} usuários, mas o novo plano permite apenas ${newPlan.limits.users}`
        );
      }
    }

    return {
      ...context,
      user,
      currentPlan,
      newPlan,
      isUpgrade: newPlan.level > currentPlan.level,
    };
  })

  .addCard("calculate-proration", async (context) => {
    const subscription = await stripe.subscriptions.retrieve(
      context.user.subscriptionId
    );

    // Simular mudança para calcular proração
    const preview = await stripe.invoices.retrieveUpcoming({
      customer: context.user.stripeCustomerId,
      subscription: context.user.subscriptionId,
      subscription_items: [
        {
          id: subscription.items.data[0].id,
          price: context.newPlan.stripePriceId,
        },
      ],
    });

    const prorationAmount = preview.lines.data
      .filter((line) => line.proration)
      .reduce((sum, line) => sum + line.amount, 0);

    return {
      ...context,
      prorationAmount: prorationAmount / 100, // converter centavos
      nextInvoiceAmount: preview.amount_due / 100,
    };
  })

  .addCard("update-stripe-subscription", async (context) => {
    const subscription = await stripe.subscriptions.retrieve(
      context.user.subscriptionId
    );

    // Atualizar subscription
    const updatedSubscription = await stripe.subscriptions.update(
      context.user.subscriptionId,
      {
        items: [
          {
            id: subscription.items.data[0].id,
            price: context.newPlan.stripePriceId,
          },
        ],
        proration_behavior: "always_invoice",
      }
    );

    return { ...context, updatedSubscription };
  })

  .addCard("update-user-plan", async (context) => {
    // Atualizar plano no banco
    const updatedUser = await User.findByIdAndUpdate(
      context.user._id,
      {
        planId: context.newPlan._id,
        planChangedAt: new Date(),
      },
      { new: true }
    );

    // Atualizar limites
    await UserLimit.findOneAndUpdate(
      { userId: context.user._id },
      {
        planId: context.newPlan._id,
        limits: context.newPlan.limits,
      }
    );

    return { ...context, updatedUser };
  })

  .addCard("handle-limit-adjustments", async (context) => {
    const currentUsage = await getCurrentUsage(context.user._id);
    const newLimits = context.newPlan.limits;

    const adjustments = [];

    // Se exceder novos limites, tomar ações
    if (currentUsage.users > newLimits.users) {
      adjustments.push({
        type: "users_exceeded",
        current: currentUsage.users,
        limit: newLimits.users,
        action: "disable_extra_users",
      });
    }

    if (currentUsage.pipelines > newLimits.pipelines) {
      adjustments.push({
        type: "pipelines_exceeded",
        current: currentUsage.pipelines,
        limit: newLimits.pipelines,
        action: "disable_extra_pipelines",
      });
    }

    // Executar ajustes se necessário
    for (const adjustment of adjustments) {
      await executeUsageAdjustment(context.user._id, adjustment);
    }

    return { ...context, adjustments };
  })

  .addCard("send-plan-change-confirmation", async (context) => {
    const emailData = {
      to: context.user.email,
      template: context.isUpgrade ? "plan-upgraded" : "plan-downgraded",
      data: {
        oldPlanName: context.currentPlan.name,
        newPlanName: context.newPlan.name,
        prorationAmount: context.prorationAmount,
        nextBillingDate: new Date(
          context.updatedSubscription.current_period_end * 1000
        ),
        adjustments: context.adjustments,
      },
    };

    await sendEmail(emailData);

    return { ...context, confirmationSent: true };
  });
```

## 💳 **Sistema de Billing**

### **🔄 Processamento Automático de Faturas**

```javascript
// Deck: process-monthly-billing
const monthlyBillingDeck = engine.createDeck("process-monthly-billing", {
  concurrency: 10, // Processar 10 usuários simultaneamente
  timeout: 300000, // 5 minutos por usuário
  retries: 3,
});

monthlyBillingDeck
  .addCard("get-billing-candidates", async (context) => {
    // Buscar usuários para faturamento
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const users = await User.find({
      status: "active",
      subscriptionId: { $exists: true },
      "trial.active": false, // Não cobrar usuários em trial
      $or: [
        { lastBilledAt: { $lt: startOfMonth } },
        { lastBilledAt: { $exists: false } },
      ],
    }).populate("planId");

    return { ...context, billingCandidates: users };
  })

  .addCard("calculate-usage-charges", async (context) => {
    const usageCharges = [];

    for (const user of context.billingCandidates) {
      const usage = await calculateMonthlyUsage(user._id);
      const plan = user.planId;

      let overageCharges = 0;

      // Calcular overages
      if (usage.apiCalls > plan.limits.apiCalls) {
        const extraCalls = usage.apiCalls - plan.limits.apiCalls;
        overageCharges += extraCalls * plan.overagePricing.apiCall;
      }

      if (usage.dataStorage > plan.limits.dataStorage) {
        const extraStorage = usage.dataStorage - plan.limits.dataStorage;
        overageCharges += extraStorage * plan.overagePricing.storage;
      }

      if (overageCharges > 0) {
        usageCharges.push({
          userId: user._id,
          stripeCustomerId: user.stripeCustomerId,
          overageAmount: overageCharges,
          usage: usage,
          limits: plan.limits,
        });
      }
    }

    return { ...context, usageCharges };
  })

  .addCard("create-overage-invoice-items", async (context) => {
    const invoiceItems = [];

    for (const charge of context.usageCharges) {
      const item = await stripe.invoiceItems.create({
        customer: charge.stripeCustomerId,
        amount: Math.round(charge.overageAmount * 100), // centavos
        currency: "brl",
        description: `Uso excedente - ${new Date().toLocaleDateString(
          "pt-BR"
        )}`,
        metadata: {
          userId: charge.userId.toString(),
          type: "overage",
          period: new Date().toISOString().substring(0, 7), // YYYY-MM
        },
      });

      invoiceItems.push(item);
    }

    return { ...context, invoiceItems };
  })

  .addCard("process-subscription-invoices", async (context) => {
    // Deixar Stripe processar invoices de subscription automaticamente
    // Apenas monitorar por falhas

    const invoiceResults = [];

    for (const user of context.billingCandidates) {
      try {
        // Buscar última invoice
        const invoices = await stripe.invoices.list({
          customer: user.stripeCustomerId,
          limit: 1,
        });

        const latestInvoice = invoices.data[0];

        invoiceResults.push({
          userId: user._id,
          invoiceId: latestInvoice?.id,
          status: latestInvoice?.status,
          amount: latestInvoice?.amount_paid / 100,
        });
      } catch (error) {
        invoiceResults.push({
          userId: user._id,
          error: error.message,
          status: "error",
        });
      }
    }

    return { ...context, invoiceResults };
  })

  .addCard("handle-payment-failures", async (context) => {
    const failedPayments = context.invoiceResults.filter(
      (result) => result.status === "payment_failed"
    );

    for (const failure of failedPayments) {
      // Suspender usuário temporariamente
      await User.findByIdAndUpdate(failure.userId, {
        status: "suspended",
        suspendedReason: "payment_failed",
        suspendedAt: new Date(),
      });

      // Enviar email de falha de pagamento
      await sendEmail({
        to: (await User.findById(failure.userId)).email,
        template: "payment-failed",
        data: {
          invoiceUrl: `https://dashboard.stripe.com/invoices/${failure.invoiceId}`,
          amount: failure.amount,
          retryUrl: `${process.env.APP_URL}/billing/retry`,
        },
      });

      // Agendar emails de follow-up
      await schedulePaymentRetrySequence(failure.userId);
    }

    return {
      ...context,
      failedPayments,
      processedFailures: failedPayments.length,
    };
  })

  .addCard("update-billing-records", async (context) => {
    // Atualizar registros de billing
    const successfulBillings = context.invoiceResults.filter(
      (result) => result.status === "paid"
    );

    for (const billing of successfulBillings) {
      await User.findByIdAndUpdate(billing.userId, {
        lastBilledAt: new Date(),
        billingStatus: "current",
      });

      // Resetar usage counters
      await resetUsageCounters(billing.userId);
    }

    return { ...context, successfulBillings: successfulBillings.length };
  })

  .addCard("generate-billing-summary", async (context) => {
    const summary = {
      processedAt: new Date(),
      totalCandidates: context.billingCandidates.length,
      successfulBillings: context.successfulBillings,
      failedPayments: context.processedFailures,
      overageCharges: context.usageCharges.length,
      totalRevenue: context.invoiceResults
        .filter((r) => r.status === "paid")
        .reduce((sum, r) => sum + (r.amount || 0), 0),
    };

    // Salvar relatório
    await BillingReport.create(summary);

    // Enviar para admins
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      template: "billing-summary",
      data: summary,
    });

    return { ...context, billingSummary: summary };
  });

// Executar billing mensal
async function runMonthlyBilling() {
  console.log("🔄 Iniciando processamento de billing mensal...");

  try {
    const result = await engine.playAndWait("process-monthly-billing", {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    });

    console.log("✅ Billing processado:", result.billingSummary);
    return result.billingSummary;
  } catch (error) {
    console.error("❌ Erro no billing mensal:", error);

    // Alertar equipe
    await sendSlackAlert({
      channel: "#billing-alerts",
      message: `🚨 Falha no billing mensal: ${error.message}`,
      color: "danger",
    });

    throw error;
  }
}

// Agendar execução automática
const cron = require("node-cron");

// Todo dia 1º às 2h da manhã
cron.schedule("0 2 1 * *", runMonthlyBilling);
```

### **🔔 Sistema de Cobrança Inteligente**

```javascript
// Deck: smart-dunning-management
const dunningDeck = engine
  .createDeck("smart-dunning-management")
  .addCard("identify-at-risk-accounts", async (context) => {
    // Identificar contas em risco
    const atRiskAccounts = await User.find({
      $or: [
        { status: "suspended", suspendedReason: "payment_failed" },
        { "billing.failedAttempts": { $gte: 1 } },
        { "subscription.status": "past_due" },
      ],
    }).populate("planId");

    return { ...context, atRiskAccounts };
  })

  .addCard("segment-by-risk-level", async (context) => {
    const segments = {
      high_value: [], // Clientes premium com falha recente
      recurring: [], // Clientes regulares com histórico bom
      new_customers: [], // Clientes novos
      chronic_failures: [], // Multiple falhas
    };

    for (const account of context.atRiskAccounts) {
      const paymentHistory = await getPaymentHistory(account._id);

      if (account.planId.level >= 3 && paymentHistory.successRate > 0.8) {
        segments.high_value.push(account);
      } else if (
        paymentHistory.totalPayments > 6 &&
        paymentHistory.successRate > 0.9
      ) {
        segments.recurring.push(account);
      } else if (paymentHistory.totalPayments <= 2) {
        segments.new_customers.push(account);
      } else {
        segments.chronic_failures.push(account);
      }
    }

    return { ...context, riskSegments: segments };
  })

  .addCard("execute-targeted-recovery", async (context) => {
    const recoveryActions = [];

    // High-value customers - contato direto
    for (const account of context.riskSegments.high_value) {
      await createSupportTicket({
        userId: account._id,
        priority: "high",
        type: "payment_assistance",
        assignTo: "billing_specialist",
      });

      recoveryActions.push({
        userId: account._id,
        action: "direct_contact",
        priority: "high",
      });
    }

    // Recurring customers - email personalizado + desconto
    for (const account of context.riskSegments.recurring) {
      await sendEmail({
        to: account.email,
        template: "payment-recovery-loyal-customer",
        data: {
          discountCode: generateDiscountCode(account._id),
          discountPercent: 20,
          validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      recoveryActions.push({
        userId: account._id,
        action: "discount_offer",
        discount: 20,
      });
    }

    return { ...context, recoveryActions };
  });
```

## 📊 **Analytics e Métricas**

### **📈 Métricas de Revenue**

```javascript
// Deck: revenue-analytics
const revenueAnalyticsDeck = engine
  .createDeck("revenue-analytics")
  .addCard("calculate-key-metrics", async (context) => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // MRR (Monthly Recurring Revenue)
    const activeSubs = await User.aggregate([
      { $match: { status: "active", subscriptionId: { $exists: true } } },
      {
        $lookup: {
          from: "plans",
          localField: "planId",
          foreignField: "_id",
          as: "plan",
        },
      },
      { $group: { _id: null, totalMRR: { $sum: "$plan.price" } } },
    ]);

    const currentMRR = activeSubs[0]?.totalMRR || 0;

    // ARR (Annual Recurring Revenue)
    const currentARR = currentMRR * 12;

    // ARPU (Average Revenue Per User)
    const totalActiveUsers = await User.countDocuments({ status: "active" });
    const arpu = totalActiveUsers > 0 ? currentMRR / totalActiveUsers : 0;

    // Churn Rate
    const churnedThisMonth = await User.countDocuments({
      status: "cancelled",
      cancelledAt: { $gte: thisMonth },
    });

    const activeLastMonth = await User.countDocuments({
      createdAt: { $lt: thisMonth },
      $or: [
        { status: "active" },
        { status: "cancelled", cancelledAt: { $gte: thisMonth } },
      ],
    });

    const churnRate =
      activeLastMonth > 0 ? (churnedThisMonth / activeLastMonth) * 100 : 0;

    // Customer Lifetime Value
    const averageLifespan = churnRate > 0 ? 1 / (churnRate / 100) : 12; // meses
    const customerLTV = arpu * averageLifespan;

    return {
      ...context,
      metrics: {
        mrr: currentMRR,
        arr: currentARR,
        arpu: arpu,
        churnRate: churnRate,
        customerLTV: customerLTV,
        totalActiveUsers: totalActiveUsers,
        calculatedAt: new Date(),
      },
    };
  })

  .addCard("analyze-growth-trends", async (context) => {
    // Analisar tendências dos últimos 6 meses
    const trends = await calculateGrowthTrends(6);

    return { ...context, trends };
  })

  .addCard("identify-revenue-opportunities", async (context) => {
    const opportunities = [];

    // Usuários próximos ao limite do plano (upsell opportunity)
    const upsellCandidates = await identifyUpsellCandidates();
    opportunities.push({
      type: "upsell",
      count: upsellCandidates.length,
      potentialMRR: upsellCandidates.reduce(
        (sum, user) => sum + user.potentialIncrease,
        0
      ),
    });

    // Usuários em trial próximo ao fim
    const trialEndingSoon = await User.countDocuments({
      "trial.active": true,
      "trial.endsAt": {
        $lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 dias
      },
    });

    opportunities.push({
      type: "trial_conversion",
      count: trialEndingSoon,
      conversionRate: 0.3, // assumindo 30% de conversão
    });

    return { ...context, opportunities };
  });
```

### **🎯 User Engagement Analytics**

```javascript
// Deck: user-engagement-analytics
const engagementDeck = engine
  .createDeck("user-engagement-analytics")
  .addCard("calculate-engagement-scores", async (context) => {
    const users = await User.find({ status: "active" });
    const engagementScores = [];

    for (const user of users) {
      const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      // Métricas de engajamento
      const metrics = await Promise.all([
        getLoginFrequency(user._id, last30Days),
        getFeatureUsage(user._id, last30Days),
        getAPIUsage(user._id, last30Days),
        getSupportInteractions(user._id, last30Days),
      ]);

      const score = calculateEngagementScore(metrics);

      engagementScores.push({
        userId: user._id,
        email: user.email,
        score: score,
        segment: getEngagementSegment(score),
        lastLogin: metrics[0].lastLogin,
        risk: score < 0.3 ? "high" : score < 0.6 ? "medium" : "low",
      });
    }

    return { ...context, engagementScores };
  })

  .addCard("identify-churn-risk", async (context) => {
    const highRiskUsers = context.engagementScores.filter(
      (user) => user.risk === "high"
    );

    const churnPredictions = await Promise.all(
      highRiskUsers.map(async (user) => {
        const churnProbability = await predictChurnProbability(user);
        return { ...user, churnProbability };
      })
    );

    return { ...context, churnRisk: churnPredictions };
  })

  .addCard("trigger-retention-campaigns", async (context) => {
    const retentionActions = [];

    for (const user of context.churnRisk) {
      if (user.churnProbability > 0.7) {
        // Alto risco - contato direto
        await createRetentionTask({
          userId: user.userId,
          type: "personal_outreach",
          priority: "high",
          assignTo: "customer_success",
        });

        retentionActions.push({
          userId: user.userId,
          action: "personal_outreach",
        });
      } else if (user.churnProbability > 0.4) {
        // Risco médio - email de re-engajamento
        await sendEmail({
          to: user.email,
          template: "re-engagement",
          data: {
            lastLogin: user.lastLogin,
            unutilizedFeatures: await getUnutilizedFeatures(user.userId),
          },
        });

        retentionActions.push({
          userId: user.userId,
          action: "email_campaign",
        });
      }
    }

    return { ...context, retentionActions };
  });
```

## 🔔 **Sistema de Notificações**

### **📧 Email Campaigns Automatizadas**

```javascript
// Deck: automated-email-campaigns
const emailCampaignDeck = engine
  .createDeck("automated-email-campaigns")
  .addCard("segment-users-for-campaigns", async (context) => {
    const { campaignType } = context.payload;

    let targetUsers = [];

    switch (campaignType) {
      case "trial_ending":
        targetUsers = await User.find({
          "trial.active": true,
          "trial.endsAt": {
            $gte: new Date(),
            $lte: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // próximos 2 dias
          },
        });
        break;

      case "feature_announcement":
        targetUsers = await User.find({
          status: "active",
          createdAt: { $lte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // pelo menos 1 semana
        }).populate("planId");
        break;

      case "usage_milestone":
        targetUsers = await getUsersWithMilestones();
        break;
    }

    return { ...context, targetUsers };
  })

  .addCard("personalize-email-content", async (context) => {
    const personalizedEmails = await Promise.all(
      context.targetUsers.map(async (user) => {
        const personalizationData = await getPersonalizationData(user._id);

        return {
          userId: user._id,
          email: user.email,
          content: await personalizeTemplate(
            context.payload.template,
            personalizationData
          ),
        };
      })
    );

    return { ...context, personalizedEmails };
  })

  .addCard("send-campaign-emails", async (context) => {
    const results = [];

    // Enviar em lotes para não sobrecarregar
    const batchSize = 50;

    for (let i = 0; i < context.personalizedEmails.length; i += batchSize) {
      const batch = context.personalizedEmails.slice(i, i + batchSize);

      const batchResults = await Promise.all(
        batch.map(async (email) => {
          try {
            const result = await sendEmail({
              to: email.email,
              subject: email.content.subject,
              html: email.content.html,
            });

            return {
              userId: email.userId,
              success: true,
              messageId: result.messageId,
            };
          } catch (error) {
            return {
              userId: email.userId,
              success: false,
              error: error.message,
            };
          }
        })
      );

      results.push(...batchResults);

      // Pausa entre lotes
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return { ...context, emailResults: results };
  })

  .addCard("track-campaign-performance", async (context) => {
    const performance = {
      campaignId: generateCampaignId(),
      type: context.payload.campaignType,
      sentAt: new Date(),
      totalSent: context.emailResults.length,
      successfulSends: context.emailResults.filter((r) => r.success).length,
      failures: context.emailResults.filter((r) => !r.success).length,
      targeting: {
        totalUsers: context.targetUsers.length,
        segments: getSegmentBreakdown(context.targetUsers),
      },
    };

    await saveCampaignPerformance(performance);

    return { ...context, campaignPerformance: performance };
  });
```

---

**💳 Sistema Completo de User Management & Billing!** 🚀

> _"DeckEngine transforma operações complexas de billing em pipelines simples e confiáveis"_ ✨

### **Próximos Passos para Implementação**

1. 🛡️ **Configurar Stripe** webhooks
2. 💾 **Setup MongoDB** para persistência
3. 📊 **Implementar analytics** dashboard
4. 🔔 **Configurar email** service (SendGrid/Mailgun)
5. 🎯 **Ativar monitoramento** e alertas
