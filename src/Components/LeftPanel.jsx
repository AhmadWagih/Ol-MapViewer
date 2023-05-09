import { useContext } from "react";
import classes from "./MapComponent.module.css";
import PanelRow from "./PanelRow";
import { MapContext } from "../Context/MapContext";

function LeftPanel() {
  const { Layers,selectedLayer } = useContext(MapContext);

  return (
    <div className={classes.leftPanel}>
      <PanelRow
        isTitle={true}
        isVisible={Layers?.every((lyr) => lyr.visible === true)}
      />

      {Layers?.map((lyr, i) => (
        <PanelRow key={i} LayerName={lyr.name} isVisible={lyr.visible} isSelected={selectedLayer?.name===lyr?.name} />
      ))}
    </div>
  );
}

export default LeftPanel;
