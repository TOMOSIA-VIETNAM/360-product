import styles from './ListCarPage.module.scss'
import listCarData from '../data/listCar.json'
import { useState } from 'react'
import ScreenSearchDesktopOutlinedIcon from '@mui/icons-material/ScreenSearchDesktopOutlined';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const ListCarPage = () => {
  const [selectedCar, setSelectedCar] = useState<typeof listCarData[0] | null>(null)
  const navigate = useNavigate();

  const handleCarClick = (car: typeof listCarData[0]) => {
    setSelectedCar(selectedCar?.id === car.id ? null : car)
  }

  const handleCustomizeClick = () => {
    if (selectedCar) {
      navigate(`/customize/${selectedCar.nameId}`, { state: { car: selectedCar } });
    }
  }

  const getRowIndex = (index: number) => Math.floor(index / 4)
  const isLastInRow = (index: number) => {
    return (index + 1) % 4 === 0 || index === listCarData.length - 1;
  }
  const selectedRowIndex = selectedCar ? getRowIndex(listCarData.findIndex(car => car.id === selectedCar.id)) : -1

  const renderCars = () => {
    const elements = []
    for (let i = 0; i < listCarData.length; i++) {
      const car = listCarData[i]
      elements.push(
        <div key={car.id} className={styles.carItem}>
          <div
            className={`${styles.carCard} ${selectedCar?.id === car.id ? styles.selected : ''}`}
            onClick={() => handleCarClick(car)}
          >
            <div style={{ display: 'flex' }}>
              <img src={car.imageView} alt={car.name} width="100%" height="200px" />
              {car.isElectricVehicle &&
                <img className={styles.electricBadge} src="/assets/icon_election.svg" alt={car.name} width="55px" height="55px" />}
            </div>
            {car.isElectricVehicle ?
              <img className={styles.evBadge} src="/assets/icon_electric.png" alt={car.name} /> :
              <img className={styles.evBadge} src="/assets/icon_electricI.png" alt={car.name} />
            }
            <div className={styles.carName}>{car.name}</div>
            {car.isElectricVehicle ?
              <div className={styles.carType}>電気自動車</div> :
              <div className={styles.carType}>ガソリン•ディーゼル</div>
            }
          </div>
        </div>
      )

      if (isLastInRow(i) && selectedRowIndex === getRowIndex(i) && selectedCar) {
        elements.push(
          <div key={`details-${selectedCar.id}`} className={styles.selectedCarDetails}>
            <div className={styles.detailsView}>
              <div><img className={styles.selectedCarImage} src={selectedCar.image} alt={selectedCar.name} /></div>
              <div className={styles.groupCardItem} >
                <div className={styles.cardItemFirst}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {selectedCar.isElectricVehicle ?
                      <img className={styles.evBadge} src="/assets/icon_electric.png" alt={selectedCar.name} /> :
                      <img className={styles.evBadge} src="/assets/icon_electricI.png" alt={selectedCar.name} />
                    }
                    <div className={styles.carName} style={{ display: 'flex' }}>{selectedCar.name}</div>
                    <div className={styles.carType} style={{ display: 'flex' }}>
                      {selectedCar.isElectricVehicle ? '電気自動車' : 'ガソリン•ディーゼル'}
                    </div>
                  </div>
                  <div className={styles.defaultButton}>
                    <p> モデル紹介 </p>
                  </div>
                </div>
                <div className={styles.cardItem}>
                  <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 10 }}>
                    <img src="/assets/icon_car.svg" alt={selectedCar.name} />
                  </div>
                  <Button
                    variant="contained"
                    className={styles.button}
                    sx={{ width: '100%', height: '54px', borderRadius: '0px' }}
                    onClick={handleCustomizeClick}
                  >
                    <p> 見積りシミュレーション </p>
                  </Button>
                </div>
                <div className={styles.cardItem}>
                  <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 10 }}>
                    <ScreenSearchDesktopOutlinedIcon style={{ fontSize: 48 }} />
                  </div>
                  <div className={styles.defaultButton}>
                    <p> 新車在庫検索 </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    }

    return elements
  }

  return (
    <div className={styles.listCarPage}>
      <div className={styles.listCarContainer}>
        {renderCars()}
      </div>
    </div>
  )
}

export default ListCarPage
