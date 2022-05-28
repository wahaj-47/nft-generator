import { createContext, useContext, useEffect, useState } from "react";

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
    size: 0,
    height: 0,
    width: 0,
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

  useEffect(() => {
    let updatedFileMap = {
      root: {
        id: "root",
        name: "Home",
        isDir: true,
        childrenIds: [],
        droppable: false,
      },
    };

    layers.forEach((layer) => {
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
        },
      };
    });

    rarities.forEach((rarity) => {
      rarity.layers.forEach((layer) => {
        updatedFileMap = {
          ...updatedFileMap,
          [layer]: {
            ...updatedFileMap[layer],
            childrenIds: [
              ...updatedFileMap[layer].childrenIds,
              layer + "/" + rarity.name,
            ],
          },
          [layer + "/" + rarity.name]: {
            id: layer + "/" + rarity.name,
            name: rarity.name,
            isDir: true,
            childrenIds: [],
            parentId: layer,
          },
        };
      });
    });

    files.forEach((file) => {
      updatedFileMap = {
        ...updatedFileMap,
        [file.parent]: {
          ...updatedFileMap[file.parent],
          childrenIds: [...updatedFileMap[file.parent].childrenIds, file.id],
        },
        [file.id]: {
          id: file.id,
          name: file.file.name,
          thumbnailUrl: file.url,
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
        percentage: (element.sliderValue * 100) / totalSliderValue,
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
                        (element.sliderValue * 100) / totalSliderValue,
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
      (rarity) => rarity.layers.length < layers.length
    );

    setRaritiesWithLayersRequiringPercentage(
      raritiesMissingLayers.map((rarity) => {
        const layersRequiringPercentage = layers
          .filter(
            (missingLayer) =>
              !rarity.layers.some((layer) => layer === missingLayer)
          )
          .map((layer) => {
            let raritiesWithMissingLayer = rarities.filter(
              (rarityWithMissingLayer) =>
                rarityWithMissingLayer.layers.includes(layer)
            );

            let percentage = 100 / raritiesWithMissingLayer.length;
            raritiesWithMissingLayer = raritiesWithMissingLayer.map(
              (rarity) => ({
                ...rarity,
                percentage,
                sliderValue: 50,
              })
            );

            return {
              name: layer,
              visible: raritiesWithMissingLayer.length > 0,
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
  const addFile = (file, currentFolderId) => {
    const url = URL.createObjectURL(file);
    setFiles([
      ...files,
      {
        id: `${currentFolderId}/${file.name}`,
        file,
        url,
        parent: currentFolderId,
      },
    ]);
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
  };

  const submit = () => {
    if (!projectSettings.name) {
      alert("Enter collection name");
      return;
    }
    if (!projectSettings.description) {
      alert("Enter collection description");
      return;
    }
    if (!projectSettings.size) {
      alert("Enter collection size");
      return;
    }
    if (!projectSettings.width) {
      alert("Enter image width");
      return;
    }
    if (!projectSettings.height) {
      alert("Enter image height");
      return;
    }
    if (layers.length < 1) {
      alert("Add atleast one layer");
      return;
    }
    if (rarities.length < 1) {
      alert("Add atleast one rairty");
      return;
    }
    if (files.length < 1) {
      alert("Add files for layers");
      return;
    }

    let totalCount = 0;

    const links = rarities.map((rarity) => {
      const count = rarity.percentage * projectSettings.size;
      return { ...rarity, count };
    });

    if (totalCount > projectSettings.size) {
      const difference = totalCount - projectSettings.size;
      links[links.length - 1].count -= difference;
    }

    const data = { ...projectSettings, layers, links };
  };

  return (
    <ProjectInfoContext.Provider
      value={{
        layers,
        addLayer,
        removeLayer,
        rarities,
        addRarity,
        removeRarity,
        updateRarityLayers,
        updateRarityPercentage,
        raritiesWithLayersRequiringPercentage,
        setLayerVisibility,
        setLayerRarityPercentage,
        files,
        addFile,
        removeFiles,
        projectSettings,
        updateProjectSettings,
        fileMap,
        reset,
        submit,
      }}
    >
      {children}
    </ProjectInfoContext.Provider>
  );
}

export function useProjectInfoContext() {
  return useContext(ProjectInfoContext);
}
