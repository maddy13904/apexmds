import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { DashboardScreen } from "../screens/DashboardScreen";
import { EBooksScreen } from "../screens/EBooksScreen";
import { PracticeScreen } from "../screens/PracticeScreen";
import { AITutorScreen } from "../screens/AITutorScreen";
import {AnalyticsScreen } from "../screens/AnalyticsScreen";

const Tab = createBottomTabNavigator();

export function BottomTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown:false }}>
      
      <Tab.Screen 
        name="Home" 
        component={DashboardScreen}
        options={{
          tabBarIcon: ({color,size}) => (
            <Ionicons name="home" color={color} size={size}/>
          )
        }}
      />

      <Tab.Screen 
        name="EBooks" 
        component={EBooksScreen}
        options={{
          tabBarIcon: ({color,size}) => (
            <Ionicons name="book" color={color} size={size}/>
          )
        }}
      />

      <Tab.Screen 
        name="Practice" 
        component={PracticeScreen}
        options={{
          tabBarIcon: ({color,size}) => (
            <Ionicons name="create" color={color} size={size}/>
          )
        }}
      />

      <Tab.Screen 
        name="AI Tutor" 
        component={AITutorScreen}
        options={{
          tabBarIcon: ({color,size}) => (
            <Ionicons name="chatbubble" color={color} size={size}/>
          )
        }}
      />

      <Tab.Screen 
        name="Performance" 
        component={AnalyticsScreen}
        options={{
          tabBarIcon: ({color,size}) => (
            <Ionicons name="stats-chart" color={color} size={size}/>
          )
        }}
      />

    </Tab.Navigator>
  );
}
