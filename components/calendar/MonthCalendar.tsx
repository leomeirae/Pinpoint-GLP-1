import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useShotsyColors } from '@/hooks/useShotsyColors';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasShot: boolean;
  hasWeight: boolean;
}

interface MonthCalendarProps {
  currentDate: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  events: Array<{ date: Date; type: 'shot' | 'weight' }>;
}

export const MonthCalendar: React.FC<MonthCalendarProps> = ({
  currentDate,
  selectedDate,
  onSelectDate,
  events,
}) => {
  const colors = useShotsyColors();

  // Gerar dias do calendário (incluindo dias do mês anterior/posterior)
  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Dias do mês anterior
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        hasShot: hasEventOnDate(date, 'shot'),
        hasWeight: hasEventOnDate(date, 'weight'),
      });
    }

    // Dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.getTime() === today.getTime(),
        hasShot: hasEventOnDate(date, 'shot'),
        hasWeight: hasEventOnDate(date, 'weight'),
      });
    }

    // Dias do próximo mês para completar o grid
    const remainingDays = 42 - days.length; // 6 semanas * 7 dias
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        hasShot: hasEventOnDate(date, 'shot'),
        hasWeight: hasEventOnDate(date, 'weight'),
      });
    }

    return days;
  };

  const hasEventOnDate = (date: Date, type: 'shot' | 'weight'): boolean => {
    return events.some((event) => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === date.getTime() && event.type === type;
    });
  };

  const calendarDays = generateCalendarDays();

  const isDateSelected = (date: Date): boolean => {
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);
    const current = new Date(date);
    current.setHours(0, 0, 0, 0);
    return selected.getTime() === current.getTime();
  };

  return (
    <View style={styles.container}>
      {/* Dias da semana - V0 Design */}
      <View style={styles.weekDaysRow}>
        {['DOM.', 'SEG.', 'TER.', 'QUA.', 'QUI.', 'SEX.', 'SÁB.'].map((day) => (
          <Text key={day} style={[styles.weekDay, { color: colors.textSecondary }]}>
            {day}
          </Text>
        ))}
      </View>

      {/* Grid de dias */}
      <View style={styles.daysGrid}>
        {calendarDays.map((day, index) => {
          const selected = isDateSelected(day.date);
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                day.isToday && { borderWidth: 2, borderColor: colors.primary },
                selected && { backgroundColor: colors.primary + '20' },
              ]}
              onPress={() => onSelectDate(day.date)}
            >
              <Text
                style={[
                  styles.dayNumber,
                  {
                    color: day.isCurrentMonth ? colors.text : colors.textSecondary,
                    opacity: day.isCurrentMonth ? 1 : 0.4,
                  },
                  day.isToday && { fontWeight: '700', color: colors.primary },
                ]}
              >
                {day.date.getDate()}
              </Text>

              {/* Marcadores de eventos */}
              <View style={styles.eventMarkers}>
                {day.hasShot && (
                  <View style={[styles.eventDot, { backgroundColor: colors.primary }]} />
                )}
                {day.hasWeight && (
                  <View style={[styles.eventDot, { backgroundColor: colors.textSecondary }]} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    width: '100%',
  },
  dayCell: {
    alignItems: 'center',
    aspectRatio: 1,
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 40,
    position: 'relative',
    width: `${100 / 7}%`,
  },
  dayNumber: {
    fontSize: 16,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  eventDot: {
    borderRadius: 2,
    height: 4,
    width: 4,
  },
  eventMarkers: {
    alignItems: 'center',
    bottom: 4,
    flexDirection: 'row',
    gap: 3,
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
  },
  weekDay: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
});
