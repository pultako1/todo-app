import { useEffect, useState } from "react";
import "./App.css";
// import { supabase } from "./lib/supabaseClient";
import type { Todo } from "./domain/todo";
import { addTodo, getAllTodos } from "./utils/supabase";

function App() {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState(0);
  const [records, setRecords] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  //supabaseから学習記録を取得
  useEffect(() => {
    const fetchRecords = async () => {
      const data = await getAllTodos();
      if (data) {
        setRecords(data as Todo[]);
        setIsLoading(false);
      }
    };
    fetchRecords();
  }, []);
  const handleAddRecord = async () => {
    if (title === "" || time === 0) {
      alert("学習内容と学習時間を入力してください");
      return;
    }
    const error = await addTodo(title, time);
    if (error) {
      console.error(error);
    } else {
      setRecords([
        ...records,
        { id: records.length + 1, title: title, time: time },
      ]);
      setTitle("");
      setTime(0);
    }
  };

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div>
            <h1>学習記録一覧！</h1>
            <div>
              <label htmlFor="title">学習内容</label>
              <input
                type="text"
                placeholder="学習の記録を入力"
                aria-label="学習の記録を入力"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="title">学習時間</label>
              <input
                type="number"
                placeholder="学習の時間を入力"
                aria-label="学習の時間を入力"
                value={time}
                onChange={(e) => setTime(Number(e.target.value))}
              />
            </div>
            <button onClick={handleAddRecord}>登録</button>
            <ul>
              {records.map((record) => (
                <li key={record.title}>
                  {record.title} - {record.time}時間
                </li>
              ))}
            </ul>
            <div data-testid="total-time">
              合計時間: {records.reduce((acc, record) => acc + record.time, 0)}
              時間
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default App;
