import { TypeAnimation } from "react-type-animation";

const TitleLogo = () => {
  return (
    <>
      <TypeAnimation
        sequence={["Street Coding", 500, "Street Coding\nFighter", 500]}
        wrapper="h1"
        speed={50}
        style={{
          textAlign: "center",
          fontSize: "5rem",
          color: "black",
          whiteSpace: "pre-line",
        }}
      />
    </>
  );
};

export default TitleLogo;
