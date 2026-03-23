import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function AddStudySessionScreen({ navigation, route }: any) {
  const { onSave } = route.params || {};

  const [selectedSubject, setSelectedSubject] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:30");
  const [selectedDays, setSelectedDays] = useState<string[]>(["Mon","Tue","Wed","Thu","Fri"]);
  const [isEnabled, setIsEnabled] = useState(true);
  const [showSubjects, setShowSubjects] = useState(false);

  const subjects = [
    "Oral Pathology","Periodontology","Orthodontics","Prosthodontics",
    "Oral Medicine","Conservative Dentistry","Oral Surgery",
    "Pedodontics","Practice Questions","Mock Tests","Revision"
  ];

  const weekDays = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  function toggleDay(day: string) {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  }

  function calculateDuration() {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diff = (end.getTime() - start.getTime()) / 60000;
    return diff > 0 ? diff : 0;
  }

  const duration = calculateDuration();

  function handleSave() {
    if (!selectedSubject) {
      Alert.alert("Error","Please select a subject");
      return;
    }
    if (selectedDays.length === 0) {
      Alert.alert("Error","Select at least one day");
      return;
    }
    if (duration <= 0) {
      Alert.alert("Error","End time must be after start time");
      return;
    }

    if (onSave) {
      onSave({
        subject: selectedSubject,
        startTime,
        endTime,
        days: selectedDays,
        enabled: isEnabled
      });
    }

    navigation.goBack();
  }

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
        <Text style={styles.headerTitle}>Add Study Session</Text>
        </View>
        <Text style={styles.headerSub}>Create a new study schedule</Text>
      </View>

      <View style={styles.body}>

        {/* Subject Picker */}
        <View style={styles.card}>
          <Text style={styles.label}>Subject *</Text>

          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowSubjects(!showSubjects)}
          >
            <Text style={selectedSubject ? styles.text : styles.placeholder}>
              {selectedSubject || "Select Subject"}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#64748B" />
          </TouchableOpacity>

          {showSubjects && (
            <View style={styles.dropdownList}>
              {subjects.map(sub => (
                <TouchableOpacity
                  key={sub}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedSubject(sub);
                    setShowSubjects(false);
                  }}
                >
                  <Text style={styles.text}>{sub}</Text>
                  {selectedSubject === sub && (
                    <Ionicons name="checkmark-circle" size={18} color="#2563EB" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Time Pickers (simple text inputs for now) */}
        <View style={styles.card}>
          <Text style={styles.label}>Study Time *</Text>

          <View style={styles.timeRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.smallLabel}>Start</Text>
              <TextInput
                value={startTime}
                onChangeText={setStartTime}
                style={styles.input}
                placeholder="09:00"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.smallLabel}>End</Text>
              <TextInput
                value={endTime}
                onChangeText={setEndTime}
                style={styles.input}
                placeholder="10:30"
              />
            </View>
          </View>

          {duration > 0 && (
            <Text style={styles.duration}>
              Duration: {Math.floor(duration/60)}h {duration%60}m
            </Text>
          )}
        </View>

        {/* Days */}
        <View style={styles.card}>
          <Text style={styles.label}>Repeat On *</Text>

          <View style={styles.daysRow}>
            {weekDays.map(day => {
              const active = selectedDays.includes(day);
              return (
                <TouchableOpacity
                  key={day}
                  style={[styles.dayBox, active && styles.dayActive]}
                  onPress={() => toggleDay(day)}
                >
                  <Text style={[styles.dayText, active && { color: "white" }]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Enable Toggle */}
        <View style={styles.cardRow}>
          <View>
            <Text style={styles.label}>Enable Session</Text>
            <Text style={styles.smallLabel}>Start reminders immediately</Text>
          </View>
          <TouchableOpacity
            style={[styles.switch, isEnabled && styles.switchOn]}
            onPress={() => setIsEnabled(!isEnabled)}
          >
            <View style={[styles.knob, isEnabled && { marginLeft: 22 }]} />
          </TouchableOpacity>
        </View>

        {/* Save Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>Save Session</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:"#F8FAFC" },

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
  headerTitle:{ color:"white", fontSize:20, fontWeight:"bold", marginBottom:4 },
  headerSub:{ color:"#BFDBFE", fontSize:13, marginTop:4 },

  body:{ padding:20 },

  card:{
    backgroundColor:"white",
    borderRadius:14,
    padding:15,
    marginBottom:15,
    borderWidth:1,
    borderColor:"#E2E8F0"
  },

  cardRow:{
    backgroundColor:"white",
    borderRadius:14,
    padding:15,
    marginBottom:15,
    borderWidth:1,
    borderColor:"#E2E8F0",
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center"
  },

  label:{ fontSize:14, fontWeight:"600", color:"#1E293B", marginBottom:8 },
  smallLabel:{ fontSize:12, color:"#64748B" },

  dropdown:{
    borderWidth:1,
    borderColor:"#E2E8F0",
    borderRadius:10,
    padding:12,
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center"
  },
  placeholder:{ color:"#94A3B8" },
  text:{ color:"#1E293B" },

  dropdownList:{
    marginTop:8,
    borderWidth:1,
    borderColor:"#E2E8F0",
    borderRadius:10,
    overflow:"hidden"
  },
  dropdownItem:{
    padding:12,
    flexDirection:"row",
    justifyContent:"space-between",
    borderBottomWidth:1,
    borderBottomColor:"#F1F5F9"
  },

  timeRow:{ flexDirection:"row", gap:10 },
  input:{
    borderWidth:1,
    borderColor:"#E2E8F0",
    borderRadius:10,
    padding:10,
    marginTop:4
  },
  duration:{ marginTop:8, fontSize:12, color:"#2563EB", fontWeight:"600" },

  daysRow:{ flexDirection:"row", flexWrap:"wrap", marginTop:5 },
  dayBox:{
    borderWidth:1,
    borderColor:"#CBD5E1",
    borderRadius:8,
    paddingHorizontal:8,
    paddingVertical:6,
    marginRight:6,
    marginBottom:6
  },
  dayActive:{ backgroundColor:"#2563EB", borderColor:"#2563EB" },
  dayText:{ fontSize:12, color:"#64748B" },

  switch:{
    width:50,
    height:26,
    borderRadius:20,
    backgroundColor:"#CBD5E1",
    padding:3
  },
  switchOn:{ backgroundColor:"#2563EB" },
  knob:{
    width:20,
    height:20,
    backgroundColor:"white",
    borderRadius:10
  },

  buttonRow:{ flexDirection:"row", gap:10 },
  cancelBtn:{
    flex:1,
    padding:14,
    borderRadius:12,
    borderWidth:1,
    borderColor:"#CBD5E1",
    alignItems:"center"
  },
  cancelText:{ color:"#1E293B", fontWeight:"600" },

  saveBtn:{
    flex:1,
    padding:14,
    borderRadius:12,
    backgroundColor:"#2563EB",
    alignItems:"center"
  },
  saveText:{ color:"white", fontWeight:"600" }
});
