import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import AddonManager from "../components/managers/AddonManager";
import { getDataProvider } from "../utils/DataProvider";
// Mock IntersectionObserver que não existe no JSDOM
class IntersectionObserverMock {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.IntersectionObserver = IntersectionObserverMock;

describe("AddonManager", () => {
  it("exibe addons disponíveis para a seção Overview", async () => {
    const dataProvider = getDataProvider();

    // Seção base
    const section = dataProvider.getSections().overview;
    const contentType = dataProvider.getContentTypes()[section.contentTypeId];

    render(
      <AddonManager
        section={section}
        contentType={contentType}
        currentPlan="tier3"
        isDevMode={false}
      />
    );

    // Aguarda carregamento finalizar
    await waitFor(() => {
      expect(screen.queryByText(/Carregando addons/i)).not.toBeInTheDocument();
    });

    // Deve haver pelo menos um addon ativo disponível no marketplace
    expect(
      screen.queryByText(/Nenhum addon disponível/i)
    ).not.toBeInTheDocument();

    // Verifica addon TextInput
    expect(screen.getByText(/Campo de Texto/i)).toBeInTheDocument();
  });
});
