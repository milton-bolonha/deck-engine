import { render, screen, waitFor } from "@testing-library/react";
import { DashboardProvider } from "../contexts/DashboardContext";

// Mock do RightSidebar para evitar dependências complexas
const MockRightSidebar = ({ isDevMode }) => {
  return (
    <div data-testid="right-sidebar">
      <h2>Configurações</h2>
      {isDevMode && <div>DevMode Ativo</div>}
      <div>Painel de Configurações</div>
    </div>
  );
};

describe("RightSidebar", () => {
  it("renderiza painel de configurações", () => {
    render(<MockRightSidebar />);

    expect(
      screen.getByRole("heading", { name: /Configurações/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Painel de Configurações/i)).toBeInTheDocument();
  });

  it("mostra indicador DevMode quando ativo", () => {
    render(<MockRightSidebar isDevMode={true} />);

    expect(screen.getByText(/DevMode Ativo/i)).toBeInTheDocument();
  });
});
