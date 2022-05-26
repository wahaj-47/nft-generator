import { createContext, useContext, useEffect, useState } from "react";

const ProjectInfoContext = createContext();

export function ProjectInfoProvider({ children }) {
  const [layers, setLayers] = useState([]);
  const [rarities, setRarities] = useState([]);
  const [projectSettings, setProjectSettings] = useState({
    name: "",
    description: "",
    size: 0,
    height: 0,
    width: 0,
  });

  const [fileMap, setFileMap] = useState({
    root: {
      id: "root",
      name: "Home",
      isDir: true,
      childrenIds: [],
      childrenCount: 0,
    },
  });

  useEffect(() => {
    let updatedFileMap = fileMap;

    layers.forEach((layer) => {
      updatedFileMap = {
        ...updatedFileMap,
        root: {
          ...updatedFileMap.root,
          childrenIds: [...updatedFileMap.root.childrenIds, layer],
          childrenCount: updatedFileMap.root.childrenCount + 1,
        },
        [layer]: {
          id: layer,
          name: layer,
          isDir: true,
          childrenIds: [],
          childrenCount: 0,
          parentId: "root",
        },
      };
    });

    console.log(layers, updatedFileMap);

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
            childrenCount: updatedFileMap[layer].childrenCount + 1,
          },
          [layer + "/" + rarity.name]: {
            id: layer + "/" + rarity.name,
            name: rarity.name,
            isDir: true,
            childrenIds: [],
            childrenCount: 0,
            parentId: layer,
          },
        };
      });
    });

    setFileMap(updatedFileMap);
  }, [layers, rarities]);

  // Layers operations
  const addLayer = (layer) => {
    if (layers.includes(layer)) {
      alert(`${layer} layer already exists.`);
      return;
    }
    setLayers([...layers, layer]);
  };

  const removeLayer = (layer) => {
    setLayers([...layers.filter((element) => element !== layer)]);
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
    setRarities([
      ...rarities.filter((element) => element.name !== rarity.name),
    ]);
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
        projectSettings,
        updateProjectSettings,
        fileMap,
        reset,
      }}
    >
      {children}
    </ProjectInfoContext.Provider>
  );
}

export function useProjectInfoContext() {
  return useContext(ProjectInfoContext);
}
