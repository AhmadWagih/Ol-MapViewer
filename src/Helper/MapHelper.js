//#region
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { Control } from "ol/control";
import OSM from "ol/source/OSM";
import { FullScreen, ScaleLine, defaults } from "ol/control.js";
import Group from "ol/layer/Group.js";
import VectorLayer from "ol/layer/Vector";
// import CircleStyle from "ol/style/Circle";
// import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
// import Text from "ol/style/Text";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";

//#endregion

export const addMap = (target) => {
  let OSMap = new TileLayer({
    source: new OSM(),
    visible: false,
    title: "OSMap",
  });
  let stadia = new TileLayer({
    source: new XYZ({
      url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png",
    }),
    visible: true,
    title: "stadia",
  });
  let stamen = new TileLayer({
    source: new XYZ({
      url: "https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg",
    }),
    visible: false,
    title: "stamen",
  });
  let satellite = new TileLayer({
    source: new XYZ({
      url: "https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=3pna9juQt4oFLoY3CxJw",
    }),
    title: "satellite",
    visible: false,
  });
  let baseMapsGroup = new Group({
    layers: [OSMap, stadia, stamen, satellite],
  });
  let map = new Map({
    target: target || "map",
    controls: defaults({
      attribution: false,
    }),
    view: new View({
      center: [0, 0],
      zoom: 2,
    }),
  });
  map.addLayer(baseMapsGroup);
  //--- add controllers
  map.addControl(new FullScreen());
  map.addControl(new ScaleLine());
  addBaseMapButton(baseMapsGroup);
  return { map, baseMapsGroup };
};

export const changeBaseMap = (id, baseMapsGroup) => {
  baseMapsGroup.getLayers().forEach((basemap) => {
    if (basemap.get("title") === id) {
      basemap.setVisible(true);
    } else {
      basemap.setVisible(false);
    }
    let rightPanel = document.getElementsByClassName(
      "ol-full-screen ol-unselectable ol-control "
    )[0];
    let rightPanelBtns = [...rightPanel.children];
    let baseMapBtns = rightPanelBtns.slice(
      rightPanelBtns.length - 4,
      rightPanelBtns.length
    );
    for (const btn of baseMapBtns) {
      btn.style.display = "none";
    }
  });
};
export class AttTableButton extends Control {
  constructor() {
    const button = document.createElement("button");
    const element = document.createElement("div");
    element.className = "att-table-div ol-control ol-unselectable ol-control-custom-button";;
    let myIcon = document.createElement("i");
    myIcon.className = "fa-solid fa-table";
    myIcon.style.scale="2"
    button.appendChild(myIcon);
    button.id="att-table-button"
    element.appendChild(button);
    super({ element: element });
  }
}
export const addBaseMapButton = (baseMapsGroup) => {
  let rightPanel = document.getElementsByClassName(
    "ol-full-screen ol-unselectable ol-control "
  )[0];
  document
    .getElementsByClassName("ol-rotate ol-unselectable ol-control ol-hidden")[0]
    .remove();
  if (rightPanel) {
    let baseMapButton = document.createElement("Button");
    let myIcon = document.createElement("i");
    baseMapButton.appendChild(myIcon);
    myIcon.className = "fa-solid fa-layer-group";
    baseMapButton.addEventListener("click", () => {
      let rightPanelBtns = [...rightPanel.children];
      let baseMapBtns = rightPanelBtns.slice(
        rightPanelBtns.length - 4,
        rightPanelBtns.length
      );
      for (const btn of baseMapBtns) {
        btn.style.display = btn.style.display === "block" ? "none" : "block";
      }
      rightPanel.style.display = "flex";
      rightPanel.style.flexDirection = "row-reverse";
      rightPanel.style.backgroundColor = "rgba(0, 0, 0, 0)";
    });
    rightPanel.appendChild(baseMapButton);

    let baseMaps = ["OSMap", "stadia", "stamen", "satellite"];
    for (const baseMap of baseMaps) {
      let img = document.createElement("img");
      img.className = "basemapimg";
      img.style.display = "none";
      img.id = baseMap;
      img.src = require(`../../public/imgs/${baseMap}.png`);
      img.alt = baseMap;
      img.addEventListener("click", (e) =>
        changeBaseMap(e.target.id, baseMapsGroup)
      );
      rightPanel.appendChild(img);

      let zoomPanel = document.getElementsByClassName(
        "ol-zoom ol-unselectable ol-control"
      )[0];
      zoomPanel.style.top = "1em";
      zoomPanel.style.left = "1em";
    }
  }
};
// make datasource with layer d=features inside
export const drawGeoJson = (name,map, geojson,color,width) => {
  let dataSource = new VectorSource({
    format: new GeoJSON(),
    url: geojson,
  });
  const olLayer = new VectorLayer({
    name:name,
    source: dataSource,
  });
  let style = new Style({
    stroke: new Stroke({
      color: color,
      width: width,
    }),
  });

  olLayer.setStyle(style);
  // get Layer Extent
  const view= new View({
    center: [-9000000, 5000000],
    zoom: 6,
  })
  // let myExtent = olLayer.getSource().getExtent();
  // zoom to layer Extent
  // map.getView().fit(myExtent);
  map.addLayer(olLayer);
  map.setView(view);

  return { olLayer };
};
