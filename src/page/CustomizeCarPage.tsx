import styles from "./CustomizeCarPage.module.scss";
import { Tabs, Tab, Box, Button, Typography, IconButton } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import listCarData from "../data/listCar.json";
import { useParams, useNavigate, useLocation } from "react-router-dom";

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
  const carData = listCarData.find((car) => car.nameId === nameId) as
    | Car
    | undefined;
  const [linkFolder, setLinkFolder] = useState("");
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const toggleRightPanel = () => {
    setRightPanelOpen(!rightPanelOpen);
  };

  const updateUrlParams = useCallback(
    (param: string, value: string) => {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set(param, value);
      navigate(
        {
          pathname: location.pathname,
          search: searchParams.toString(),
        },
        { replace: true }
      );
    },
    [location.pathname, location.search, navigate]
  );

  const handleColorSelect = useCallback(
    (color: Color) => {
      setSelectedColor(color);
      updateUrlParams("color", color.name.toString());
    },
    [updateUrlParams, linkFolder]
  );

  const handleWheelSelect = useCallback(
    (wheel: Wheel) => {
      setSelectedWheel(wheel);
      updateUrlParams("wheel", wheel.name.toString());
      window?.CI360?.changeFolder(linkFolder, 9);
    },
    [updateUrlParams]
  );

  useEffect(() => {
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

    if (!colorName || !wheelName) {
      const params = new URLSearchParams(location.search);
      if (!colorName) params.set("color", initialColor.name.toString());
      if (!wheelName) params.set("wheel", initialWheel.name.toString());

      navigate(
        {
          pathname: location.pathname,
          search: params.toString(),
        },
        { replace: true }
      );
    }
  }, [carData, location.search, navigate]);

  useEffect(() => {
    if (carData && selectedColor && selectedWheel) {
      const folderPath = `https://tms-360-product.s3.ap-southeast-1.amazonaws.com/upload/${carData.nameId}/${selectedColor.name}/${selectedWheel.name}/`;
      setLinkFolder(folderPath);
    }
  }, [carData, selectedColor, selectedWheel]);

  const updateDataFolder = function (folder: string) {
    const viewer = window?.CI360?._viewers?.[0];
    if (viewer) {
      const activeImageX = viewer.activeImageX === 1 ? 0 : viewer.activeImageX - 1; // デフォルト値を設定
      try {
        window?.CI360?.changeFolder(folder, activeImageX);
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
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

    // Format with Japanese Yen symbol and thousand separators
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numericPrice);
  };

  const renderHeader = () => (
    <div className={styles["header"]}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box className={styles["header__title"]}>モデルを変更する</Box>
        <Tabs
          value={value}
          onChange={handleChange}
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
            <img src={carData?.image} alt="" width="85px" height="52px" />
            <Typography variant="body1" className={styles["name__car"]}>
              {carData?.name}
            </Typography>
          </Box>
          <img
            src="/src/assets/icon_logo.svg"
            alt=""
            width="65px"
            height="42px"
          />
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
                    <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="8" cy="8" r="8" fill="#262626"/>
                      <path d="M5 8L7 10L11 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
                    <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="8" cy="8" r="8" fill="#262626"/>
                      <path d="M5 8L7 10L11 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
        {
          linkFolder && (
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
