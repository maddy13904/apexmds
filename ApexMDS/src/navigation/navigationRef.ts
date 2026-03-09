import { createNavigationContainerRef } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

export function resetToAuthStack() {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [
        {
          name: "AuthStack", // 🔥 ROOT-LEVEL target
        },
      ],
    });
  }
}
