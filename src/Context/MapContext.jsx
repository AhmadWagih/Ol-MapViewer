import { createContext, useState, useCallback } from "react";
import { AttTableButton, addMap, drawGeoJson } from "../Helper/MapHelper.js";
import { alertSuccess ,alertError} from "../Helper/toast.js";
//#region

import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import View from "ol/View";
import GeoJSON from "ol/format/GeoJSON";
import { createEmpty, extend } from "ol/extent";
import { bbox as bboxStrategy } from "ol/loadingstrategy";
//#endregion

export const MapContext = createContext();

const MapContextProvider = ({ children }) => {
  // const [layers, setLayers] = useState([]);

  // initialize state
  const [mapData, setMapData] = useState({
    map: null,
    baseMapsGroup: null,
    mapIsLoaded: false,
  });
  const [Layers, setLayers] = useState([]);
  const [selectedLayer, setSelectedLayer] = useState();
  const [attTableVis, setAttTableVis] = useState(false);

  //#region functions
  const addNewMap = useCallback(() => {
    if (!mapData.mapIsLoaded) {
      let { map, baseMapsGroup } = addMap("map");
      mapData.mapIsLoaded = true;
      mapData.map = map;
      map.addControl(new AttTableButton());
      document
        .getElementById("att-table-button")
        .addEventListener("click", () => {
          setAttTableVis((vis) => !vis);
        });
      setMapData((mapData) => ({
        ...mapData,
        baseMapsGroup,
      }));
      console.log("map is loaded");
    }
  }, [mapData]);

  const addLayerForm = () => {
    let overlaycontainer = document.getElementsByClassName(
      "ol-overlaycontainer-stopevent"
    )[0];
    let form = document.getElementsByClassName("ol-attribution ol-control")[0];
    form.classList.remove("hidden");
    overlaycontainer.appendChild(form);

    let addFieldButton = document.getElementById("addField");
    addFieldButton.addEventListener("click", () => {
      let newdiv = document.createElement("div");
      newdiv.innerHTML = `
      <input type="text" class="text-input" />
      <select id="feildId" name="feild1">
        <option value="int">int</option>
        <option value="string">string</option>
        <option value="double">double</option>
      </select>`;
      document.getElementsByClassName("containerTable")[0].appendChild(newdiv);
    });
    document.getElementById("cancel").addEventListener("click", () => {
      form.classList.add("hidden");
    });
  };

  const wfsGeoserver = (name, wfsurl) => {
    try {
      let wfslayer = new VectorLayer({
        name: name,
        source: new VectorSource({
          format: new GeoJSON(),
          url: function (extent) {
            return (
              wfsurl ||
              "https://ahocevar.com/geoserver/wfs?service=WFS&" +
                "version=1.1.0&request=GetFeature&typename=osm:water_areas&" +
                "outputFormat=application/json&srsname=EPSG:3857&" +
                "bbox=" +
                extent.join(",") +
                ",EPSG:3857"
            );
          },
          strategy: bboxStrategy,
        }),
        style: {
          "stroke-width": 0.75,
          "stroke-color": "white",
          "fill-color": "rgba(100,100,100)",
        },
      });

      mapData.map.addLayer(wfslayer);
      mapData.map.setView(
        new View({
          center: [-8908887.277395891, 5381918.072437216],
          maxZoom: 19,
          zoom: 8,
        })
      );
      console.log("Geoserver Connected");
    } catch (error) {
      alertError(error, "bottom-center");
    }
  };

  const updateLayers = () => {
    const lyrs = [];
    mapData.map.getLayers().forEach((layer) => {
      if (layer instanceof VectorLayer) {
        let lyr = {};
        lyr.name = layer.get("name");
        var source = layer.getSource();
        var features = source.getFeatures();
        let attributes = [];
        let keys;
        features.forEach((feature, i) => {
          if (i === 0)
            keys = feature.getKeys().filter((key) => key !== "geometry");
          let attribute = {};
          keys.forEach(function (key) {
            if (key !== "geometry") {
              attribute[key] = feature.get(key);
            }
          });
          attributes.push(attribute);
        });
        lyr.keys = keys;
        lyr.attributes = attributes;
        lyr.visible = true;
        lyrs.push(lyr);
      }
    });
    if (Layers.count !== 0) {
      lyrs.forEach((lyr) => {
        Layers.forEach((layer) => {
          if (lyr.name === layer.name) lyr.visible = layer.visible;
        });
      });
    }
    setLayers(lyrs);
  };

  const loadGeojson = (name, geojson, color, width = 1) => {
    drawGeoJson(name, mapData.map, geojson, color, width);
    console.log("GeojsonLayer Added");
  };
  const removeLayer = (name) => {
    try {
      mapData.map.getLayers().forEach((Layer) => {
        if (Layer.get("name") === name) {
          mapData.map.removeLayer(Layer);
        }
      });
      alertSuccess(`Layer ${name} is deleted`, "bottom-left");
    } catch (error) {}
    setLayers((prevLayers) => prevLayers.filter((lyr) => lyr.name !== name));
  };
  const zoomToLayer = (layerName) => {
    const layers = mapData.map.getLayers().getArray();
    if (layerName) {
      const layer = layers.find((l) => l.get("name") === layerName);
      if (layer) {
        const source = layer.getSource();
        const extent = source.getExtent();
        const view = mapData.map.getView();
        view.fit(extent, { padding: [100, 100, 100, 100], duration: 1000 });
      }
    } else {
      const combinedExtent = createEmpty();
      mapData.map.getLayers().forEach((layer) => {
        if (layer instanceof VectorLayer) {
          const layerExtent = layer.getSource().getExtent();
          extend(combinedExtent, layerExtent);
        }
      });
      const view = mapData.map.getView();
      view.fit(combinedExtent, {
        padding: [100, 100, 100, 100],
        duration: 1000,
      });
    }
  };
  const showOrHide = (name, isVisible) => {
    const updatedLayers = Layers.map((layer) => {
      if (name && layer.name === name) {
        mapData.map.getLayers().forEach((mapLayer) => {
          if (mapLayer.get("name") === name) {
            mapLayer.setVisible(!isVisible);
          }
        });
        return {
          ...layer,
          visible: !isVisible,
        };
      } else if (!name) {
        mapData.map.getLayers().forEach((mapLayer) => {
          if (mapLayer instanceof VectorLayer) {
            mapLayer.setVisible(!isVisible);
          }
        });
        return {
          ...layer,
          visible: !isVisible,
        };
      }
      return layer;
    });
    setLayers(updatedLayers);
  };

  const selectLayer = (LayerName) => {
    setSelectedLayer(Layers.filter((lyr) => lyr.name === LayerName)[0]);
  };
  const zoomToFeature = (featureIndex) => {
    const layer = mapData.map
      .getLayers()
      .getArray()
      .find((l) => l.get("name") === selectedLayer.name);
    const feature = layer.getSource().getFeatures()[featureIndex];
    var extent = feature.getGeometry().getExtent();
    const view = mapData.map.getView();
    view.fit(extent, { padding: [20, 20, 20, 20], duration: 1000 });
  };

  //#endregion

  return (
    <MapContext.Provider
      value={{
        mapData,
        Layers,
        selectedLayer,
        attTableVis,
        selectLayer,
        zoomToFeature,
        updateLayers,
        loadGeojson,
        removeLayer,
        zoomToLayer,
        showOrHide,
        addNewMap,
        addLayerForm,
        wfsGeoserver,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export default MapContextProvider;
