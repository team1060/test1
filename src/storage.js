// storage.js
// 로컬 스토리지에서 예약 정보를 가져오고 저장하는 함수들

export function getReservations() {
    const storedReservations = localStorage.getItem('reservations');
    return storedReservations ? JSON.parse(storedReservations) : [];
  }
  
  export function saveReservation(reservation) {
    const storedReservations = getReservations();
    const updatedReservations = [...storedReservations, reservation];
    localStorage.setItem('reservations', JSON.stringify(updatedReservations));
  }
  