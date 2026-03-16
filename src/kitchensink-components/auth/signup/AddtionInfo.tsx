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
} from "../../../../components/ui";
import FormContainer from "../../../components/form-container/FormContainer";
import schema from "../../../Schemas/LoginSchema/AddtionInfomation.json";
export default function AdditionalInfoScreen() {
  const mainSchema = schema[0];
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors,
  } = useForm({});
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
          <VStack space="xs">
            {/* <FormContainer
              tableSchema={mainSchema}
              row={{}}
              setError={setError}
              control={control}
              errorResult={errors}
              clearErrors={clearErrors}
            /> */}
            <Text className="text-sm text-gray-600 font-medium">Job Type</Text>
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
            </Select>
          </VStack>

          {/* Nationality */}
          <VStack space="xs">
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
          </VStack>

          <Button className="rounded-xl bg-primary-600 mt-4">
            <ButtonText className="text-white font-semibold">
              Continue
            </ButtonText>
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}
