
const AgentCard = ({
  title,
  content,
}) => {
  return (
    <div
      style={{
        background: "#1f2937",
        borderRadius: "12px",
        padding: "20px",
        marginTop: "20px",
      }}
    >
      <h2>
        ✅ {title}
      </h2>

      <pre
        style={{
          whiteSpace:
            "pre-wrap",
          color: "#d1d5db",
        }}
      >
        {content}
      </pre>
    </div>
  );
};

export default AgentCard;