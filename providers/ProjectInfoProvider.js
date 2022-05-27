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
          childrenCount: 0,
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

    setFileMap(updatedFileMap);
  }, [layers, rarities]);

  useEffect(() => {
    let updatedFileMap = fileMap;

    files.forEach((file) => {
      updatedFileMap = {
        ...updatedFileMap,
        [file.parent]: {
          ...updatedFileMap[file.parent],
          childrenIds: [
            ...updatedFileMap[file.parent].childrenIds,
            file.file.name,
          ],
        },
        [file.file.name]: {
          id: file.file.name,
          name: file.file.name,
          thumbnailUrl: file.url,
        },
      };
    });

    setFileMap(updatedFileMap);
  }, [files]);

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

  const addFile = (file, currentFolderId) => {
    const url = URL.createObjectURL(file);
    setFiles([...files, { file, url, parent: currentFolderId }]);
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
        files,
        addFile,
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
