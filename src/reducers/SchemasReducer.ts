import { createSlice } from "@reduxjs/toolkit";

// MenuSchema
import CartInfoSchema from "../Schemas/MenuSchema/CartInfoSchema.json";
import CartInfoSchemaAction from "../Schemas/MenuSchema/CartInfoSchemaAction.json";
import CartSchema from "../Schemas/MenuSchema/CartSchema.json";
import RequestSchemaActions from "../Schemas/MenuSchema/RequestSchemaActions.json";
import FastWaySchema from "../Schemas/MenuSchema/FastWaySchema.json";
import FastWaySchemaActions from "../Schemas/MenuSchema/FastWaySchemaActions.json";
import FilterSchema from "../Schemas/MenuSchema/FilterSchema.json";
import ServiceTypesSchema from "../Schemas/MenuSchema/ServiceTypesSchema.json";
import ServiceTypesSchemaActions from "../Schemas/MenuSchema/ServiceTypesSchemaActions.json";
import OnlineAssetsSchema from "../Schemas/MenuSchema/OnlineAssetsSchema.json";
import NodeMenuItemsSchemaActions from "../Schemas/MenuSchema/AssetsSchemaActions.json";
import FavoriteMenuItemsSchema from "../Schemas/MenuSchema/FavoriteMenuItemsSchema.json";
import FavoriteMenuItemsSchemaActions from "../Schemas/MenuSchema/FavoriteMenuItemsSchemaActions.json";
import PaymentMethods from "../Schemas/MenuSchema/PaymentMethods.json";
import paymentMethodsSchemaActions from "../Schemas/MenuSchema/paymentMethodsSchemaActions.json";
import PaymentOptions from "../Schemas/MenuSchema/PaymentOptions.json";
import PaymentOptionsActions from "../Schemas/MenuSchema/PaymentOptionsActions.json";
import ScratchVoucherCard from "../Schemas/MenuSchema/ScratchVoucherCard.json";
import ScratchVoucherCardActions from "../Schemas/MenuSchema/ScratchVoucherCardActions.json";
import SuggestCardSchema from "../Schemas/MenuSchema/SuggestCardSchema.json";
import SuggestCardSchemaActions from "../Schemas/MenuSchema/SuggestCardSchemaActions.json";
import RecommendedSchemaActions from "../Schemas/MenuSchema/RecommendedSchemaActions.json";
import searchBarSchema from "../Schemas/MenuSchema/searchBarSchema.json";
import CheckoutSchema from "../Schemas/MenuSchema/CheckoutSchema.json";

// LoginSchema
import LoginFormSchema from "../Schemas/LoginSchema/LoginFormSchema.json";
import LoginFormSchemaActions from "../Schemas/LoginSchema/LoginFormSchemaActions.json";
import ResendSchemaAction from "../Schemas/LoginSchema/ResendSchemaAction.json";
import SighupSchema from "../Schemas/LoginSchema/SighupSchema.json";
import VerifySchema from "../Schemas/LoginSchema/VerifySchema.json";
import VerifySchemaAction from "../Schemas/LoginSchema/VerifySchemaAction.json";
import PersonalInfo from "../Schemas/PersonalInfo.json";

// ForgetSchema
import ContactSchema from "../Schemas/ForgetSchema/ContactSchema.json";
import ForgetSchema from "../Schemas/ForgetSchema/ForgetSchema.json";
import ForgetSchemaActions from "../Schemas/ForgetSchema/ForgetSchemaActions.json";
import VerifySchemaActions from "../Schemas/ForgetSchema/VerifySchemaActions.json";

// AddressLocation
import AddressLocation from "../Schemas/AddressLocation/AddressLocation.json";
import AddressLocationAction from "../Schemas/AddressLocation/AddressLocationAction.json";
import NearestBranches from "../Schemas/AddressLocation/NearestBranches.json";
import NearestBranchesActions from "../Schemas/AddressLocation/NearestBranchesActions.json";

// Language
import LanguageSchema from "../Schemas/LanguageSchema/LanguageSchema.json";
import LanguageSchemaActions from "../Schemas/LanguageSchema/LanguageSchemaActions.json";

// Localization
import LocalizationSchemaActions from "../Schemas/Localization/LocalizationSchemaActions.json";

// Profile
import CollapseSchema from "../Schemas/Profile/CollapseScehma.json";
import SecuritySchema from "../Schemas/Profile/SecuritySchema.json";
import RateSchema from "../Schemas/Profile/RateSchema.json";
import ReviewSchema from "../Schemas/Profile/ReviewSchema.json";
import RateSchemaActions from "../Schemas/Profile/RateSchemaActions.json";
import ReviewSchemaActions from "../Schemas/Profile/ReviewSchemaActions.json";
import CustomerSaleInvoicesActions from "../Schemas/Profile/CustomerSaleInvoicesActions.json";
import SaleInvoiceSchema from "../Schemas/Profile/SaleInvoiceSchema.json";
import TabsSchemaActions from "../Schemas/Profile/TabsSchemaActions.json";
import TapsSchema from "../Schemas/Profile/TapsSchema.json";

//orders
import RequestSchema from "../Schemas/MenuSchema/RequestSchema.json";
import OrderItemsSchemaActions from "../Schemas/OrdersSchema/OrderItemsSchemaActions.json";
import OrdersSchemaActions from "../Schemas/MenuSchema/RequestSchemaActions.json";
import { store } from "../store/reduxStore";

export const schemasSlice = createSlice({
  name: `schemas`,
  initialState: {
    version: 2,
    // Menu
    cartInfo: {
      schema: CartInfoSchema,
      actions: CartInfoSchemaAction,
    },
    cart: { schema: CartSchema, actions: RequestSchemaActions },
    fastWay: { schema: FastWaySchema, actions: FastWaySchemaActions },
    filter: { schema: FilterSchema, actions: [{}] },
    serviceCat: {
      schema: ServiceTypesSchema,
      actions: ServiceTypesSchemaActions,
    },
    menuItems: {
      schema: OnlineAssetsSchema,
      actions: NodeMenuItemsSchemaActions,
    },
    fav: {
      schema: FavoriteMenuItemsSchema,
      actions: FavoriteMenuItemsSchemaActions,
    },
    paymentMethods: {
      schema: PaymentMethods,
      actions: paymentMethodsSchemaActions,
    },
    OtherPaymentOptions: {
      schema: PaymentOptions,
      actions: PaymentOptionsActions,
    },
    scratchVoucherCard: {
      schema: ScratchVoucherCard,
      actions: ScratchVoucherCardActions,
    },
    suggestCard: {
      schema: SuggestCardSchema,
      actions: SuggestCardSchemaActions,
    },
    recommended: {
      schema: {},
      actions: RecommendedSchemaActions,
    },
    searchBar: { schema: searchBarSchema, actions: [{}] },

    // Login
    loginForm: {
      schema: LoginFormSchema,
      actions: LoginFormSchemaActions,
    },
    resend: { schema: {}, actions: ResendSchemaAction },
    signup: {
      schema: PersonalInfo,
      actions: SighupSchema,
    },
    loginVerify: {
      schema: VerifySchema,
      actions: VerifySchemaAction,
    },

    // Forget
    contact: { schema: ContactSchema, actions: [{}] },
    forget: {
      schema: ForgetSchema,
      actions: ForgetSchemaActions,
    },
    forgetVerify: { schema: {}, actions: VerifySchemaActions },

    // Address Location
    addressLocation: {
      schema: AddressLocation,
      actions: AddressLocationAction,
    },
    nearestBranches: {
      schema: NearestBranches,
      actions: NearestBranchesActions,
    },
    //orders
    order: {
      schema: RequestSchema,
      actions: OrdersSchemaActions,
    },
    purchases: {
      schema: SaleInvoiceSchema,
      actions: CustomerSaleInvoicesActions,
    },
    checkout: {
      schema: CheckoutSchema,
      actions: [{}],
    },
    orderItem: {
      schema: {},
      actions: OrderItemsSchemaActions,
    },

    // Profile
    collapse: { schema: CollapseSchema, actions: [{}] },
    security: {
      schema: SecuritySchema,
      actions: [{}],
    },
    rate: {
      schema: RateSchema,
      actions: RateSchemaActions,
    },
    review: {
      schema: ReviewSchema,
      actions: ReviewSchemaActions,
    },
    // credits: { schema: CreditsSchema, actions: [{}] },
    // customerSaleInvoices: {
    //   schema: SaleInvoiceSchema,
    //   actions: CustomerSaleInvoicesActions,
    // },
    //shopSaleInvoiceItem: { schema: ShopSaleInvoiceItemSchema, actions: [{}] },
    tabs: { schema: TapsSchema, actions: TabsSchemaActions },
    language: { schema: LanguageSchema, actions: LanguageSchemaActions },
    localization: { schema: {}, actions: LocalizationSchemaActions },
  },
  reducers: {
    updateSchemas: (state, actions) => {
      const { key, item } = actions.payload;
      state[key] = item;
    },
  },
});

export const { updateSchemas } = schemasSlice.actions;

export default schemasSlice.reducer;
