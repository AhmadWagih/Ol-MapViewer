import { useContext } from "react";
import { MapContext } from "../Context/MapContext";
import classes from "./MapComponent.module.css";
function AttributeTable() {
  const { selectedLayer, selectLayer, updateLayers, zoomToFeature } =
    useContext(MapContext);
  if (!selectedLayer) {
    return (
      <div className={classes.attTable}>
        <span className={classes.tableHeader}>Please Select Layer </span>
      </div>
    );
  }
  if (!selectedLayer.keys) {
    setTimeout(() => {
      updateLayers();
      selectLayer(selectedLayer.name);
    }, 1000);
    return (
      <div className={classes.attTable}>
        <div className="spinner-div">
          <div className="spinner-border text-dark" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={classes.attTable}>
      <table className="table table-striped">
        <thead>
          <tr>
            <th
              className={classes.tableHeader}
              colSpan={1 + selectedLayer.keys.length}
            >
              {selectedLayer.name +
                " (" +
                selectedLayer.attributes.length +
                " features) "}
            </th>
          </tr>
          <tr>
            <th scope="col">#</th>
            {selectedLayer.keys.map((key) => (
              <th scope="col" key={key}>
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {selectedLayer.attributes.map((attribute, i) => (
            <tr
              className={classes.tableRow}
              onClick={() => zoomToFeature(i)}
              key={i}
            >
              <th>{i}</th>
              {Object.keys(attribute).map((key, i) => (
                <td key={i}>{attribute[key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AttributeTable;
