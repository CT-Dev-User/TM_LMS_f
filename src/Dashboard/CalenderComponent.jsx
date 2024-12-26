import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react'
import { createViewWeek, createViewMonthGrid } from "@schedule-x/calendar"
import "@schedule-x/theme-default/dist/calendar.css"
import "./dashboard.styles.css"
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { createEventModalPlugin } from '@schedule-x/event-modal'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'

const CalenderComponent = () => {
  const calendar = useCalendarApp({
    views: [createViewWeek(), createViewMonthGrid()],
    events: [{
      id: 1,
      title: "React Lecture",
      start: "2025-01-01 00:00",
      end: "2025-01-01 02:00",
      description: "Learn React",
      location: "Online",
    }],
    selectedDate: "2025-01-01",
    plugins: [createEventModalPlugin(), createDragAndDropPlugin()],
  });

  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar}/>
    </div>
  )
}

export default CalenderComponent











