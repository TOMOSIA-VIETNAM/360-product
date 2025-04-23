import styles from "./CustomizeCarPage.module.scss";
import { Tabs, Tab, Box, Button, Typography, IconButton } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import listCarData from "../data/listCar.json";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import iconLogoBMW from "/icon_logo.svg";
interface Color {
  id: string | number;
  name: string;
  description: string;
  price: string;
  imageColor: string;
}

interface Wheel {
  id: string | number;
  name: string;
  description: string;
  price: string;
  imageWheel: string;
}

interface Car {
  nameId: string;
  name: string;
  image: string;
  colors: Color[];
  wheels: Wheel[];
}

interface CI360Viewer {
  update: () => void;
  destroy: () => void;
  folder: string;
  activeImageX: number;
  container: HTMLElement;
  init: (container: HTMLElement, update?: boolean) => void;
}

interface HotspotPosition {
  imageIndex: number;
  xCoord: number;
  yCoord: number;
}

interface HotspotVariantImage {
  src: string;
  alt: string;
}

interface HotspotVariant {
  images?: HotspotVariantImage[];
  description?: string;
}

interface HotspotPopupProps {
  popupSelector?: string;
}

interface GurkhaHotspotConfig {
  variant?: HotspotVariant;
  popupProps?: HotspotPopupProps;
  initialDimensions?: [number, number];
  positions?: HotspotPosition[];
}

interface HotspotConfig {
  position: {
    x: number;
    y: number;
  };
  content?: string;
  title?: string;
  id?: string;
  className?: string;
}

declare global {
  interface Window {
    CI360?: {
      init: () => void;
      update: (
        id: string | null,
        forceUpdate: boolean,
        hotspotConfigs: Record<string, HotspotConfig> | null
      ) => void;
      getActiveIndexByID: (id: string, orientation: string) => number | null;
      changeFolder: (folder: string, showIndex: number) => void;
      _viewers?: CI360Viewer[];
      addHotspots: (id: string, config: GurkhaHotspotConfig[]) => void;
    };
  }
}

const CustomizeCarPage = () => {
  const [value, setValue] = useState(0);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [selectedWheel, setSelectedWheel] = useState<Wheel | null>(null);
  const { nameId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [carData, setCarData] = useState<Car | null>(null);
  const [linkFolder, setLinkFolder] = useState("");
  const isBmwZ4 = nameId === "bmw_z4";
  // const adjustImageUrl = useCallback((url: string | undefined): string => {
  //   if (!url) return "";
  //   return url.replace(/\/customize\/assets\//g, "/assets/");
  // }, [])

  const removeHotspotPopupById = useCallback((popupId: string) => {
    const popupElements = document.querySelectorAll(
      `div[data-hotspot-popup-id="${popupId}"]`
    );

    if (popupElements.length === 0) {
      return;
    }

    popupElements.forEach((element) => {
      element.parentNode?.removeChild(element);
    });
  }, []);

  const removeAllHotspotPopups = useCallback(() => {
    const popupElements = document.querySelectorAll(
      "div[data-hotspot-popup-id]"
    );
    popupElements.forEach((element) => {
      const popupId = element.getAttribute("data-hotspot-popup-id");
      if (popupId) {
        removeHotspotPopupById(popupId);
      }
    });
  }, [removeHotspotPopupById]);

  const removeHotspotIconById = useCallback((iconId: string) => {
    const iconElements = document.querySelectorAll(
      `div[data-hotspot-icon-id="${iconId}"]`
    );

    if (iconElements.length === 0) {
      return;
    }

    iconElements.forEach((element) => {
      element.parentNode?.removeChild(element);
    });
  }, []);

  const removeAllHotspotIcons = useCallback(() => {
    const iconElements = document.querySelectorAll("div[data-hotspot-icon-id]");

    iconElements.forEach((element) => {
      const iconId = element.getAttribute("data-hotspot-icon-id");
      if (iconId) {
        removeHotspotIconById(iconId);
      }
    });
  }, [removeHotspotIconById]);

  const removeAllHotspots = useCallback(() => {
    removeAllHotspotPopups();
    removeAllHotspotIcons();
  }, [removeAllHotspotPopups, removeAllHotspotIcons]);

  const GURKHA_SUV_HOTSPOTS_CONFIG: GurkhaHotspotConfig[] = [
    {
      variant: {
        images: [
          {
            src: "https://scaleflex.cloudimg.io/v7/demo/360-assets/AIR_SNORKEL_FINAL_JPG.png?vh=88bccb",
            alt: "air snorkel",
          },
        ],
        description:
          "The snorkel gives the Gurkha an unmatched water-wading ability and ensures ample supply of fresh air for combustion.",
      },
      popupProps: { popupSelector: "air-intake-popup" },
      initialDimensions: [1170, 662],
      positions: [
        { imageIndex: 6, xCoord: 527, yCoord: 430 },
        { imageIndex: 7, xCoord: 457, yCoord: 430 },
        { imageIndex: 8, xCoord: 407, yCoord: 430 },
        { imageIndex: 9, xCoord: 337, yCoord: 430 },
        { imageIndex: 10, xCoord: 301, yCoord: 430 },
        { imageIndex: 11, xCoord: 301, yCoord: 430 },
        { imageIndex: 12, xCoord: 281, yCoord: 430 },
        { imageIndex: 13, xCoord: 251, yCoord: 430 },
      ],
    },
  ];

  const toggleRightPanel = () => {
    setRightPanelOpen(!rightPanelOpen);
  };

  const handleColorSelect = useCallback(
    (color: Color) => {
      removeAllHotspots();
      setSelectedColor(color);
    },
    [linkFolder, removeAllHotspots]
  );

  const handleWheelSelect = useCallback(
    (wheel: Wheel) => {
      removeAllHotspots();
      setSelectedWheel(wheel);
      window?.CI360?.changeFolder(linkFolder, 9);
    },
    [linkFolder, removeAllHotspots]
  );

  useEffect(() => {
    const loadScript = () => {
      if (!document.querySelector('script[src*="tms-360"]')) {
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/npm/tms-360@1.0.18/dist/tms-360.min.js";
        script.async = true;
        script.onload = () => {
          if (window.CI360) {
            window.CI360.init();
          }
        };
        document.body.appendChild(script);
      } else if (window.CI360) {
        window.CI360.init();
        console.log("CI360 initialized", window.CI360);
      }
    };
    loadScript();
    const carDataDetail = listCarData.find((car) => car.nameId === nameId);
    setCarData(carDataDetail as unknown as Car);
  }, []);

  useEffect(() => {
    if (!carData) return;

    const searchParams = new URLSearchParams(location.search);
    const colorName = searchParams.get("color");
    const wheelName = searchParams.get("wheel");

    let initialColor = carData.colors[0];
    let initialWheel = carData.wheels[0];

    if (colorName) {
      const foundColor = carData.colors.find(
        (c) => c.name.toString() === colorName
      );
      if (foundColor) initialColor = foundColor;
    }

    if (wheelName) {
      const foundWheel = carData.wheels.find(
        (w) => w.name.toString() === wheelName
      );
      if (foundWheel) initialWheel = foundWheel;
    }

    setSelectedColor(initialColor);
    setSelectedWheel(initialWheel);

    const initialFolderPath = `https://tms-360-product.s3.ap-southeast-1.amazonaws.com/upload/${carData.nameId}/${initialColor.name}/${initialWheel.name}/`;
    setLinkFolder(initialFolderPath);
    setTimeout(() => {
      const viewer = window.CI360?._viewers?.[0];
      if (window.CI360 && viewer && viewer.container && isBmwZ4) {
        window.CI360.addHotspots("gurkha-suv", GURKHA_SUV_HOTSPOTS_CONFIG);
      }
    }, 200);
  }, [carData, location.search, navigate]);

  useEffect(() => {
    if (carData && selectedColor && selectedWheel) {
      const folderPath = `https://tms-360-product.s3.ap-southeast-1.amazonaws.com/upload/${carData.nameId}/${selectedColor.name}/${selectedWheel.name}/`;
      setLinkFolder(folderPath);
    }
  }, [carData, selectedColor, selectedWheel]);

  const updateDataFolder = function (folder: string) {
    removeAllHotspots();

    const viewer = window?.CI360?._viewers?.[0];
    if (viewer) {
      const activeImageX =
        viewer.activeImageX === 1 ? 0 : viewer.activeImageX - 1;
      try {
        window?.CI360?.changeFolder(folder, activeImageX);
        if (isBmwZ4) {
          window?.CI360?.addHotspots("gurkha-suv", GURKHA_SUV_HOTSPOTS_CONFIG);
        }
      } catch (error) {
        console.error("Error changing folder:", error);
      }
    } else {
      console.warn("No viewer found");
    }
  };

  useEffect(() => {
    const existingViewer = window?.CI360?._viewers?.[0];
    if (existingViewer) {
      updateDataFolder(linkFolder);
    } else {
      const loadScript = () => {
        if (!document.querySelector('script[src*="tms-360"]')) {
          console.log("Loading TMS-360 script");
          const script = document.createElement("script");
          script.src =
            "https://cdn.jsdelivr.net/npm/tms-360@1.0.14/dist/tms-360.min.js";
          script.async = true;
          script.onload = () => {
            console.log("Script loaded, initializing CI360");
            if (window.CI360) {
              window.CI360.init();
            }
          };
          document.body.appendChild(script);
        } else if (window.CI360) {
          console.log("CI360 already exists, initializing");
          window.CI360.init();
        }
      };

      loadScript();
    }
  }, [linkFolder]); // linkFolderの変更を監視

  // Add a currency formatting function
  const formatCurrency = (price: string | number): string => {
    // Convert to number if it's a string
    const numericPrice = typeof price === "string" ? parseFloat(price) : price;

    // Format with Japanese Yen symbol and thousand separators
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericPrice);
  };

  const renderHeader = () => (
    <div className={styles["header"]}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box className={styles["header__title"]}>モデルを変更する</Box>
        <Tabs
          value={value}
          onChange={(_: React.SyntheticEvent, newValue: number) => {
            setValue(newValue);
          }}
          aria-label="car customization tabs"
        >
          <Tab label="主要諸元" />
          <Tab label="モデル・ライン" />
          <Tab label="エクステリア" />
        </Tabs>
      </Box>
      <Box className={styles["header__button"]}>
        <Box className={styles["button"]}>
          <Button variant="contained" color="primary">
            結果を見る
          </Button>
        </Box>
        <Box className={styles["header__img"]}>
          <Box className={styles["header__img__car"]}>
            {/* <img src={adjustImageUrl(carData?.image)} alt={carData?.name} width="85px" height="52px" />
            <Typography variant="body1" className={styles["name__car"]}>
              {carData?.name}
            </Typography> */}
          </Box>
          <img src={iconLogoBMW} alt="" width="65px" height="42px" />
        </Box>
      </Box>
    </div>
  );

  const renderColorOptions = () => (
    <div className={styles["main__right__container__colorCar"]}>
      <div className={styles["main__right__container__colorCar__title"]}>
        エクステリア
      </div>
      <div className={styles["main__right__container__colorCar__subTitle"]}>
        ボディ・カラー
      </div>
      <div className={styles["main__right__container__colorCar__content"]}>
        <div
          className={styles["main__right__container__colorCar__content__title"]}
        >
          メタリック
        </div>
        <div
          className={styles["main__right__container__colorCar__content__color"]}
        >
          <div
            className={
              styles["main__right__container__colorCar__content__color__item"]
            }
          >
            {carData?.colors.map((color) => (
              <div
                key={color.id}
                className={`${
                  styles[
                    "main__right__container__colorCar__content__color__item__color"
                  ]
                } ${
                  selectedColor?.id === color.id ? styles["border-active"] : ""
                }`}
                onClick={() => handleColorSelect(color)}
              >
                <img src={color.imageColor} alt={color.name} />
                {selectedColor?.id === color.id && (
                  <div className={styles["color-selected-tick"]}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="8" cy="8" r="8" fill="#262626" />
                      <path
                        d="M5 8L7 10L11 6"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {selectedColor && (
          <div className={styles["color-details"]}>
            <div className={styles["color-name-price"]}>
              <Typography className={styles["color-name"]}>
                {selectedColor.description}
              </Typography>
              <Typography className={styles["color-price"]}>
                {formatCurrency(selectedColor.price)}
              </Typography>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderWheelOptions = () => (
    <div className={styles["main__right__container__colorCar"]}>
      <div className={styles["main__right__container__colorCar__title"]}>
        アロイ・ホイール
      </div>
      <div className={styles["main__right__container__colorCar__content"]}>
        <div
          className={styles["main__right__container__colorCar__content__color"]}
        >
          <div
            className={
              styles["main__right__container__colorCar__content__color__item"]
            }
          >
            {carData?.wheels.map((wheel) => (
              <div
                key={wheel.name}
                className={`${
                  styles[
                    "main__right__container__colorCar__content__color__item__color"
                  ]
                } ${
                  selectedWheel?.id === wheel.id ? styles["border-active"] : ""
                }`}
                onClick={() => handleWheelSelect(wheel)}
              >
                <img src={wheel.imageWheel} alt="" />
                {selectedWheel?.id === wheel.id && (
                  <div className={styles["color-selected-tick"]}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="8" cy="8" r="8" fill="#262626" />
                      <path
                        d="M5 8L7 10L11 6"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {selectedWheel && (
          <div className={styles["color-details"]}>
            <div className={styles["color-name-price"]}>
              <Typography className={styles["color-name"]}>
                {selectedWheel.description}
              </Typography>
              <Typography className={styles["color-price"]}>
                {formatCurrency(selectedWheel.price)}
              </Typography>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderCarViewer = () => (
    <div
      className={`${styles["main__left"]} ${
        !rightPanelOpen ? styles["expanded"] : ""
      }`}
    >
      <div className={styles["toggle-button-container"]}>
        <IconButton
          onClick={toggleRightPanel}
          className={styles["toggle-right-panel"]}
          size="small"
        >
          {rightPanelOpen ? (
            <ChevronRightIcon sx={{ fontSize: 24, color: "#262626" }} />
          ) : (
            <ChevronLeftIcon sx={{ fontSize: 24, color: "#262626" }} />
          )}
        </IconButton>
      </div>
      <div className={styles["image-container"]}>
        {linkFolder && (
          <div
            className="cloudimage-360"
            id="gurkha-suv"
            data-folder={linkFolder}
            data-filename-x="img_{index}.jpg"
            data-amount-x="36"
            data-spin-reverse="true"
            data-speed="50"
            data-drag-speed="120"
            data-full-screen="true"
            data-hide-360-logo="true"
            data-magnifier="2"
            data-keys="true"
          ></div>
        )}
      </div>
    </div>
  );

  const renderFooter = () => (
    <div className={styles["main__bottom"]}>
      <div className={styles["main__bottom__container"]}>
        <div className={styles["main__bottom__container__name"]}>
          {carData?.name}
        </div>
        <Box sx={{ display: "flex", gap: "0px", alignItems: "center" }}>
          <div className={styles["main__bottom__container__price"]}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Typography
                className={styles["main__bottom__container__price__title"]}
              >
                お支払例詳細
              </Typography>
              <InfoOutlinedIcon
                sx={{ fontSize: "18px", color: "#262626", opacity: "0.8" }}
              />
            </Box>
            <Typography
              className={styles["main__bottom__container__price__price"]}
            >
              月々お支払例 {formatCurrency(178693)}
            </Typography>
            <Typography
              className={styles["main__bottom__container__price_button"]}
            >
              ローンシミュレーター
            </Typography>
          </div>
          <div className={styles["main__bottom__container__button"]}>
            シミュレーションした内容で見積りをする
          </div>
        </Box>
      </div>
    </div>
  );

  useEffect(() => {
    const checkHotspots = () => {
      // Kiểm tra popups
      const allPopups = document.querySelectorAll("[data-hotspot-popup-id]");
      console.log("All elements with data-hotspot-popup-id:", allPopups);
      allPopups.forEach((popup) => {
        const id = popup.getAttribute("data-hotspot-popup-id");
        console.log(`Found popup with ID: ${id}`, popup);
      });

      // Kiểm tra icons
      const allIcons = document.querySelectorAll("[data-hotspot-icon-id]");
      console.log("All elements with data-hotspot-icon-id:", allIcons);
      allIcons.forEach((icon) => {
        const id = icon.getAttribute("data-hotspot-icon-id");
        console.log(`Found icon with ID: ${id}`, icon);
      });
    };

    // Gọi hàm kiểm tra sau khi component đã render
    const timer = setTimeout(checkHotspots, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.customizeCarPage}>
      <div className={styles.customizeCarPage__container}>
        {renderHeader()}
        <div className={styles["main"]}>
          <div className={styles["main__container"]}>
            {renderCarViewer()}
            <div
              className={`${styles["main__right"]} ${
                rightPanelOpen ? styles["open"] : styles["closed"]
              }`}
            >
              <div className={styles["main__right__container"]}>
                {renderColorOptions()}
                {renderWheelOptions()}
              </div>
            </div>
          </div>
          {renderFooter()}
        </div>
      </div>
    </div>
  );
};

export default CustomizeCarPage;
