import { describe, expect, test, vi, beforeEach } from "vitest";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";
import * as supabaseUtils from "../utils/supabase";

vi.mock("../utils/supabase", () => ({
  getAllTodos: vi.fn(),
  addTodo: vi.fn(),
}));

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(supabaseUtils.getAllTodos).mockResolvedValue([
      { id: 1, title: "テストタスク", time: 1 },
    ]);
    vi.mocked(supabaseUtils.addTodo).mockResolvedValue(null);
  });

  test("アプリタイトルが表示されている", async () => {
    render(<App />);
    await waitForElementToBeRemoved(() => screen.getByText("Loading..."));
    expect(
      screen.getByRole("heading", { name: "学習記録一覧！" })
    ).toBeInTheDocument();
  });
  test("TODOを追加することができる", async () => {
    render(<App />);
    await waitForElementToBeRemoved(() => screen.getByText("Loading..."));

    const inputTitle = screen.getByRole("textbox", {
      name: "学習の記録を入力",
    });
    const inputTime = screen.getByRole("spinbutton", {
      name: "学習の時間を入力",
    });
    const addButton = screen.getByRole("button", { name: "登録" });

    fireEvent.change(inputTitle, { target: { value: "テストタスク" } });
    fireEvent.change(inputTime, { target: { value: 1 } });
    fireEvent.click(addButton);

    const list = screen.getByRole("list");

    await waitFor(async () => {
      expect(
        await within(list).getByText("テストタスク - 1時間")
      ).toBeInTheDocument();
    });
  });
  test("合計時間が表示されている", async () => {
    render(<App />);
    await waitForElementToBeRemoved(() => screen.getByText("Loading..."));

    expect(screen.getByTestId("total-time")).toHaveTextContent("合計時間");
  });
});
