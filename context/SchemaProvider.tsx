import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import pageSchemas from "./i.json";
import { pageSchema } from "../src/utils/operation/pageSchema";
import CartInfoSchemaAction from "../src/Schemas/MenuSchema/CartInfoSchemaAction.json";
import useFetch, {
  fetchData,
} from "../components/hooks/APIsFunctions/useFetch";
import { baseURL, defaultCentralizationProxyRoute } from "../request";
import LoadingScreen from "../src/kitchensink-components/loading/LoadingScreen";
import { Text, View } from "react-native";
import { styles } from "../src/components/splash/styles";
import GetFormSchema from "../components/hooks/DashboardAPIs/GetFormSchema";
import { mapItemsWithActions } from "../src/utils/operation/mapItemsWithActions";
import { updateSchemas } from "../src/reducers/SchemasReducer";
import { Image } from "expo-image";
import { store, version } from "../src/store/reduxStore";
import { localizeSchema } from "../src/utils/operation/localizeSchema";
import { LocalizationContext } from "./LocalizationContext";
// Create context
export const SchemaContext = createContext(null);

// Context provider component
export const SchemaProvider = ({ children }) => {
  // 1. Import app schemas from Redux store
  const schemasVersion = `schemas/${version}`;
  const schemas = useSelector((state) => state[schemasVersion]);
  //translate
  const localization = useSelector((state) => state.localization.localization);

  const translations = localization.localizationMap;
  // Store both language translation maps (never overwritten)
  const allTranslationsRef = useRef({});

  const dispatch = useDispatch();
  const { isFinishing, isEndFinishing, setIsEndFinishing } =
    useContext(LocalizationContext);
  useEffect(() => {
    if (!translations || Object.keys(translations).length === 0) return;
    if (!schemas) return;

    const currentLang = localization?.currentLanguage;

    // Save the current translation map if not saved before
    if (!allTranslationsRef.current[currentLang]) {
      allTranslationsRef.current[currentLang] = translations;
    }

    // Determine the "previous" language map
    const otherLang = currentLang;
    const otherTranslations = allTranslationsRef.current[otherLang];
    // Build reverse map from the other language if available
    const reverseTranslations = otherTranslations
      ? Object.fromEntries(
          Object.entries(otherTranslations).map(([key, val]) => [val, key]),
        )
      : Object.fromEntries(
          Object.entries(translations).map(([key, val]) => [val, key]),
        );

    console.log("🌐 currentLang:", currentLang);
    console.log(
      "🗺️ reverseTranslations sample:",
      Object.entries(reverseTranslations).slice(0, 5),
    );

    const localizedSchemas = {};
    Object.keys(schemas).forEach((key) => {
      const item = schemas[key];
      if (item?.schema) {
        localizedSchemas[key] = {
          ...item,
          schema: localizeSchema(
            item.schema,
            translations,
            reverseTranslations,
          ),
        };
      } else {
        localizedSchemas[key] = item || {};
      }
    });

    // Update Redux and local states
    Object.keys(localizedSchemas).forEach((key) => {
      dispatch(updateSchemas({ key, item: localizedSchemas[key] }));
    });
    // Update all your states (unchanged)
    setCartInfoState(localizedSchemas.cartInfo);
    setCartSchemaState(localizedSchemas.cart);
    setFastWayState(localizedSchemas.fastWay);
    setFilterState(localizedSchemas.filter);
    setMenuCategoriesState(localizedSchemas.menuCategories);
    setMenuItemsState(localizedSchemas.menuItems);
    setRecommendedState(localizedSchemas.recommended);
    setPaymentMethodsState(localizedSchemas.paymentMethods);
    setPaymentOptionsState(localizedSchemas.OtherPaymentOptions);
    setScratchVoucherCardState(localizedSchemas.scratchVoucherCard);
    setSuggestCardState(localizedSchemas.suggestCard);
    setSearchBarState(localizedSchemas.searchBar);
    setLoginFormState(localizedSchemas.loginForm);
    setResendState(localizedSchemas.resend);
    setSignupState(localizedSchemas.signup);
    setLoginVerifyState(localizedSchemas.loginVerify);
    setContactState(localizedSchemas.contact);
    setForgetState(localizedSchemas.forget);
    setForgetVerifyState(localizedSchemas.forgetVerify);
    setAddressLocationState(localizedSchemas.addressLocation);
    setNearestBranchesState(localizedSchemas.nearestBranches);
    setCollapseState(localizedSchemas.collapse);
    setOrderState(localizedSchemas.order);
    setCreditsState(localizedSchemas.credits);
    setCustomerSaleInvoicesState(localizedSchemas.customerSaleInvoices);
    setShopSaleInvoiceItemState(localizedSchemas.shopSaleInvoiceItem);
    setTabsState(localizedSchemas.tabs);
    setLanguageState(localizedSchemas.language);
    setLocalizationState(localizedSchemas.localization);
    setSecurityState(localizedSchemas.security);
    setRateState(localizedSchemas.rate);
    setReviewState(localizedSchemas.review);
    setPurchasesState(localizedSchemas.purchases);
  }, [translations, localization]);
  const hasFished = useRef(false);

  const [pageSchemaState, setPageSchemaState] = useState({});
  const [cartInfoState, setCartInfoState] = useState(schemas.cartInfo);
  const [cartSchemaState, setCartSchemaState] = useState(schemas.cart);
  const [fastWayState, setFastWayState] = useState(schemas.fastWay);
  const [filterState, setFilterState] = useState(schemas.filter);
  const [menuCategoriesState, setMenuCategoriesState] = useState(
    schemas.menuCategories,
  );
  const [menuItemsState, setMenuItemsState] = useState(schemas.menuItems);
  const [recommendedState, setRecommendedState] = useState(schemas.recommended);
  const [paymentMethodsState, setPaymentMethodsState] = useState(
    schemas.paymentMethods,
  );
  const [paymentOptionsState, setPaymentOptionsState] = useState(
    schemas.OtherPaymentOptions,
  );
  const [scratchVoucherCardState, setScratchVoucherCardState] = useState(
    schemas.scratchVoucherCard,
  );
  const [suggestCardState, setSuggestCardState] = useState(schemas.suggestCard);
  const [searchBarState, setSearchBarState] = useState(schemas.searchBar);

  const [loginFormState, setLoginFormState] = useState(schemas.loginForm);
  const [resendState, setResendState] = useState(schemas.resend);
  const [signupState, setSignupState] = useState(schemas.signup);
  const [loginVerifyState, setLoginVerifyState] = useState(schemas.loginVerify);

  const [contactState, setContactState] = useState(schemas.contact);
  const [forgetState, setForgetState] = useState(schemas.forget);
  const [forgetVerifyState, setForgetVerifyState] = useState(
    schemas.forgetVerify,
  );

  const [addressLocationState, setAddressLocationState] = useState(
    schemas.addressLocation,
  );
  const [nearestBranchesState, setNearestBranchesState] = useState(
    schemas.nearestBranches,
  );

  const [collapseState, setCollapseState] = useState(schemas.collapse);
  const [orderState, setOrderState] = useState(schemas.order);
  const [purchasesState, setPurchasesState] = useState(schemas.purchases);
  const [favState, setFavState] = useState(schemas.fav);
  const [creditsState, setCreditsState] = useState(schemas.credits);
  const [rateState, setRateState] = useState(schemas.rate);
  const [reviewsState, setReviewState] = useState(schemas.review);
  const [customerSaleInvoicesState, setCustomerSaleInvoicesState] = useState(
    schemas.customerSaleInvoices,
  );
  const [shopSaleInvoiceItemState, setShopSaleInvoiceItemState] = useState(
    schemas.shopSaleInvoiceItem,
  );
  const [tabsState, setTabsState] = useState(schemas.tabs);
  const [securityState, setSecurityState] = useState(schemas.security);
  const [checkoutState, setCheckoutState] = useState(schemas.checkout);

  const [languageState, setLanguageState] = useState(schemas.language);
  const [localizationState, setLocalizationState] = useState(
    schemas.localization,
  );

  // const menuItemsPages = [
  //   {s
  //     routePath: "cart",
  //     schemas: [
  //       {
  //         schemaType: "OtherPaymentOptions",
  //         schemaSetter: setPaymentOptionsState,
  //       },
  //     ],
  //   },
  // ];
  // const { data, error } = useFetch(
  //   "/User/GetAppUserDashboardMenuItems",
  //   "BrandingMartSecurity"
  // );
  // const { data: cartSchemas, isLoading } = useFetch(
  //   GetFormSchema("90D1B526-1C21-4297-A7C5-7696936A9020"),
  //   "Centralization"
  // );
  // const setSchemas = async () => {
  //   await mapItemsWithActions(cartSchemas, "schemaType", [
  //     {
  //       case: "OtherPaymentOptions",
  //       action: (item) => {
  //         // console.log(item, "item from provider");
  //         dispatch(updateSchemas({ key: "OtherPaymentOptions", item: item }));
  //         setPaymentOptionsState(item);
  //       },
  //     },
  //     {
  //       case: "InvoiceSummary",
  //       action: (item) => {
  //         dispatch(updateSchemas({ key: "cartInfo", item: item }));
  //         setCartInfoState(item);
  //       },
  //     },
  //     {
  //       case: "CartItem",
  //       action: (item) => {
  //         dispatch(updateSchemas({ key: "cart", item: item }));
  //         setCartSchemaState(item);
  //       },
  //     },
  //     {
  //       case: "Fastway",
  //       action: (item) => {
  //         dispatch(updateSchemas({ key: "fastWay", item: item }));
  //         setFastWayState(item);
  //       },
  //     },
  //   ]);
  // };
  // const fetchSchemasForMenuItems = async (menuItems) => {
  //   const schemasWithActions = await Promise.all(
  //     menuItems.map(async (item) => {
  //       // 1️⃣ Get schemas for this menu item
  //       const { data: schemaRes } = await fetchData(
  //         `/Dashboard/GetDashboardForm?DashboardMenuItemID=${item.dashboardItemID}`,
  //         defaultCentralizationProxyRoute
  //       );

  //       if (!schemaRes) return { ...item, schemas: [] };

  //       // 2️⃣ For each schema, get its actions
  //       const schemas = await Promise.all(
  //         schemaRes.map(async (schema) => {
  //           const { data: actions } = await fetchData(
  //             `/Dashboard/GetDashboardSchemaActionsBySchemaID?DashboardSchemaID=${schema.dashboardFormSchemaID}`,
  //             defaultCentralizationProxyRoute
  //           );

  //           return { ...schema, actions: actions ?? [] };
  //         })
  //       );

  //       return { ...item, schemas };
  //     })
  //   );

  //   return schemasWithActions;
  // };

  // useEffect(() => {
  //   const mergedMenuItems =
  //     data?.dataSource?.flatMap((category) => category.dashboardMenuItems) ??
  //     [];
  //   console.log("mergedMenuItems.length:", mergedMenuItems);
  //   if (mergedMenuItems.length) {
  //     fetchSchemasForMenuItems(mergedMenuItems).then((itemsWithSchemas) => {
  //       menuItemsPages.map((page) => {
  //         const selectedPage = itemsWithSchemas.find(
  //           (item) => item.routePath === page.routePath
  //         );
  //         page.schemas.map((schema) => {
  //           const selectedSchema = selectedPage.schemas.find(
  //             (updateSchema) => updateSchema.schemaType === schema.schemaType
  //           );
  //           const { actions, ...initSchema } = selectedSchema;
  //           // schema.schemaSetter({
  //           //   schema: initSchema,
  //           //   actions: actions,
  //           // });
  //         });
  //       });
  //       console.log("📌 MenuItems with schemas + actions:", itemsWithSchemas);
  //       setIsFinishing(true);
  //     });
  //   }
  //   isFinishing.current = true;
  // }, [schemasRefresh, data]);
  // useEffect(() => {
  //   //cart schemas
  //   pageSchema(setPageSchemaState, pageSchemas, "OtherPaymentOptions");
  //   // call schema actions
  //   setCartInfoState({
  //     schema: pageSchemaState,
  //     actions: CartInfoSchemaAction,
  //   });
  //   //console.log("CartInfoState", cartInfoState); // call actions
  // }, []);
  // useEffect(() => {
  //   if (
  //     cartSchemas &&
  //     !isLoading &&
  //     cartSchemas.length > 0 &&
  //     !hasFished.current
  //   ) {
  //     hasFished.current = true;

  //     // setSchemas();
  //   }
  // }, [cartSchemas, isLoading]);

  // 3. Provide all states and setters via context
  return (
    <SchemaContext.Provider
      value={{
        cartInfoState,
        setCartInfoState,
        cartSchemaState,
        setCartSchemaState,
        fastWayState,
        setFastWayState,
        filterState,
        setFilterState,
        menuCategoriesState,
        setMenuCategoriesState,
        menuItemsState,
        setMenuItemsState,
        paymentMethodsState,
        setPaymentMethodsState,
        paymentOptionsState,
        setPaymentOptionsState,
        scratchVoucherCardState,
        setScratchVoucherCardState,
        suggestCardState,
        setSuggestCardState,
        searchBarState,
        setSearchBarState,
        loginFormState,
        setLoginFormState,
        resendState,
        setResendState,
        signupState,
        setSignupState,
        loginVerifyState,
        setLoginVerifyState,
        contactState,
        setContactState,
        forgetState,
        setForgetState,
        forgetVerifyState,
        reviewsState,
        setReviewState,
        rateState,
        setRateState,
        setForgetVerifyState,
        addressLocationState,
        setAddressLocationState,
        nearestBranchesState,
        setNearestBranchesState,
        collapseState,
        setCollapseState,
        creditsState,
        setCreditsState,
        customerSaleInvoicesState,
        setCustomerSaleInvoicesState,
        shopSaleInvoiceItemState,
        setShopSaleInvoiceItemState,
        tabsState,
        setTabsState,
        languageState,
        setLanguageState,
        localizationState,
        setLocalizationState,
        recommendedState,
        securityState,
        setSecurityState,
        setRecommendedState,
        orderState,
        setOrderState,
        favState,
        setFavState,
        checkoutState,
        purchasesState,
        setPurchasesState,
      }}
    >
      <View style={{ flex: 1 }}>
        {/* Your app content */}
        {children}
      </View>
    </SchemaContext.Provider>
  );
};

// Hook to use the full context
export const useSchemas = () => useContext(SchemaContext);
