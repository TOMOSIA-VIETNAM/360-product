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

declare global {
  interface Window {
    CI360?: {
      init: () => void;
      getActiveIndexByID: (id: string, orientation: string) => number | null;
      _viewers?: CI360Viewer[];
    };
  }
}

const CustomizeCarPage = () => {
  const [value, setValue] = useState(0);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [selectedWheel, setSelectedWheel] = useState<Wheel | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const { nameId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const carData = listCarData.find((car) => car.nameId === nameId) as
    | Car
    | undefined;
  const [linkFolder, setLinkFolder] = useState(
    `https://tms-360-product.s3.ap-southeast-1.amazonaws.com/upload/${carData?.nameId}/${carData?.colors[0].name}/${carData?.wheels[0].name}/`
  );
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
      const viewer = window.CI360?._viewers?.[0];
      if (viewer) {
        // Lưu vị trí hiện
        const currentPosition = viewer.activeImageX;

        // Đặt timeout để đảm bảo cập nhật sau khi folder đã thay đổi
        setTimeout(() => {
          if (window.CI360?._viewers?.[0]) {
            window.CI360._viewers[0].activeImageX = currentPosition;
            window.CI360._viewers[0].update();
          }
        }, 300);
      }
    },
    [updateUrlParams]
  );

  const handleWheelSelect = useCallback(
    (wheel: Wheel) => {
      setSelectedWheel(wheel);
      updateUrlParams("wheel", wheel.name.toString());
    },
    [updateUrlParams]
  );

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

      // Lưu vị trí hiện tại trước khi thay đổi folder
      const currentViewer = window.CI360?._viewers?.[0];
      const currentPosition = currentViewer?.activeImageX || 0;

      setLinkFolder(folderPath);

      // Đặt timeout để đảm bảo cập nhật sau khi folder đã thay đổi
      setTimeout(() => {
        if (window.CI360?._viewers?.[0]) {
          window.CI360._viewers[0].activeImageX = currentPosition;
          window.CI360._viewers[0].update();
        }
      }, 500);
    }
  }, [carData, selectedColor, selectedWheel]);

  const getActiveIndex = useCallback(() => {
    if (window.CI360 && window.CI360.getActiveIndexByID) {
      const activeIndex = window.CI360.getActiveIndexByID("gurkha-suv", "x");
      setCurrentIndex(activeIndex || 0);
      return activeIndex;
    }
    return null;
  }, []);

  CI360Viewer.prototype.updateDataFolder = function(folder, activeImageX) {
    this.folder = folder;
    this.activeImageX = activeImageX;

    this.srcXConfig = {
      folder,
      filename: this.filenameX,
      imageList: this.imageListX,
      container: this.container,
    }

    const srcX = generateImagesPath(this.srcXConfig);

    this.imagesX = [];

    const onImageLoad = (orientation, image, index) => {
      this.imagesX[index] = image;

      const totalAmount = this.amountX;
      const totalLoadedImages = this.imagesX.length;
      const isFirstImageLoaded = !index;
      const percentage = Math.round(totalLoadedImages / totalAmount * 100);

      this.updatePercentageInLoader(percentage);
      if (isFirstImageLoaded) {
        this.onFirstImageLoaded(image);
      } else if (this.autoplay) {
        this.moveRight(index)
      }

      if (this.isReady()) {
        this.update();
      }
    }

    const loadImages = () => {
      preloadImages(
        this.srcXConfig,
        srcX,
        (onImageLoad.bind(this, ORIENTATIONS.X))
      );

      if (this.allowSpinY) {
        const srcY = generateImagesPath(this.srcYConfig);

        preloadImages(
          this.srcYConfig,
          srcY,
          onImageLoad.bind(this, ORIENTATIONS.Y)
        );
      }
    }

    if (lazyload) {
      const onFirstImageLoad = (image) => {
        this.innerBox.removeChild(image);

        loadImages();
      }

      initLazyload(srcX, this.srcXConfig, onFirstImageLoad);
    } else {
      loadImages();
    }

  }

  useEffect(() => {
    const existingViewer = document.querySelector(".cloudimage-360");
    if (existingViewer) {
      window.CI360?._viewers[0].updateDataFolder(linkFolder, currentIndex);
    } else {
      const loadScript = () => {
        if (!document.querySelector('script[src*="js-cloudimage-360-view"]')) {
          const script = document.createElement("script");
          script.src =
            "https://cdn.scaleflex.it/plugins/js-cloudimage-360-view/latest/js-cloudimage-360-view.min.js";
          script.async = true;
          script.onload = () => {
            if (window.CI360) {
              window.CI360.init();

              const viewer = document.getElementById("gurkha-suv");
              if (viewer) {
                viewer.addEventListener("mouseup", getActiveIndex);
                viewer.addEventListener("touchend", getActiveIndex);
              }
            }
          };
          document.body.appendChild(script);
        } else if (window.CI360) {
          window.CI360.init();

          const viewer = document.getElementById("gurkha-suv");
          if (viewer) {
            viewer.addEventListener("mouseup", getActiveIndex);
            viewer.addEventListener("touchend", getActiveIndex);
          }
        }
      };

      loadScript();
    }

    return () => {
      const viewer = document.getElementById("gurkha-suv");
      if (viewer) {
        viewer.removeEventListener("mouseup", getActiveIndex);
        viewer.removeEventListener("touchend", getActiveIndex);
      }
    };
  }, [linkFolder, getActiveIndex]);

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
                {selectedColor.price}
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
                {selectedWheel.price}
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
              月々お支払例 ¥178,693
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
