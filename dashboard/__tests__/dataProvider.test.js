import { getDataProvider } from "../utils/DataProvider";
import { expect, test, describe } from "@jest/globals";

describe("DataProvider", () => {
  test("retorna addons padrão", () => {
    const dp = getDataProvider();
    const addons = dp.getAddons();
    expect(addons).toBeDefined();
    expect(Object.keys(addons).length).toBeGreaterThan(0);
    expect(addons).toHaveProperty("TextInput");
  });

  test("overview possui addons no tier3", () => {
    const dp = getDataProvider();
    const section = dp.getSections().overview;
    expect(section).toBeDefined();
    expect(section.includedAddonsByTier[3]).toContain("TextInput");
  });
});
