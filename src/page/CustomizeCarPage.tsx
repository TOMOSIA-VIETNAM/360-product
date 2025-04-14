import styles from "./CustomizeCarPage.module.scss";
import { Tabs, Tab, Box, Button, Typography, IconButton } from "@mui/material";
import { useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

// Dữ liệu màu xe
const carColors = [
  {
    id: 1,
    name: "アヴェンチュリン・レッド（メタリック）",
    image: "/src/assets/aventurine_red.jpeg",
    price: "¥100,000",
    details: "メタリック・ペイント"
  },
  {
    id: 2,
    name: "アヴェンチュリン・レッド（メタリック）",
    image: "/src/assets/black_sapphire.jpeg",
    price: "¥0",
    details: "メタリック・ペイント"
  },
  {
    id: 3,
    name: "アルピン・ホワイト（メタリック）",
    image: "/src/assets/aventurine_red.jpeg",
    price: "¥150,000",
    details: "ソリッド・ペイント"
  },
  {
    id: 4,
    name: "カーボンブラック（メタリック）",
    image: "/src/assets/black_sapphire.jpeg",
    price: "¥200,000",
    details: "メタリック・ペイント"
  }
];

const CustomizeCarPage = () => {
  const [value, setValue] = useState(0);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [selectedColor, setSelectedColor] = useState(carColors[0]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const toggleRightPanel = () => {
    setRightPanelOpen(!rightPanelOpen);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  return (
    <div className={styles.customizeCarPage}>
      <div className={styles.customizeCarPage__container}>
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
                <img
                  src="/src/assets/listCar/bmw-4.webp"
                  alt=""
                  width="85px"
                  height="52px"
                />
                <Typography variant="body1" className={styles["name__car"]}>
                  BMW 4シリーズ
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

        <div className={styles["main"]}>
          <div className={styles["main__container"]}>
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
                <img src="/src/assets/listCar/bmw-4.webp" alt="" />
              </div>
            </div>
            <div
              className={`${styles["main__right"]} ${
                rightPanelOpen ? styles["open"] : styles["closed"]
              }`}
            >
              <div className={styles["main__right__container"]}>
                <div className={styles["main__right__container__colorCar"]}>
                  <div
                    className={
                      styles["main__right__container__colorCar__title"]
                    }
                  >
                    エクステリア
                  </div>
                  <div
                    className={
                      styles["main__right__container__colorCar__subTitle"]
                    }
                  >
                    ボディ・カラー
                  </div>
                  <div className={styles["main__right__container__colorCar__content"]}>
                    <div className={styles["main__right__container__colorCar__content__title"]}>
                      メタリック
                    </div>
                    <div className={styles["main__right__container__colorCar__content__color"]}>
                      <div className={styles["main__right__container__colorCar__content__color__item"]}>
                        {carColors.map((color) => (
                          <div
                            key={color.id}
                            className={`${styles["main__right__container__colorCar__content__color__item__color"]}
                                       ${selectedColor.id === color.id ? styles["border-active"] : ""}`}
                            onClick={() => handleColorSelect(color)}
                          >
                            <img src={color.image} alt={color.name} />
                          </div>
                        ))}
                      </div>
                    </div>


                    {selectedColor && (
                      <div className={styles["color-details"]}>
                        <div className={styles["color-name-price"]}>
                          <Typography className={styles["color-name"]}>
                            {selectedColor.name}
                          </Typography>
                          <Typography className={styles["color-price"]}>
                            {selectedColor.price}
                          </Typography>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles["main__right__container__colorCar"]}>
                  <div
                    className={
                      styles["main__right__container__colorCar__title"]
                    }
                  >
                    アロイ・ホイール
                  </div>

                  <div className={styles["main__right__container__colorCar__content"]}>
                    <div className={styles["main__right__container__colorCar__content__color"]}>
                      <div className={styles["main__right__container__colorCar__content__color__item"]}>
                        {[1,2,3,4].map((color) => (
                          <div
                            key={color}
                            className={styles["main__right__container__colorCar__content__color__item__color"]}
                            //            ${selectedColor === color ? styles["border-active"] : ""}`}
                            // onClick={() => handleColorSelect(color)}
                          >
                            <img src={`/src/assets/800_bi_color.jpeg`} alt='' />
                          </div>
                        ))}
                      </div>
                    </div>


                    {selectedColor && (
                      <div className={styles["color-details"]}>
                        <div className={styles["color-name-price"]}>
                          <Typography className={styles["color-name"]}>
                            {selectedColor.name}
                          </Typography>
                          <Typography className={styles["color-price"]}>
                            {selectedColor.price}
                          </Typography>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles["main__bottom"]}>
            <div className={styles["main__bottom__container"]}>
              <div className={styles["main__bottom__container__name"]}>
                BMW X6 M Competition
              </div>
              <Box sx={{ display: "flex", gap: "0px", alignItems: "center" }}>
                <div className={styles["main__bottom__container__price"]}>
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "5px" }}
                  >
                    <Typography
                      className={
                        styles["main__bottom__container__price__title"]
                      }
                    >
                      お支払例詳細
                    </Typography>
                    <InfoOutlinedIcon
                      sx={{
                        fontSize: "18px",
                        color: "#262626",
                        opacity: "0.8",
                      }}
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
        </div>
      </div>
    </div>
  );
};

export default CustomizeCarPage;
