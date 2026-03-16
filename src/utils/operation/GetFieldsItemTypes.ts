import { getField } from "./getField";

export function GetFieldsItemTypes(schema) {
  const parameters = schema?.dashboardFormSchemaParameters ?? [];

  const fieldsType = {
    imageView: getField(parameters, "displayFile"),
    companyName: getField(parameters, "companyName"),
    companyLogo: getField(parameters, "companyLogo"),
    propertyType: getField(parameters, "propertyType"),
    attributes: getField(parameters, "attributes"),
    accountName: getField(parameters, "accountName"),
    price: getField(parameters, "price"),
    rate: getField(parameters, "rate"),
    verified: getField(parameters, "verified"),
    bathrooms: getField(parameters, "bathrooms"),
    orders: getField(parameters, "orders"),
    reviews: getField(parameters, "reviews"),
    isAvailable: getField(parameters, "isAvailable"),
    location: getField(parameters, "location"),
    discount: getField(parameters, "discount"),
    priceAfterDiscount: getField(parameters, "priceAfterDiscount"),
    rewardPoints: getField(parameters, "rewardPoints"),
    indexOfInteraction: getField(parameters, "indexOfInteraction"),
    assetSerialNumber: getField(parameters, "assetSerialNumber"),
    city: getField(parameters, "city"),
    address: getField(parameters, "address"),
    streetName: getField(parameters, "streetName"),
    idField: schema.idField,
    dataSourceName: schema.dataSourceName,
    parameters: parameters,
    cardAction: getField(parameters, "cardAction"),
    isFav: getField(parameters, "isFav"),
    zoneName: getField(parameters, "zoneName"),
    buildNumber: getField(parameters, "buildNumber"),
    floorNumber: getField(parameters, "floorNumber"),
    partitionNumber: getField(parameters, "partitionNumber"),
    flagMark: getField(parameters, "flagMark"),
    latitude: getField(parameters, "areaMapLatitudePoint"),
    longitude: getField(parameters, "areaMapLongitudePoint"),

    serviceName: getField(parameters, "serviceName"),
    serviceDescription: getField(parameters, "serviceDescription"),

    isActive: getField(parameters, "isActive"),
    createdOn: getField(parameters, "createdOn"),
  };
  return fieldsType;
}
