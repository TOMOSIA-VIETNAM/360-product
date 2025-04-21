import styles from './HomePage.module.scss';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import LocalGroceryStoreOutlinedIcon from '@mui/icons-material/LocalGroceryStoreOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ListCarPage from './ListCarPage';

const HomePage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div className={styles.homePage}>
        <div className={styles['header']}>
          <img className={styles['bg_i7']} src="/assets/bg_i7.png" alt="" />
          <div className={styles['logo']}>
            <img src="/assets/logo_icon_white.svg" alt="" />
          </div>
          <div className={styles['nav']}>
            <div className={styles['nav-item']}>
              <PersonOutlinedIcon fontSize="small" sx={{ color: 'white' }} />
              <LocalGroceryStoreOutlinedIcon fontSize="small" sx={{ color: 'white' }} />
              <FavoriteBorderOutlinedIcon fontSize="small" sx={{ color: 'white' }} />
              <LocationOnOutlinedIcon fontSize="small" sx={{ color: 'white' }} />
            </div>
          </div>
        </div>
        <div className={styles['info']}>
          <div className={styles['text-thenew']}>
            <p>THE NEW</p>
          </div>
          <div className={styles['text-title']}>
            <p>BMW 2シリーズ グラン クーペ <br /> 宿泊付き試乗キャンペーン実施中&デビューフェア開催 </p>
          </div>
        </div>
      </div>
      <div className={styles['content']}>
        <div className={styles['text-warning']}>
          ※このページで使用している画像・動画は日本仕様とは異なります。また、オプション装備等を含む場合があります。
        </div>
        <div className={styles['text-title']}>
          <h1> あなたのBMWを見つけてください。 </h1>
        </div>
        <div className={styles['listCar']}>
          <ListCarPage />
        </div>
      </div>

      <div className={styles['footer']}>
        <div className={styles['footer-content']}>
          <div className={styles['footer-column']}>
            <h3>購入する</h3>
            <ul>
              <li>新車を探す</li>
              <li>認定中古車を探す</li>
              <li>下取り査定</li>
              <li>見積りシミュレーション</li>
            </ul>
          </div>
          <div className={styles['footer-column']}>
            <h3>サービス＆アクセサリー</h3>
            <ul>
              <li>メンテナンス</li>
              <li>アクセサリー</li>
              <li>BMWサービス</li>
              <li>BMWパーツ</li>
            </ul>
          </div>
          <div className={styles['footer-column']}>
            <h3>BMW Japan</h3>
            <ul>
              <li>会社概要</li>
              <li>ニュース</li>
              <li>採用情報</li>
              <li>お問い合わせ</li>
            </ul>
          </div>
          <div className={styles['footer-column']}>
            <h3>BMWグループ</h3>
            <ul>
              <li>BMWグループ</li>
              <li>BMW Motorrad</li>
              <li>MINI</li>
              <li>Rolls-Royce</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
