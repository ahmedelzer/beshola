import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
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

function CompanyInfo({ branches }) {
  const localization = useSelector((state) => state.localization.localization);
  const fieldsType = useSelector((s) => s.menuItem?.fieldsType);

  // Define masterBranch as the primary location for contact/hours
  const masterBranch = branches && branches.length > 0 ? branches[0] : null;

  // --- Logic Helpers ---
  const convertUTCToLocalTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":").map(Number);
    let totalMinutes = hours * 60 + minutes;
    const timezoneOffset = -new Date().getTimezoneOffset();
    totalMinutes = (totalMinutes + timezoneOffset + 1440) % 1440;
    const localHours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
    const localMinutes = String(totalMinutes % 60).padStart(2, "0");
    return `${localHours}:${localMinutes}`;
  };

  const getWorkStatus = (workHour) => {
    const today = new Date().getDay();
    const currentTime = new Date();
    const isToday = today === workHour.dayIndex;
    if (!isToday) return { isToday: false, label: "" };

    const localStartTime = convertUTCToLocalTime(workHour.startTime);
    const localEndTime = convertUTCToLocalTime(workHour.endTime);

    const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const [sH, sM] = localStartTime.split(":").map(Number);
    const [eH, eM] = localEndTime.split(":").map(Number);

    const startMinutes = sH * 60 + sM;
    const endMinutes = eH * 60 + eM;

    let statusLabel = localization.about.companyInfo.Closed;
    if (nowMinutes >= startMinutes && nowMinutes <= endMinutes) {
      statusLabel =
        endMinutes - nowMinutes <= 30
          ? localization.about.companyInfo.NearClosed
          : localization.about.companyInfo.OpenedNow;
    }
    return { isToday: true, label: statusLabel };
  };

  return (
    <View style={styles.outerWrapper}>
      {/* MAP SECTION - Centered by outerWrapper */}
      {branches && branches.length > 0 && (
        <View style={styles.mapCard}>
          <PolygonMapEmbed
            locations={branches.map((branch) => ({
              [fieldsType.latitude]: branch[fieldsType.latitude],
              [fieldsType.longitude]: branch[fieldsType.longitude],
            }))}
            fields={fieldsType.parameters}
            onLocationChange={() => {}}
            setNewPolygon={() => {}}
            canClickPolygon={false}
            showSuggestsCard={false}
          />
        </View>
      )}

      {/* INFO SECTIONS CONTAINER */}
      <View style={styles.infoContainer}>
        {/* ADDRESS */}
        {branches && branches.length > 0 && (
          <View style={styles.listItem}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="location-outline"
                size={26}
                color={theme.primary}
              />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.title}>
                {localization.about.companyInfo.ourAddress}
              </Text>
              {branches.map((branch, index) => (
                <Text key={index} style={styles.text}>
                  {branch.address}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* CONTACTS */}
        {masterBranch && masterBranch.companyBranchContacts?.length > 0 && (
          <View style={styles.listItem}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="card-account-details-outline"
                size={26}
                color={theme.primary}
              />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.title}>
                {localization.about.companyInfo.contactText}
              </Text>
              <View style={styles.contactIconsRow}>
                {masterBranch.companyBranchContacts.map((c) => (
                  <View
                    key={c.companyBranchContactID}
                    style={styles.contactCircle}
                  >
                    {GetIconContact(c.codeNumber, 20, c.contact)}
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* WORKING HOURS */}
        {masterBranch?.companyBranchWorkHours && (
          <View style={styles.listItem}>
            <View style={styles.iconContainer}>
              <FontAwesome5 name="clock" size={22} color={theme.primary} />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.title}>
                {localization.about.companyInfo.workingHours}
              </Text>
              <View style={styles.hoursList}>
                {masterBranch.companyBranchWorkHours.map((workHour) => {
                  const status = getWorkStatus(workHour);
                  return (
                    <View
                      key={workHour.companyBranchDayWorkHoursID}
                      style={[
                        styles.hourRow,
                        status.isToday && styles.todayHighlight,
                      ]}
                    >
                      <View style={styles.hourData}>
                        <Text style={styles.dayText}>{workHour.dayName}</Text>
                        <Text style={styles.timeText}>
                          {convertUTCToLocalTime(workHour.startTime)} -{" "}
                          {convertUTCToLocalTime(workHour.endTime)}
                        </Text>
                      </View>
                      {status.isToday && status.label !== "" && (
                        <Text style={styles.statusLabel}>{status.label}</Text>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    width: "100%",
    alignItems: "center", // Centers the Map and the Info Container
    paddingVertical: 10,
  },
  mapCard: {
    width: "94%", // Slightly less than full width for a "card" look
    height: 280,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
    backgroundColor: "#e1e1e1",
  },
  infoContainer: {
    width: "94%", // Matches Map width for alignment
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 22,
    width: "100%",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: theme.text,
    lineHeight: 20,
  },
  contactIconsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  contactCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginBottom: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  hoursList: {
    marginTop: 4,
  },
  hourRow: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  todayHighlight: {
    backgroundColor: theme.overlay || "#f0f0f0",
  },
  hourData: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayText: {
    fontSize: 13,
    color: "#555",
  },
  timeText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.primary,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: theme.accent,
    textAlign: "right",
  },
});

export default CompanyInfo;
