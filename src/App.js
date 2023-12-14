// App.js
import React, { useState, useEffect } from 'react';
import { getReservations, saveReservation } from './storage';
import data from './data';

function App() {
  // 현재 선택된 날짜
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 예약된 시간을 관리
  const [reservedTimes, setReservedTimes] = useState([]);

  
  // selectdDate 변경 시 실행
  useEffect(() => {
    const storedReservations = getReservations();
    const reservedTimesFromData = data.map((reservation) => reservation.date);

    setReservedTimes([...storedReservations.map(reservation => new Date(reservation.date)), ...reservedTimesFromData]);
  }, [selectedDate]);

  // 사용자가 예약한 시간을 처리
  const handleReservation = (selectedTime) => {
    if (!reservedTimes.includes(selectedTime)) {
      const reservation = {
        id: getNextId(),
        // 2-digit : 두 자리 숫자로 표시
        // numeric : 한 자리 숫자로 표시
        time: selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: selectedTime.toLocaleDateString(),
      };

      // 예약이 가능하면 예약을 저장하는 saveReservation 함수
      saveReservation(reservation);

      setReservedTimes([...reservedTimes, selectedTime]);
      alert('예약이 완료되었습니다.');
    } else {
      alert('선택한 시간은 예약이 불가능합니다.');
    }
  };

  const getNextId = () => {
    const storedReservations = getReservations();
    const maxId = storedReservations.reduce((max, item) => (item.id > max ? item.id : max), 0);
    return maxId + 1;
  };

  // 예약 가능한 시간을 계산
  // 현재 선택한 날짜, startHour시부터 endHour시까지
  const getAvailableTimeSlots = () => {
    const startHour = 10;
    const endHour = 16;
    const availableTimeSlots = [];
    const startTime = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), startHour, 0);
    const endTime = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), endHour, 0);

    let currentTime = new Date(startTime);

    while (currentTime <= endTime) {
      availableTimeSlots.push(new Date(currentTime));
      currentTime.setHours(currentTime.getHours() + 1);
    }

    // 예약이 완료된 시간을 필터링하여 제외
    const availableSlotsWithoutReserved = availableTimeSlots.filter(
      (time) => !reservedTimes.some((reserved) => reserved.getTime() === time.getTime())
    );

    return availableSlotsWithoutReserved;
  };

  return (
    <div className="App">
      <div style={{ maxWidth: '1200px', width: '1200px', margin: '0 auto' }}>
        <div>
          <label htmlFor="datePicker">날짜 선택: </label>
          <input
            type="date"
            id="datePicker"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
          />
        </div>
        <div style={{ height: '200px', background: 'skyblue', marginTop: '10px' }}>
          오늘의 날짜 : {selectedDate.toLocaleDateString()}
        </div>
        <div>
          <h2>{selectedDate.toLocaleDateString()} 예약 가능한 시간:</h2>
          {getAvailableTimeSlots().map((time) => (
            <p key={time.getTime()} onClick={() => handleReservation(time)}>
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
