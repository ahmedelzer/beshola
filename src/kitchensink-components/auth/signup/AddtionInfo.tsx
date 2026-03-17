// import { useForm } from "react-hook-form";
// import {
//   Box,
//   VStack,
//   Text,
//   Select,
//   SelectTrigger,
//   SelectInput,
//   SelectPortal,
//   SelectContent,
//   SelectItem,
//   Button,
//   ButtonText,
// } from "../../../../components/ui";
// import FormContainer from "../../../components/form-container/FormContainer";
// import schema from "../../../Schemas/LoginSchema/AddtionInfomation.json";
// export default function AdditionalInfoScreen() {
// const mainSchema = schema[0];
// const {
//   control,
//   handleSubmit,
//   formState: { errors },
//   watch,
//   setError,
//   clearErrors,
// } = useForm({});
//   return (
//     <Box className="flex-1 bg-gray-50 items-center justify-center px-4">
//       <Box className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-6">
//         <VStack space="lg">
//           <Text className="text-2xl font-bold text-gray-800 text-center">
//             Complete Your Profile
//           </Text>

//           <Text className="text-gray-500 text-center">
//             Please provide additional information
//           </Text>

//           {/* Job Type */}
//           <VStack space="xs">
// {/* <FormContainer
//   tableSchema={mainSchema}
//   row={{}}
//   setError={setError}
//   control={control}
//   errorResult={errors}
//   clearErrors={clearErrors}
// /> */}
//             <Text className="text-sm text-gray-600 font-medium">Job Type</Text>
//             <Select>
//               <SelectTrigger className="rounded-xl border-gray-200">
//                 <SelectInput placeholder="Select job type" />
//               </SelectTrigger>

//               <SelectPortal>
//                 <SelectContent>
//                   <SelectItem label="Full Time" value="fulltime" />
//                   <SelectItem label="Part Time" value="parttime" />
//                   <SelectItem label="Freelance" value="freelance" />
//                   <SelectItem label="Student" value="student" />
//                 </SelectContent>
//               </SelectPortal>
//             </Select>
//           </VStack>

//           {/* Nationality */}
//           <VStack space="xs">
//             <Text className="text-sm text-gray-600 font-medium">
//               Nationality
//             </Text>

//             <Select>
//               <SelectTrigger className="rounded-xl border-gray-200">
//                 <SelectInput placeholder="Select nationality" />
//               </SelectTrigger>

//               <SelectPortal>
//                 <SelectContent>
//                   <SelectItem label="Egyptian" value="egypt" />
//                   <SelectItem label="Saudi" value="saudi" />
//                   <SelectItem label="Emirati" value="uae" />
//                   <SelectItem label="Other" value="other" />
//                 </SelectContent>
//               </SelectPortal>
//             </Select>
//           </VStack>

//           <Button className="rounded-xl bg-primary-600 mt-4">
//             <ButtonText className="text-white font-semibold">
//               Continue
//             </ButtonText>
//           </Button>
//         </VStack>
//       </Box>
//     </Box>
//   );
// }
import { useForm } from "react-hook-form";

import {
  Box,
  VStack,
  Text,
  Select,
  SelectTrigger,
  SelectInput,
  SelectPortal,
  SelectContent,
  SelectItem,
  Button,
  ButtonText,
  HStack,
} from "../../../../components/ui";
import schema from "../../../Schemas/LoginSchema/AddtionInfomation.json";
import FormContainer from "../../../components/form-container/FormContainer";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AdditionalInfoScreen({}) {
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors,
  } = useForm({});
  const mainSchema = schema[0];

  // ✅ Continue
  const onSubmit = (data) => {
    console.log("FORM DATA:", data);

    // TODO: send to API

    navigation.replace("Home");
  };

  // ✅ Skip once
  const handleSkip = () => {
    navigation.replace("Home");
  };

  // ✅ Skip forever
  const handleDontShowAgain = async () => {
    try {
      await AsyncStorage.setItem("hideAdditionalInfo", "true");
      navigation.replace("Home");
    } catch (e) {
      console.error("Storage error", e);
    }
  };

  return (
    <Box className="flex-1 bg-gray-50 items-center justify-center px-4">
      <Box className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-6">
        <VStack space="lg">
          <Text className="text-2xl font-bold text-gray-800 text-center">
            Complete Your Profile
          </Text>

          <Text className="text-gray-500 text-center">
            Please provide additional information
          </Text>

          {/* Job Type */}
          <VStack>
            <FormContainer
              tableSchema={mainSchema}
              row={{}}
              setError={setError}
              control={control}
              errorResult={errors}
              clearErrors={clearErrors}
            />
            {/* <Text className="text-sm text-gray-600 font-medium">Job Type</Text>

            <Select>
              <SelectTrigger className="rounded-xl border-gray-200">
                <SelectInput placeholder="Select job type" />
              </SelectTrigger>

              <SelectPortal>
                <SelectContent>
                  <SelectItem label="Full Time" value="fulltime" />
                  <SelectItem label="Part Time" value="parttime" />
                  <SelectItem label="Freelance" value="freelance" />
                  <SelectItem label="Student" value="student" />
                </SelectContent>
              </SelectPortal>
            </Select> */}
          </VStack>

          {/* Nationality */}
          {/* <VStack space="xs">
            <Text className="text-sm text-gray-600 font-medium">
              Nationality
            </Text>

            <Select>
              <SelectTrigger className="rounded-xl border-gray-200">
                <SelectInput placeholder="Select nationality" />
              </SelectTrigger>

              <SelectPortal>
                <SelectContent>
                  <SelectItem label="Egyptian" value="egypt" />
                  <SelectItem label="Saudi" value="saudi" />
                  <SelectItem label="Emirati" value="uae" />
                  <SelectItem label="Other" value="other" />
                </SelectContent>
              </SelectPortal>
            </Select>
          </VStack> */}

          {/* ✅ Buttons */}
          <VStack space="sm" className="mt-4">
            {/* Continue */}
            <Button
              className="rounded-xl bg-indigo-600"
              onPress={handleSubmit(onSubmit)}
            >
              <ButtonText className="text-white font-semibold">
                Continue
              </ButtonText>
            </Button>

            {/* Skip + Don't show */}
            <HStack className="justify-between">
              <Button
                variant="outline"
                className="flex-1 mr-2 rounded-xl"
                onPress={handleSkip}
              >
                <ButtonText>Skip</ButtonText>
              </Button>

              <Button
                variant="solid"
                className="flex-1 ml-2"
                onPress={handleDontShowAgain}
              >
                <ButtonText className="text-gray-500 text-xs">
                  Don’t show again
                </ButtonText>
              </Button>
            </HStack>
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
}
