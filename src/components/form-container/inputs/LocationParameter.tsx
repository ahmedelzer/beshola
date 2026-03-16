import { Entypo } from "@expo/vector-icons";
import React, { Suspense, useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { Platform, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { CollapsibleSection } from "../../../utils/component/Collapsible";
import { Text } from "react-native";
import LocationMap from "../../maps/LocationMap";
import { updateFavoriteLocation } from "../../../reducers/LocationReducer";
import { reverseGeocode } from "../../../utils/operation/getlocationInfo";
import PolygonMapEmbed from "../../maps/DrawSmoothPolygon";
// Lazy import only the correct component
export default function LocationParameter({ ...props }) {
  // const LocationMap = React.lazy(() =>
  //   Platform.OS === "web"
  //     ? import("../../maps/LocationMap.web")
  //     : import("../../maps/LocationMap")
  // );
  let { value, enable, title, className, control, fieldName, type } = props;
  const dispatch = useDispatch();

  const currentLocation = useSelector(
    (state) => state.location.currentLocation,
  );
  const fields = props.formSchemaParameters;
  const [clickAction, setClickAction] = useState("pin");
  const [newPolygon, setNewPolygon] = useState([]);
  const haveRadius = props.type === "areaMapLongitudePoint";
  const latitudeField = fields.find(
    (param) =>
      param.parameterType ===
      (haveRadius ? "areaMapLatitudePoint" : "mapLatitudePoint"),
  )?.parameterField;

  const longitudeField = fields.find(
    (param) =>
      param.parameterType ===
      (haveRadius ? "areaMapLongitudePoint" : "mapLongitudePoint"),
  )?.parameterField;
  const localization = useSelector((state) => state.localization.localization);

  const [location, setLocation] = useState(
    Object.keys(props.value).length > 0 || currentLocation || {},
  );
  const handleLocationChange = async (newLocation) => {
    const locationInfo = await reverseGeocode(
      newLocation[latitudeField],
      newLocation[longitudeField],
      fields,
    );
    setLocation({ ...newLocation, ...locationInfo });
    if (newLocation[latitudeField]) {
      dispatch(
        updateFavoriteLocation({
          lat: newLocation[latitudeField],
          long: newLocation[longitudeField],
        }),
      );
    }
  };
  useEffect(() => {
    const fetchLocationInfo = async () => {
      try {
        const lat = +location[latitudeField] || location.latitude;
        const lng = +location[longitudeField] || location.longitude;

        let locationInfo = null;

        // if (Platform.OS === "web") {
        locationInfo = await reverseGeocode(lat, lng, fields);
        // }
        handleLocationChange(
          {
            [latitudeField]: lat,
            [longitudeField]: lng,
          },
          locationInfo,
        );
      } catch (error) {
        console.error("Error fetching location info:", error);
      }
    };

    fetchLocationInfo();
  }, []); // 👈 Add dependencies here if lat/lng can change

  return (
    <View className="overflow-hidden">
      <CollapsibleSection
        title={localization.Hum_screens.home.selectLocation}
        icon={() => <Entypo name="location-pin" size={24} />}
        setheader={true}
      >
        {/* {Platform.OS == "web" ? (
          <LocationMapWeb
            location={location}
            onLocationChange={handleLocationChange}
            clickable={true}
            fields={props.formSchemaParameters}
            haveRadius={props.type === "areaMapLongitudePoint"}
          />
        ) : ( */}
        {/* <LocationMap
          location={location}
          onLocationChange={handleLocationChange}
          clickable={true}
          fields={props.formSchemaParameters}
          haveRadius={props.type === "areaMapLongitudePoint"}
        /> */}
        <PolygonMapEmbed
          location={location}
          onLocationChange={handleLocationChange}
          clickable={true}
          fields={props.formSchemaParameters}
          haveRadius={props.type === "areaMapLongitudePoint"}
          // subSchemas={props.subSchemas}
          // findServerContainer={findServerContainer}
          clickAction={clickAction}
          setNewPolygon={setNewPolygon}
        />
        {/* )} */}
        {/* <Suspense fallback={<Text>Loading Map...</Text>}>
          <LocationMap
            location={location}
            onLocationChange={handleLocationChange}
            clickable={true}
            fields={props.formSchemaParameters}
            haveRadius={props.type === "areaMapLongitudePoint"}
          />
        </Suspense> */}
      </CollapsibleSection>
      {props.formSchemaParameters
        .filter(
          (i) =>
            i.parameterType.startsWith("areaMap") ||
            i.parameterType.startsWith("map") ||
            location[i.parameterField],
        )
        .map((pram) => (
          <Controller
            key={pram.parameterField}
            control={control}
            rules={{ required: true }}
            name={pram.parameterField}
            render={({ field: { onChange, onBlur, value } }) => {
              useEffect(() => {
                if (location[pram.parameterField] !== undefined) {
                  onChange(`${location[pram.parameterField]}`);
                }
              }, [location[pram.parameterField]]);
              return null; // No need to render hidden InputField if just syncing values
            }}
          />
        ))}
    </View>
  );
}
