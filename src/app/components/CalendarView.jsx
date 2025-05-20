'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { getMonthDays, getWeekDays, getHoursForDay } from '../utils/calendarUtils';

export default function CalendarView({
  viewType,
  selectedDate,
  sessions,
  onSlotClick,
  onEdit,
  onChangeView,
}) {
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState(null);

  useEffect(() => {
    setMounted(true);
    setCurrentDate(selectedDate || new Date());
  }, [selectedDate]);

  const formattedMonthYear = useMemo(() => {
    if (!currentDate) return '';
    const formatter = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });
    return formatter.format(currentDate);
  }, [currentDate]);

  if (!mounted || !currentDate) return null;

  const changeDate = (direction) => {
    const newDate = new Date(currentDate);
    if (viewType === 'month') {
      newDate.setMonth(currentDate.getMonth() + direction);
    } else if (viewType === 'week') {
      newDate.setDate(currentDate.getDate() + direction * 7);
    } else {
      newDate.setDate(currentDate.getDate() + direction);
    }
    setCurrentDate(newDate);
  };

  const isSlotOccupied = (date, hour) => {
    const slotTime = new Date(`${date.toDateString()} ${hour}`);
    return sessions.some((s) => {
      const sessionDate = new Date(s.datetime);
      const start = new Date(`${sessionDate.toDateString()} ${s.startTime}`);
      const end = new Date(`${sessionDate.toDateString()} ${s.endTime}`);
      return slotTime >= start && slotTime < end;
    });
  };

  const getSessionForSlot = (date, hour) => {
    const slotTime = new Date(`${date.toDateString()} ${hour}`);
    return sessions.find((s) => {
      const sessionDate = new Date(s.datetime);
      const start = new Date(`${sessionDate.toDateString()} ${s.startTime}`);
      const end = new Date(`${sessionDate.toDateString()} ${s.endTime}`);
      return slotTime >= start && slotTime < end;
    });
  };

  const renderHeader = (label) => (
    <div className="flex justify-between items-center mb-2">
      <h2 className="text-xl font-bold" style={{ color: '#005186' }}>{label}</h2>
      <div className="flex items-center gap-2">
        <button onClick={() => changeDate(-1)} className="px-2 py-1 border rounded">Previous</button>
        <select
  value={viewType}
  onChange={(e) => onChangeView(e.target.value)}
  className="h-[34px] px-2 py-1 border rounded text-sm" 
>
  <option value="day">Day View</option>
  <option value="week">Week View</option>
  <option value="month">Month View</option>
</select>

        <button onClick={() => changeDate(1)} className="px-2 py-1 border rounded">Next</button>
      </div>
    </div>
  );

  if (viewType === 'month') {
    const allDays = getMonthDays(currentDate.getFullYear(), currentDate.getMonth());
    const firstDayIndex = allDays[0].getDay();
    const paddedDays = [...Array(firstDayIndex).fill(null), ...allDays];
    const weeks = [];
    for (let i = 0; i < paddedDays.length; i += 7) {
      weeks.push(paddedDays.slice(i, i + 7));
    }

    return (
      <div>
        {renderHeader(`Month View - ${formattedMonthYear}`)}
        <div className="grid grid-cols-7 text-center font-medium border-b pb-2" style={{ borderColor: '#dddddd' }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-sm" style={{ color: '#005186' }}>{day}</div>
          ))}
        </div>
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-2 border" style={{ borderColor: '#dddddd' }}>
            {week.map((date, i) => (
              <div key={i} className="p-2 border h-24 text-center" style={{ borderColor: '#dddddd' }}>
                <div className="text-sm font-bold">{date ? date.getDate() : ''}</div>
                {date && sessions
                  .filter((s) => new Date(s.datetime).toDateString() === date.toDateString())
                  .map((s, i) => (
                    <div
                      key={i}
                      className="text-xs text-red-600 truncate cursor-pointer"
                      onClick={() => onEdit(s.id)}
                    >
                      {s.startTime} - {s.endTime}
                    </div>
                  ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (viewType === 'week') {
    const days = getWeekDays(currentDate);
    const hours = getHoursForDay();

    return (
      <div>
        {renderHeader(`Week View - ${formattedMonthYear}`)}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => (
            <div key={day} className="border border-[#ced4da]">
              <div className="bg-gray-100 text-center font-medium" style={{ color: '#005186' }}>
                {day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
              {hours.map((hour) => {
                const occupied = isSlotOccupied(day, hour);
                const session = getSessionForSlot(day, hour);
                return (
                  <div
                    key={hour}
                    className={`p-2 text-sm border-t border-[#ced4da] cursor-pointer ${
                      occupied ? 'bg-red-100 text-red-700' : 'hover:bg-green-100'
                    }`}
                    onClick={() =>
                      occupied ? onEdit(session.id) : onSlotClick(new Date(`${day.toDateString()} ${hour}`))
                    }
                  >
                    {occupied ? `${session.startTime} - ${session.endTime}` : hour}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (viewType === 'day') {
    const hours = getHoursForDay();
    const dayTitle = `Day View - ${currentDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })}`;

    return (
      <div>
        {renderHeader(dayTitle)}
        {hours.map((hour) => {
          const occupied = isSlotOccupied(currentDate, hour);
          const session = getSessionForSlot(currentDate, hour);
          return (
            <div
              key={hour}
              className={`p-2 border-b text-sm cursor-pointer ${
                occupied ? 'bg-red-100 text-red-700' : 'hover:bg-green-100'
              }`}
              onClick={() =>
                occupied
                  ? onEdit(session.id)
                  : onSlotClick(new Date(`${currentDate.toDateString()} ${hour}`))
              }
            >
              {occupied
                ? `${session.startTime} - ${session.endTime} | ${session.caseNumber}`
                : hour}
            </div>
          );
        })}
      </div>
    );
  }

  return <div>No valid viewType provided</div>;
}
