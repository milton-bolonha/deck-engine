import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LeftSidebar from "../components/core/LeftSidebar";
import { DashboardProvider } from "../contexts/DashboardContext";

// Helper wrapper
const renderWithProvider = (ui) => {
  return render(<DashboardProvider>{ui}</DashboardProvider>);
};

describe("Navegação no LeftSidebar", () => {
  it('permite selecionar a seção "Usuários"', async () => {
    renderWithProvider(<LeftSidebar />);

    // Aguarda o SectionManager inicializar para que menu seja renderizado
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Overview/i })
      ).toBeInTheDocument();
    });

    // Clica no botão Usuários
    const usersBtn = screen.getByRole("button", { name: /Usuários/i });
    userEvent.click(usersBtn);

    // Verifica que o botão agora está ativo (classe de seleção adicionada)
    await waitFor(() => {
      expect(usersBtn.className).toMatch(/bg-primary-100|bg-blue-100/);
    });
  });
});
