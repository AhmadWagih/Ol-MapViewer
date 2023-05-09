import { useEffect, useContext } from "react";
import { MapContext } from "../Context/MapContext";
import classes from "./MapComponent.module.css";
import LeftPanel from "./LeftPanel";
import AttributeTable from './AttributeTable';

const MapComponent = () => {
  const { addNewMap, wfsGeoserver, loadGeojson, updateLayers,attTableVis } =
    useContext(MapContext);
  useEffect(() => {
    addNewMap("map");
    wfsGeoserver("Geoserver");
    loadGeojson(
      "Rivers (Geojson)",
      "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_rivers_lake_centerlines_scale_rank.geojson",
      "blue",
      1
    );
    loadGeojson(
      "Countries (Geojson)",
      "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson",
      "orange",
      1.5
    );
    updateLayers();
  }, []);

  return (
    <div className={classes.container}>
      <LeftPanel />
      <div className={classes.mapCol}>
      <div id="map" className={classes.map} style={attTableVis?{height:"70%"}:{height:"100%"}}/>
      {attTableVis?<AttributeTable/>:<></>}
      </div>
    </div>
  );
};

export default MapComponent;
