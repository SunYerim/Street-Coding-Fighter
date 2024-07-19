import "../../../css/MainSelectModeBox.css";

function MainSelectModeBox(props) {
  const { mode } = props;

  return (
    <>
      <div
        onClick={() => {
          alert(`${mode}`);
        }}
        className="select-box"
      >
        <h1 className="mode">{mode}</h1>
      </div>
    </>
  );
}

export default MainSelectModeBox;
