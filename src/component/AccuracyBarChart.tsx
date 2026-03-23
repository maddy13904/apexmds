import React from "react";
import { View, StyleSheet, Text } from "react-native";

type Props = {
  data: number[];
};

const CHART_HEIGHT = 160;

export function AccuracyBarChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyBox}>
        <Text style={styles.emptyText}>No accuracy data yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.chartArea}>
        {data.map((value, index) => {
          const barHeight = (value / 100) * CHART_HEIGHT;

          return (
            <View key={index} style={styles.barWrapper}>
              <View
                style={[
                  styles.bar,
                  {
                    height: barHeight,
                    backgroundColor:
                      value >= 75
                        ? "#22C55E"
                        : value >= 50
                        ? "#FACC15"
                        : "#EF4444"
                  }
                ]}
              />
              <Text style={styles.valueText}>{value}%</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 30
  },

  chartArea: {
    height: CHART_HEIGHT,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 14
  },

  barWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end"
  },

  bar: {
    width: "100%",
    borderRadius: 6
  },

  valueText: {
    marginTop: 6,
    fontSize: 11,
    color: "#475569"
  },

  emptyBox: {
    height: 120,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30
  },

  emptyText: {
    fontSize: 13,
    color: "#64748B"
  }
});
