import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Line, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useColors } from '@/hooks/useShotsyColors';
import { calculateEstimatedLevels, MedicationApplication } from '@/lib/pharmacokinetics';

interface ForecastChartProps {
  dosage: number;
  date: Date;
  existingApplications?: MedicationApplication[];
}

export function ForecastChart({ dosage, date, existingApplications = [] }: ForecastChartProps) {
  const colors = useColors();
  const chartWidth = Dimensions.get('window').width - 96;
  const chartHeight = 180;

  // Calculate forecast data
  const { chartData, peakData, dateLabels, svgPath, svgAreaPath } = useMemo(() => {
    const allApplications: MedicationApplication[] = [
      ...existingApplications,
      { dose: dosage, date },
    ];

    // Calculate levels for the next 4 weeks (weekly intervals)
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 28); // 4 weeks ahead

    const levels = calculateEstimatedLevels(allApplications, date, endDate, 24 * 7); // Weekly intervals

    // Format for chart (first 5 data points) - convert to SVG coordinates
    const formattedData = levels.slice(0, 5).map((level, index) => {
      const chartDate = new Date(level.date);
      // Convert to SVG coordinates: x = index * 80 (spacing), y = inverted (200 - level * 66.67)
      const svgX = index * 80;
      const svgY = 200 - level.level * 66.67; // Scale: 0-3mg maps to 0-200px
      return {
        x: svgX,
        y: svgY,
        level: level.level,
        date: chartDate,
      };
    });

    // Create date labels for x-axis
    const labels = formattedData.map((item) => {
      const day = item.date.getDate();
      const month = item.date.toLocaleDateString('pt-BR', { month: 'short' });
      return `${day} de ${month}`;
    });

    // Find peak level
    const peak = formattedData.reduce(
      (max, item) => (item.level > max.level ? item : max),
      formattedData[0]
    );

    // Create SVG path for line
    const pathData = formattedData
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ');

    // Create SVG path for filled area
    const areaPath = `${pathData} L ${formattedData[formattedData.length - 1].x} 200 L 0 200 Z`;

    return {
      chartData: formattedData,
      peakData: peak,
      dateLabels: labels,
      svgPath: pathData,
      svgAreaPath: areaPath,
    };
  }, [dosage, date, existingApplications]);

  if (chartData.length === 0) {
    return null;
  }

  // Format peak date for display
  const peakDateLabel = peakData
    ? `${peakData.date.getDate()} de ${peakData.date.toLocaleDateString('pt-BR', { month: 'short' })}`
    : '';

  return (
    <View style={styles.container}>
      <Svg
        width={chartWidth}
        height={chartHeight}
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
      >
        <Defs>
          <LinearGradient id="forecastGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="5%" stopColor={colors.primary} stopOpacity="0.6" />
            <Stop offset="95%" stopColor={colors.primary} stopOpacity="0.1" />
          </LinearGradient>
        </Defs>

        {/* Grid lines - horizontal */}
        <Line x1="0" y1="66.67" x2="400" y2="66.67" stroke={colors.border} strokeWidth="1" strokeDasharray="3 3" />
        <Line x1="0" y1="133.33" x2="400" y2="133.33" stroke={colors.border} strokeWidth="1" strokeDasharray="3 3" />

        {/* Grid lines - vertical */}
        {chartData.map((point, index) => (
          <Line
            key={index}
            x1={point.x}
            y1="0"
            x2={point.x}
            y2="200"
            stroke={colors.border}
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        ))}

        {/* Filled area path */}
        <Path d={svgAreaPath} fill="url(#forecastGradient)" />

        {/* Solid line with dashed stroke */}
        <Path
          d={svgPath}
          fill="none"
          stroke={colors.primary}
          strokeWidth="2"
          strokeDasharray="5 5"
        />
      </Svg>

      {/* X-axis labels */}
      <View style={styles.xAxisLabels}>
        {dateLabels.map((label, index) => (
          <Text key={index} style={[styles.xAxisLabel, { color: colors.textMuted }]}>
            {label}
          </Text>
        ))}
      </View>

      {/* Date and Value Display - V0 Design */}
      {peakData && (
        <View style={styles.displayContainer}>
          <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>{peakDateLabel}</Text>
          <Text style={[styles.valueDisplay, { color: colors.text }]}>
            <Text style={styles.valueBold}>{Math.round(peakData.level * 10) / 10}</Text>
            <Text style={[styles.valueUnit, { color: colors.textSecondary }]}>
              {' '}
              {dosage}mg — <Text style={styles.valueEst}>(est) pico</Text>
            </Text>
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
  },
  xAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    marginTop: 4,
  },
  xAxisLabel: {
    fontSize: 10,
  },
  displayContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  dateLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  valueDisplay: {
    fontSize: 14,
  },
  valueBold: {
    fontWeight: '700',
  },
  valueUnit: {
    fontSize: 12,
  },
  valueEst: {
    fontSize: 12,
  },
});

