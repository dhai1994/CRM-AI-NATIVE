import { useState } from "react";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";

export default function AICopilot() {
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askCopilot = async () => {
    if (!message.trim()) return;

    try {
      setLoading(true);

      const { data } =
        await API.post(
          "/copilot/ask",
          {
            message,
          }
        );

      setAnswer(data.answer);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        background: "#050505",
        minHeight: "100vh",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          padding: "30px",
          color: "white",
        }}
      >
        <h1>
          AI CRM Copilot
        </h1>

        <p>
          Ask questions about
          customers,
          churn,
          revenue,
          and CRM insights.
        </p>

        <textarea
          value={message}
          onChange={(e) =>
            setMessage(
              e.target.value
            )
          }
          placeholder="Which customers are most likely to churn?"
          style={{
            width: "100%",
            height: "120px",
            background: "#111",
            color: "#fff",
            border: "1px solid #333",
            borderRadius: "10px",
            padding: "15px",
            marginTop: "20px",
          }}
        />

        <button
          onClick={askCopilot}
          disabled={loading}
          style={{
            marginTop: "15px",
            background: "#ef4444",
            color: "#fff",
            border: "none",
            padding: "12px 24px",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          {loading
            ? "Thinking..."
            : "Ask Copilot"}
        </button>

        {answer && (
          <div
            style={{
              marginTop: "30px",
              background: "#111",
              padding: "20px",
              borderRadius: "12px",
              border:
                "1px solid #222",
              whiteSpace:
                "pre-wrap",
            }}
          >
            <h3>
              Copilot Response
            </h3>

            <p>{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}