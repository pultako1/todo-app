import { describe, expect, test } from "vitest";
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

describe("App", () => {
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
