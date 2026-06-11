const StatCard = ({
  title,
  value,
}) => {
  return (
    <div
      style={{
        background:
          "#1f2937",

        padding: "25px",

        borderRadius:
          "16px",

        minWidth:
          "250px",

        boxShadow:
          "0 4px 10px rgba(0,0,0,0.3)",

        transition:
          "0.3s",
      }}
    >
      <h3
        style={{
          color:
            "#9CA3AF",
        }}
      >
        {title}
      </h3>

      <h1
        style={{
          marginTop:
            "10px",
        }}
      >
        {value}
      </h1>
    </div>
  );
};

export default StatCard;