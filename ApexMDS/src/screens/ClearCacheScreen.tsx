import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CacheCategory {
  id: string;
  name: string;
  description: string;
  size: string;
  icon: keyof typeof Ionicons.glyphMap;
  selected: boolean;
}

export function ClearCacheScreen({ navigation }: any) {
  const [isClearing, setIsClearing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [totalSize, setTotalSize] = useState("487.3");

  const [cacheCategories, setCacheCategories] = useState<CacheCategory[]>([
    {
      id: "images",
      name: "Images Cache",
      description: "Downloaded images and thumbnails",
      size: "245.8",
      icon: "image-outline",
      selected: true
    },
    {
      id: "documents",
      name: "Documents Cache",
      description: "Cached e-books and PDFs",
      size: "156.2",
      icon: "document-text-outline",
      selected: true
    },
    {
      id: "videos",
      name: "Video Cache",
      description: "Buffered video content",
      size: "78.5",
      icon: "videocam-outline",
      selected: true
    },
    {
      id: "data",
      name: "App Data Cache",
      description: "Temporary app data",
      size: "6.8",
      icon: "server-outline",
      selected: true
    }
  ]);

  function toggleCategory(id: string) {
    setCacheCategories(categories =>
      categories.map(cat =>
        cat.id === id ? { ...cat, selected: !cat.selected } : cat
      )
    );
  }

  async function handleClearCache() {
    const selected = cacheCategories.filter(cat => cat.selected);
    if (selected.length === 0) {
      Alert.alert("Select at least one category");
      return;
    }

    setIsClearing(true);
    setIsComplete(false);

    await new Promise(resolve => setTimeout(resolve, 2500));

    const freed = selected.reduce((t, c) => t + parseFloat(c.size), 0);
    const newTotal = parseFloat(totalSize) - freed;
    setTotalSize(newTotal.toFixed(1));

    setCacheCategories(categories =>
      categories.map(cat =>
        cat.selected ? { ...cat, size: "0.0", selected: false } : cat
      )
    );

    setIsComplete(true);
    setIsClearing(false);
  }

  const selectedSize = cacheCategories
    .filter(cat => cat.selected)
    .reduce((t, c) => t + parseFloat(c.size), 0);

  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.bgCircleSky} />
        <View style={styles.bgCircleGreen} />
        <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Clear Cache</Text>
        </View>
        <Text style={styles.headerSub}>Free up storage space</Text>
      </View>

      <View style={styles.body}>

        {/* Total Size Card */}
        <View style={styles.totalCard}>
          <View>
            <Text style={styles.totalLabel}>Total Cache Size</Text>
            <Text style={styles.totalValue}>{totalSize} MB</Text>
          </View>
          <Ionicons name="server" size={36} color="#2563EB" />
        </View>

        {/* Success Message */}
        {isComplete && (
          <View style={styles.successCard}>
            <Ionicons name="checkmark-circle" size={22} color="#2563EB" />
            <Text style={styles.successText}>
              Cache cleared successfully!
            </Text>
          </View>
        )}

        {/* Categories */}
        <Text style={styles.sectionTitle}>SELECT CATEGORIES</Text>

        {cacheCategories.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryCard,
              cat.selected && { borderColor: "#2563EB" }
            ]}
            onPress={() => toggleCategory(cat.id)}
            disabled={parseFloat(cat.size) === 0}
          >
            <View style={[
              styles.checkbox,
              cat.selected && { backgroundColor: "#2563EB" }
            ]}>
              {cat.selected && (
                <Ionicons name="checkmark" size={14} color="white" />
              )}
            </View>

            <View style={styles.iconBox}>
              <Ionicons name={cat.icon} size={20} color="#2563EB" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.catTitle}>{cat.name}</Text>
              <Text style={styles.catDesc}>{cat.description}</Text>
              <Text style={styles.catSize}>{cat.size} MB</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Clear Button */}
        <TouchableOpacity
          style={[
            styles.clearButton,
            (isClearing || selectedSize === 0) && { backgroundColor: "#CBD5E1" }
          ]}
          disabled={isClearing || selectedSize === 0}
          onPress={handleClearCache}
        >
          {isClearing ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="trash-outline" size={18} color="white" />
              <Text style={styles.clearText}>
                Clear Selected Cache ({selectedSize.toFixed(1)} MB)
              </Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Clearing cache will not delete your study progress or account data.
        </Text>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },

   header: {
    backgroundColor: "#1E40AF",
    paddingTop: 25,
    paddingBottom: 35,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: "hidden"
  },

    bgCircleSky: {
    position: "absolute",
    width: 200,
    height: 200,
    backgroundColor: "#38BDF8",
    opacity: 0.2,
    borderRadius: 100,
    top: -60,
    left: -60
  },

  bgCircleGreen: {
    position: "absolute",
    width: 160,
    height: 160,
    backgroundColor: "#34D399",
    opacity: 0.2,
    borderRadius: 80,
    bottom: -40,
    right: -40
  },
     headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20
  },


  backButton: {
    padding: 6,
    borderRadius: 20
  },

  headerTitle: { color: "white", fontSize: 20, fontWeight: "bold", marginBottom: 4 },
  headerSub: { color: "#DBEAFE", fontSize: 13, marginTop: 4 },

  body: { padding: 20 },

  totalCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 14,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15
  },
  totalLabel: { fontSize: 12, color: "#1E40AF" },
  totalValue: { fontSize: 20, fontWeight: "bold", color: "#1E40AF" },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#64748B",
    marginBottom: 10
  },

  categoryCard: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 10
  },

  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10
  },

  iconBox: {
    backgroundColor: "#F1F5F9",
    padding: 6,
    borderRadius: 8,
    marginRight: 10
  },

  catTitle: { fontSize: 13, fontWeight: "bold", color: "#1E293B" },
  catDesc: { fontSize: 11, color: "#64748B" },
  catSize: { fontSize: 11, fontWeight: "bold", marginTop: 2 },

  clearButton: {
    backgroundColor: "#2563EB",
    borderRadius: 14,
    padding: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 10
  },
  clearText: { color: "white", fontWeight: "bold", fontSize: 14 },

  successCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  },
  successText: { color: "#1E40AF", marginLeft: 8, fontSize: 12 },

  footerText: {
    textAlign: "center",
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 15
  }
});
