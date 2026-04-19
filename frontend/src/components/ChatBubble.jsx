// Chat bubble component
function Bubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: 12, gap: 8 }}>
      <div style={{
        maxWidth: "70%",
        background: isUser ? "linear-gradient(135deg,#0f766e,#1d4ed8)" : "linear-gradient(135deg,#1e293b,#111827)",
        color: "white",
        padding: "12px 16px",
        borderRadius: 18,
        borderTopRightRadius: isUser ? 18 : 4,
        borderBottomRightRadius: isUser ? 18 : 4,
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
      }}>
        <div style={{ fontSize: 12, opacity: 0.9, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {msg.content}
        </div>
        {msg.context && (
          <div style={{ 
            fontSize: 10, 
            opacity: 0.7, 
            marginTop: 8, 
            paddingTop: 8, 
            borderTop: `1px solid ${isUser ? "#1e293b" : "#111827"}`,
            fontFamily: "monospace"
          }}>
            Sources: {msg.context}
          </div>
        )}
      </div>
      {!isUser && (
        <div style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: "linear-gradient(135deg,#0f766e,#1d4ed8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: "bold",
          fontSize: 14,
          flexShrink: 0
        }}>
          AI
        </div>
      )}
    </div>
  );
}

export default Bubble;
