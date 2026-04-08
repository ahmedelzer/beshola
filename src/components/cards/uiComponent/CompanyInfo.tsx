import React, { useContext } from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native";
// import { GetIconContact } from "./GetIconContact"; // Ensure this returns a RN component
// import BranchesByLocationMap from "./BranchesByLocationMap"; // Ensure this is a RN MapView
import {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";
import { GetIconContact } from "../../../utils/component/GetIconContact";
import { useSelector } from "react-redux";
import { theme } from "../../../Theme";
import PolygonMapEmbed from "../../maps/DrawSmoothPolygon";

const { width } = Dimensions.get("window");

function CompanyInfo({ branches, masterBranch }) {
  const localization = useSelector((state) => state.localization.localization); // Assuming you have a LocalizationContext
  const fieldsType = useSelector((s) => s.menuItem?.fieldsType);

  // --- Logic Helpers (Kept from your original code) ---
  const convertUTCToLocalTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    let totalMinutes = hours * 60 + minutes;
    const timezoneOffset = -new Date().getTimezoneOffset();
    totalMinutes = (totalMinutes + timezoneOffset + 1440) % 1440;
    const localHours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
    const localMinutes = String(totalMinutes % 60).padStart(2, "0");
    return `${localHours}:${localMinutes}`;
  };

  const getMinutesFromTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const getWorkStatus = (workHour: any) => {
    const today = new Date().getDay();
    const currentTime = new Date();
    const isToday = today === workHour.dayIndex;
    if (!isToday) return { isToday: false, label: "" };

    const localStartTime = convertUTCToLocalTime(workHour.startTime);
    const localEndTime = convertUTCToLocalTime(workHour.endTime);

    const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const startMinutes = getMinutesFromTime(localStartTime);
    const endMinutes = getMinutesFromTime(localEndTime);

    let statusLabel = localization.about.companyInfo.Closed;
    const SOON_THRESHOLD = 30;

    if (nowMinutes >= startMinutes && nowMinutes <= endMinutes) {
      statusLabel =
        endMinutes - nowMinutes <= SOON_THRESHOLD
          ? localization.about.companyInfo.NearClosed
          : localization.about.companyInfo.OpenedNow;
    } else if (
      nowMinutes < startMinutes &&
      startMinutes - nowMinutes <= SOON_THRESHOLD
    ) {
      statusLabel = "";
    }

    return { isToday: true, label: statusLabel };
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ width: "100%" }}
    >
      {/* MAP SECTION */}
      {branches.length > 0 && (
        <View className="w-full mb-4" style={{ height: 400 }}>
          {/* <BranchesByLocationMap branches={branches} /> */}
          <PolygonMapEmbed
            locations={branches.map((branch) => {
              return {
                [fieldsType.latitude]: branch[fieldsType.latitude],
                [fieldsType.longitude]: branch[fieldsType.longitude],
              };
            })}
            fields={fieldsType.parameters}
            onLocationChange={() => {}}
            setNewPolygon={() => {}}
            canClickPolygon={false}
            showSuggestsCard={false}
          />
        </View>
      )}
    </ScrollView>
  );
}
// <View style={styles.contentWrapper}>
//   <View style={styles.listItem}>
//     <View style={styles.iconContainer}>
//       <Ionicons name="location-outline" size={30} color={theme.primary} />
//     </View>
//     <View style={styles.itemContent}>
//       <Text style={styles.title}>
//         {localization.about.companyInfo.ourAddress}
//       </Text>
//       {branches.map((branch) => (
//         <Text key={branch.addressLocationID} style={styles.text}>
//           {branch.address}
//         </Text>
//       ))}
//     </View>
//   </View>

//   {masterBranch && masterBranch.companyBranchContacts.length > 0 && (
//     <View style={styles.listItem}>
//       <View style={styles.iconContainer}>
//         <MaterialCommunityIcons
//           name="card-account-details-outline"
//           size={30}
//           color={theme.primary}
//         />
//       </View>
//       <View style={styles.itemContent}>
//         <Text style={styles.title}>
//           {localization.about.companyInfo.contactText}
//         </Text>
//         <View style={styles.contactIconsRow}>
//           {masterBranch.companyBranchContacts?.map((c) => (
//             <View
//               key={c.companyBranchContactID}
//               style={styles.contactCircle}
//             >
//               {GetIconContact(c.codeNumber, 22, c.contact)}
//             </View>
//           ))}
//         </View>
//       </View>
//     </View>
//   )}

//   {/* WORKING HOURS SECTION */}
//   {masterBranch && Array.isArray(masterBranch.companyBranchWorkHours) && (
//     <View style={styles.listItem}>
//       <View style={styles.iconContainer}>
//         <FontAwesome5 name="clock" size={25} color={theme.primary} />
//       </View>
//       <View style={styles.itemContent}>
//         <Text style={styles.title}>
//           {localization.about.companyInfo.workingHours}
//         </Text>
//         <View style={styles.hoursList}>
//           {masterBranch.companyBranchWorkHours.map((workHour) => {
//             const status = getWorkStatus(workHour);
//             return (
//               <View
//                 key={workHour.companyBranchDayWorkHoursID}
//                 style={[
//                   styles.hourRow,
//                   status.isToday && styles.todayHighlight,
//                 ]}
//               >
//                 <View style={styles.hourData}>
//                   <Text style={styles.dayText}>{workHour.dayName}</Text>
//                   <Text style={styles.timeText}>
//                     {convertUTCToLocalTime(workHour.startTime)} -{" "}
//                     {convertUTCToLocalTime(workHour.endTime)}
//                   </Text>
//                 </View>
//                 {status.isToday && status.label !== "" && (
//                   <Text style={styles.statusLabel}>({status.label})</Text>
//                 )}
//               </View>
//             );
//           })}
//         </View>
//       </View>
//     </View>
//   )}
// </View>
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.body,
    width: "100%",
  },
  contentWrapper: {
    padding: 16,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 24,
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.body,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  itemContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: theme.text,
    marginBottom: 4,
  },
  contactIconsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
  },
  contactCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.body,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  hoursList: {
    marginTop: 8,
  },
  hourRow: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 4,
  },
  todayHighlight: {
    backgroundColor: theme.overlay,
  },
  hourData: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayText: {
    fontSize: 14,
    color: theme.text,
    fontWeight: "500",
  },
  timeText: {
    fontSize: 14,
    color: theme.primary,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    color: theme.accent, // Replace with your primary color
    marginTop: 2,
  },
  mapCard: {
    width: width - 32,
    height: 300,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 40,
    backgroundColor: theme.body,
  },
});

export default CompanyInfo;
