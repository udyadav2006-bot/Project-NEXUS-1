import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API;

export default function Dashboard() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");

  const summarize = async () => {
    const r = await axios.post(API + "/ai/summarize", { text });
    setSummary(r.data.summary);
  };

  return (
    <div>
      <h2>Mail Summarizer</h2>
      <textarea rows="5" onChange={e=>setText(e.target.value)} />
      <br/>
      <button onClick={summarize}>Summarize</button>
      <p><b>Summary:</b> {summary}</p>
    </div>
  );
}
