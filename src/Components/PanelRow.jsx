import { useContext } from "react";
import classes from "./MapComponent.module.css";
import { MapContext } from "../Context/MapContext";
function PanelRow({ LayerName, isTitle, isVisible, isSelected }) {
  const { removeLayer, zoomToLayer, showOrHide, selectLayer } =
    useContext(MapContext);
  return (
    <div
      className={
        isTitle
          ? classes.PanelTitle
          : classes.PanelRow
      }
      style={isSelected?{backgroundColor:"cyan"}:{}}
    >
      <span
        className={isTitle ? classes.title : classes.row}
        onClick={() => {
          if (!isTitle) return selectLayer(LayerName);
        }}
      >
        {isTitle ? "Layer List" : LayerName}
      </span>
      {isTitle ? (
        ""
      ) : (
        <button
          className="btn btn-danger py-0 rounded-5"
          onClick={() => removeLayer(LayerName)}
        >
          X
        </button>
      )}
      <button
        className="btn btn-secondary py-1 px-1"
        onClick={() => zoomToLayer(LayerName)}
      >
        Zoom
      </button>
      <button
        className="btn btn-secondary py-1"
        onClick={() => showOrHide(LayerName, isVisible)}
      >
        {!isVisible ? "Show" : "Hide"}
      </button>
    </div>
  );
}

export default PanelRow;
