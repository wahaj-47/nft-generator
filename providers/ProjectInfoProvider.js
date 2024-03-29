import download from "downloadjs";
import moment from "moment";
import { createContext, useContext, useEffect, useState } from "react";
import engine from "../services/engine";

const ProjectInfoContext = createContext();

export function ProjectInfoProvider({ children }) {
  const [layers, setLayers] = useState([]);
  const [rarities, setRarities] = useState([]);
  const [
    raritiesWithLayersRequiringPercentage,
    setRaritiesWithLayersRequiringPercentage,
  ] = useState([]);
  const [projectSettings, setProjectSettings] = useState({
    name: "",
    description: "",
    size: "",
    height: "",
    width: "",
  });
  const [files, setFiles] = useState([]);
  const [fileMap, setFileMap] = useState({
    root: {
      id: "root",
      name: "Home",
      isDir: true,
      childrenIds: [],
    },
  });
  const [collectionId, setCollectionId] = useState(null);
  const [projectUpdated, setProjectUpdated] = useState(true);

  const [isGeneratingPreviews, setGeneratingPreviews] = useState(false);
  const [isGenerating, setGenerating] = useState(false);

  useEffect(() => {
    try {
      const projectSettings = JSON.parse(
        localStorage.getItem("projectSettings")
      );
      if (projectSettings) setProjectSettings(projectSettings);

      const layers = JSON.parse(localStorage.getItem("layers"));
      if (layers) setLayers(layers);

      const rarities = JSON.parse(localStorage.getItem("rarities"));
      if (rarities) setRarities(rarities);

      const raritiesWithLayersRequiringPercentage = JSON.parse(
        localStorage.getItem("raritiesWithLayersRequiringPercentage")
      );
      if (raritiesWithLayersRequiringPercentage)
        setRaritiesWithLayersRequiringPercentage(
          raritiesWithLayersRequiringPercentage
        );
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("projectSettings", JSON.stringify(projectSettings));
      localStorage.setItem("layers", JSON.stringify(layers));
      localStorage.setItem("rarities", JSON.stringify(rarities));
      localStorage.setItem(
        "raritiesWithLayersRequiringPercentage",
        JSON.stringify(raritiesWithLayersRequiringPercentage)
      );
    } catch (error) {
      console.log(error);
    }

    setCollectionId(null);
    setProjectUpdated(true);
  }, [
    layers,
    rarities,
    projectSettings,
    files,
    raritiesWithLayersRequiringPercentage,
  ]);

  useEffect(() => {
    const now = moment();

    let updatedFileMap = {
      root: {
        id: "root",
        name: "Home",
        isDir: true,
        childrenIds: [],
        droppable: false,
        modDate: now.subtract(1, "minute"),
      },
    };

    layers.forEach((layer, index) => {
      updatedFileMap = {
        ...updatedFileMap,
        root: {
          ...updatedFileMap.root,
          childrenIds: [...updatedFileMap.root.childrenIds, layer],
        },
        [layer]: {
          id: layer,
          name: layer,
          isDir: true,
          childrenIds: [],
          parentId: "root",
          droppable: false,
          modDate: now.add(index, "minute"),
        },
      };
    });

    rarities.forEach((rarity, index) => {
      rarity.layers
        .filter((rarityLayer) => layers.some((layer) => layer === rarityLayer))
        .forEach((layer) => {
          updatedFileMap = {
            ...updatedFileMap,
            [layer]: {
              ...updatedFileMap[layer],
              childrenIds: [
                ...updatedFileMap[layer].childrenIds,
                layer + "\\" + rarity.name,
              ],
            },
            [layer + "\\" + rarity.name]: {
              id: layer + "\\" + rarity.name,
              name: rarity.name,
              isDir: true,
              childrenIds: [],
              parentId: layer,
              modDate: now.add(index, "minute"),
            },
          };
        });
    });

    files.forEach((file, index) => {
      const fileLayer = file.parent.split("\\")[0];
      const fileRarity = file.parent.split("\\")[1];
      const rarity = rarities.find((rarity) => rarity.name === fileRarity);

      if (layers.includes(fileLayer))
        if (rarities.some((rarity) => rarity.name === fileRarity))
          if (rarity.layers.includes(fileLayer))
            updatedFileMap = {
              ...updatedFileMap,
              [file.parent]: {
                ...updatedFileMap[file.parent],
                childrenIds: [
                  ...updatedFileMap[file.parent].childrenIds,
                  file.id,
                ],
              },
              [file.id]: {
                id: file.id,
                name: file.name,
                thumbnailUrl: file.url,
                modDate: now.add(index, "minute"),
              },
            };
    });

    setFileMap(updatedFileMap);
  }, [layers, rarities, files]);

  // Layers operations
  const addLayer = (layer) => {
    if (layers.includes(layer)) {
      alert(`${layer} layer already exists.`);
      return;
    }
    setLayers([...layers, layer]);
  };

  const removeLayer = (layer) => {
    if (rarities.length > 0 && layers.length === 1) {
      alert("Remove the rarities before removing the layers");
      return;
    }
    setLayers(layers.filter((element) => element !== layer));
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const reorderLayers = (reorderedLayers) => {
    const updatedLayers = reorder(
      layers,
      reorderedLayers.source.index,
      reorderedLayers.destination.index
    );
    setLayers(updatedLayers);
  };

  // Rarity operations
  const addRarity = (rarity) => {
    if (rarities.some((element) => element.name === rarity)) {
      alert(`${rarity} rarity already exists.`);
      return;
    }

    const updatedRarities = [
      ...rarities,
      { name: rarity, layers, sliderValue: 50 },
    ];

    const totalSliderValue = updatedRarities.reduce(
      (previousValue, currentValue) => {
        return Number(previousValue) + Number(currentValue.sliderValue);
      },
      0
    );

    setRarities(
      updatedRarities.map((rarity) => ({
        ...rarity,
        percentage: (rarity.sliderValue * 100) / totalSliderValue,
      }))
    );
  };

  const removeRarity = (rarity) => {
    setRarities(rarities.filter((element) => element.name !== rarity.name));
  };

  const updateRarityLayers = (rarity, layer, action) => {
    setRarities(
      rarities.map((element) => {
        if (element.name === rarity.name) {
          if (action === "add")
            return { ...rarity, layers: [...element.layers, layer] };
          if (action === "remove")
            return {
              ...rarity,
              layers: element.layers.filter((element) => element !== layer),
            };
        }
        return element;
      })
    );
  };

  const updateRarityPercentage = (rarity, sliderValue) => {
    const updatedRarities = rarities.map((element) => {
      if (element.name === rarity.name) {
        return {
          ...element,
          sliderValue: sliderValue,
        };
      }

      return element;
    });

    const totalSliderValue = updatedRarities.reduce(
      (previousValue, currentValue) => {
        return Number(previousValue) + Number(currentValue.sliderValue);
      },
      0
    );

    setRarities(
      updatedRarities.map((element) => ({
        ...element,
        percentage: (element.sliderValue * 100) / (totalSliderValue || 1),
      }))
    );
  };

  // Rarity link operations=
  const setLayerVisibility = (updatedRarity, updatedLayer) => (e) => {
    setRaritiesWithLayersRequiringPercentage(
      raritiesWithLayersRequiringPercentage.map((rarity) => {
        if (rarity.name === updatedRarity.name) {
          return {
            ...rarity,
            layers: rarity.layers.map((layer) => {
              if (layer.name === updatedLayer.name) {
                return {
                  ...layer,
                  visible: e.target.checked,
                };
              }
              return layer;
            }),
          };
        }
        return rarity;
      })
    );
  };

  const setLayerRarityPercentage =
    (updatedRarity, updatedLayer, updatedLayerRarity) => (e) => {
      setRaritiesWithLayersRequiringPercentage(
        raritiesWithLayersRequiringPercentage.map((rarity) => {
          if (rarity.name === updatedRarity.name) {
            return {
              ...rarity,
              layers: rarity.layers.map((layer) => {
                if (layer.name === updatedLayer.name) {
                  const updatedRarities = layer.rarities.map((rarity) => {
                    if (rarity.name === updatedLayerRarity.name) {
                      return { ...rarity, sliderValue: e.target.value };
                    }
                    return rarity;
                  });

                  const totalSliderValue = updatedRarities.reduce(
                    (previousValue, currentValue) => {
                      return (
                        Number(previousValue) + Number(currentValue.sliderValue)
                      );
                    },
                    0
                  );

                  return {
                    ...layer,
                    rarities: updatedRarities.map((element) => ({
                      ...element,
                      percentage:
                        (element.sliderValue * 100) / (totalSliderValue || 1),
                    })),
                  };
                }
                return layer;
              }),
            };
          }
          return rarity;
        })
      );
    };

  useEffect(() => {
    const raritiesMissingLayers = rarities.filter(
      (rarity) => rarity.layers.length < layers.length && rarity.percentage > 0
    );

    setRaritiesWithLayersRequiringPercentage(
      raritiesMissingLayers.map((rarity) => {
        const layersInState = raritiesWithLayersRequiringPercentage.find(
          (rarityWithLayerRequiringPercentage) =>
            rarityWithLayerRequiringPercentage.name === rarity.name
        )?.layers;

        const layersRequiringPercentage = layers
          .filter(
            (missingLayer) =>
              !rarity.layers.some((layer) => layer === missingLayer)
          )
          .map((layer) => {
            const layerInState = layersInState?.find(
              (layerInState) => layerInState.name === layer
            );

            let raritiesWithMissingLayer = rarities.filter(
              (rarityWithMissingLayer) =>
                rarityWithMissingLayer.layers.includes(layer)
            );

            let percentage = 100 / raritiesWithMissingLayer.length;
            raritiesWithMissingLayer = raritiesWithMissingLayer.map(
              (rarity) => {
                const rarityInState = layerInState?.rarities.find(
                  (rarityInState) => rarityInState.name === rarity.name
                );

                return {
                  ...rarity,
                  percentage:
                    rarityInState?.percentage !== undefined
                      ? rarityInState?.percentage
                      : percentage,
                  sliderValue:
                    rarityInState?.sliderValue !== undefined
                      ? rarityInState?.sliderValue
                      : 50,
                };
              }
            );

            return {
              name: layer,
              visible:
                layerInState?.visible !== undefined
                  ? layerInState?.visible
                  : raritiesWithMissingLayer.length > 0,
              rarities: raritiesWithMissingLayer,
              disabled: raritiesWithMissingLayer.length < 1,
            };
          });

        return {
          ...rarity,
          layers: layersRequiringPercentage,
        };
      })
    );
  }, [rarities, layers]);

  // File operations
  const addFiles = (selectedFiles, currentFolderId, callback) => {
    const formattedFiles = Array.from(selectedFiles).map((file) => {
      const url = URL.createObjectURL(file);
      return {
        id: `${currentFolderId}\\${file.name}`,
        file,
        url,
        parent: currentFolderId,
        name: file.name,
      };
    });

    setFiles([...files, ...formattedFiles]);

    callback();
  };

  const removeFiles = (selectedFiles) => {
    setFiles(
      files.filter(
        (file) =>
          !selectedFiles.some((selectedFile) => selectedFile.id === file.id)
      )
    );
  };

  // Project settings
  const updateProjectSettings = (key) => (e) => {
    setProjectSettings({ ...projectSettings, [key]: e.target.value });
  };

  const reset = () => {
    setLayers([]);
    setRarities([]);
    setProjectSettings({
      name: "",
      description: "",
      size: "",
      height: "",
      width: "",
    });
    setFiles([]);
  };

  const isValid = () => {
    if (!projectSettings.name) {
      alert("Enter collection name");
      return false;
    }
    if (!projectSettings.description) {
      alert("Enter collection description");
      return false;
    }
    if (!projectSettings.size) {
      alert("Enter collection size");
      return false;
    }
    if (!projectSettings.width) {
      alert("Enter image width");
      return false;
    }
    if (!projectSettings.height) {
      alert("Enter image height");
      return;
    }
    if (layers.length < 1) {
      alert("Add atleast one layer");
      return false;
    }
    if (rarities.length < 1) {
      alert("Add atleast one rairty");
      return false;
    }
    if (files.length < 1) {
      alert("Add files for layers");
      return false;
    }

    return true;
  };

  const submit =
    (isPreview = false) =>
    async () => {
      if (!isValid()) return;

      try {
        if (isPreview) setGeneratingPreviews(true);
        else setGenerating(true);

        let totalCount = 0;
        const links = rarities.map((rarity) => {
          const count = isPreview
            ? 1
            : Math.ceil((rarity.percentage * projectSettings.size) / 100);
          totalCount += count;
          return { ...rarity, count };
        });

        if (!isPreview && totalCount > projectSettings.size) {
          const difference = totalCount - projectSettings.size;
          links[links.length - 1].count -= difference;
        }

        const linkRelations = raritiesWithLayersRequiringPercentage
          .filter((rarity) => rarity.layers.some((layer) => layer.visible))
          .map((rarity) => ({
            ...rarity,
            layers: rarity.layers.filter((layer) => layer.visible),
          }))
          .map((rarity) =>
            rarity.layers.map((layer) => {
              const percentages = {};
              layer.rarities.forEach((rarity) => {
                percentages[rarity.name] = rarity.percentage;
              });
              return { link: rarity.name, layer: layer.name, percentages };
            })
          )
          .flat();

        const data = {
          name: projectSettings.name,
          description: projectSettings.description,
          size: Number(isPreview ? rarities.length : projectSettings.size),
          width: Number(projectSettings.width),
          height: Number(projectSettings.height),
          layers,
          links,
          linkRelations,
        };

        const formData = new FormData();

        files
          .filter((v, i, a) => a.findIndex((v2) => v2.id === v.id) === i)
          .forEach((file) => {
            const fileLayer = file.parent.split("\\")[0];
            const fileRarity = file.parent.split("\\")[1];
            const rarity = rarities.find(
              (rarity) => rarity.name === fileRarity
            );

            if (layers.includes(fileLayer))
              if (rarities.some((rarity) => rarity.name === fileRarity))
                if (rarity.layers.includes(fileLayer))
                  formData.set(file.id, file.file, file.file.name);
          });

        let newCollectionId = null;
        if (!newCollectionId) {
          newCollectionId = await engine.setup(data);
          setCollectionId(newCollectionId);
        }
        formData.set("collectionId", newCollectionId);
        if (true) {
          await engine.uploadFiles(formData);
        }
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const blob = await engine.generate(newCollectionId);
        download(blob, `${newCollectionId}.zip`, "application/zip");
        setProjectUpdated(false);
        if (isPreview) setGeneratingPreviews(false);
        else setGenerating(false);
      } catch (error) {
        console.log("Error", error);
        alert(error);
        if (isPreview) setGeneratingPreviews(false);
        else setGenerating(false);
      }
    };

  return (
    <ProjectInfoContext.Provider
      value={{
        layers,
        addLayer,
        removeLayer,
        reorderLayers,
        rarities,
        addRarity,
        removeRarity,
        updateRarityLayers,
        updateRarityPercentage,
        raritiesWithLayersRequiringPercentage,
        setLayerVisibility,
        setLayerRarityPercentage,
        files,
        addFiles,
        removeFiles,
        projectSettings,
        updateProjectSettings,
        fileMap,
        reset,
        submit,
        isGeneratingPreviews,
        isGenerating,
      }}
    >
      {children}
    </ProjectInfoContext.Provider>
  );
}

export function useProjectInfoContext() {
  return useContext(ProjectInfoContext);
}
