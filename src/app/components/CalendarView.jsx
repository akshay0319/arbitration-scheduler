'use client';
import React from 'react';
import {
  getMonthDays,
  getWeekDays,
  getHoursForDay,
} from '../utils/calendarUtils';

export default function CalendarView({
  viewType,
  selectedDate,
  sessions,
  onSlotClick,
  onEdit,
}) {
  const today = selectedDate || new Date();

  const isSlotBooked = (datetime) => {
    return sessions.some(
      (s) => new Date(s.datetime).getTime() === new Date(datetime).getTime()
    );
  };

  if (viewType === 'month') {
    const days = getMonthDays(today.getFullYear(), today.getMonth());
    return (
      <div>
        <h2 className="text-xl mb-2">Month View</h2>
        <div className="grid grid-cols-7 gap-2 border">
          {days.map((date) => (
            <div key={date} className="p-2 border h-24">
              <div className="text-sm font-bold">{date.getDate()}</div>
              {sessions
                .filter(
                  (s) =>
                    new Date(s.datetime).toDateString() === date.toDateString()
                )
                .map((s, i) => (
                  <div
                    key={i}
                    className="text-xs text-red-600 truncate cursor-pointer"
                    onClick={() => onEdit(s.id)}
                  >
                    {new Date(s.datetime).toLocaleTimeString()}
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (viewType === 'week') {
    const days = getWeekDays(today);
    const hours = getHoursForDay();
    return (
      <div>
        <h2 className="text-xl mb-2">Week View</h2>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => (
            <div key={day} className="border">
              <div className="bg-gray-100 text-center font-medium">
                {day.toDateString()}
              </div>
              {hours.map((hour) => {
                const slot = new Date(`${day.toDateString()} ${hour}`);
                const session = sessions.find(
                  (s) => new Date(s.datetime).getTime() === slot.getTime()
                );
                return (
                  <div
                    key={hour}
                    className={`p-2 text-sm border-t cursor-pointer ${
                      session
                        ? 'bg-red-100 text-red-700'
                        : 'hover:bg-green-100'
                    }`}
                    onClick={() =>
                      session ? onEdit(session.id) : onSlotClick(slot)
                    }
                  >
                    {session ? session.caseNumber : hour}
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
    return (
      <div>
        <h2 className="text-xl mb-2">Day View - {today.toDateString()}</h2>
        {hours.map((hour) => {
          const slot = new Date(`${today.toDateString()} ${hour}`);
          const session = sessions.find(
            (s) => new Date(s.datetime).getTime() === slot.getTime()
          );
          return (
            <div
              key={hour}
              className={`p-2 border-b text-sm cursor-pointer ${
                session
                  ? 'bg-red-100 text-red-700'
                  : 'hover:bg-green-100'
              }`}
              onClick={() =>
                session ? onEdit(session.id) : onSlotClick(slot)
              }
            >
              {session ? session.caseNumber : hour}
            </div>
          );
        })}
      </div>
    );
  }

  return <div>No valid viewType provided</div>;
}
