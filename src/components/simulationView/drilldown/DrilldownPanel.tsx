import { useEffect, useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import MonthScreen from './MonthScreen';
import DayScreen from './DayScreen';
import HourScreen from './HourScreen';

type Screen = 'month' | 'day' | 'hour';

type MonthRow = {
  periodStart: string; // ISO date
  periodEnd: string;
  energyKwh: number;
  eventsCount: number;
  max15mPowerKw: number;
};

type DayRow = {
  periodStart: string;
  periodEnd: string;
  energyKwh: number;
  eventsCount: number;
  max15mPowerKw: number;
};

type Props = {
  simulationId: string;
  months: MonthRow[];
  dailyAggAll: DayRow[];
  chargepointCount: number;
};

export default function DrilldownPanel({
  simulationId,
  months,
  dailyAggAll,
  chargepointCount,
}: Props) {
  const [screen, setScreen] = useState<Screen>('month');
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // default month
  useEffect(() => {
    if (!selectedMonth && months.length)
      setSelectedMonth(months[0].periodStart);
  }, [months, selectedMonth]);

  // reset day when month changes
  useEffect(() => setSelectedDay(null), [selectedMonth]);

  // day list of chosen month
  const dailyRowsForMonth = useMemo(() => {
    if (!selectedMonth) return [];
    const monthDt = DateTime.fromISO(selectedMonth);
    return dailyAggAll.filter((d: any) =>
      DateTime.fromISO(d.periodStart).hasSame(monthDt, 'month'),
    );
  }, [dailyAggAll, selectedMonth]);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      {screen === 'month' && (
        <MonthScreen
          months={months}
          selectedMonth={selectedMonth}
          onSelectMonth={(iso) => {
            setSelectedMonth(iso);
            setScreen('day');
          }}
        />
      )}

      {screen === 'day' && selectedMonth && (
        <DayScreen
          monthIso={selectedMonth}
          dailyRowsForMonth={dailyRowsForMonth}
          selectedDay={selectedDay}
          onSelectDay={(iso: string) => {
            setSelectedDay(iso);
            setScreen('hour');
          }}
          onBack={() => setScreen('month')}
        />
      )}

      {screen === 'hour' && selectedDay && (
        <HourScreen
          simulationId={simulationId}
          dayIso={selectedDay}
          chargepointCount={chargepointCount}
          onBack={() => setScreen('day')}
        />
      )}
    </div>
  );
}
