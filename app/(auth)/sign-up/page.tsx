"use client";
import InputField from "@/components/forms/InputField";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      country: "US",
      investmentGoals: "Growth",
      riskTolerance: "Medium",
      preferredIndustry: "Technology",
    },
    mode: "onBlur",
  });
  
  const onSubmit = async (data: SignUpFormData) => {
     try {
         console.log(data);
     } catch (e) {
         console.error(e);
         
     }
 }
  return (
    <>
      <h1 className="form-title">Sign up & Personalize</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <InputField 
          name="fullName"
          label="Full Name"
          placeholder="John Doe"
          register={register}
          error={errors.fullName}
          validation={{ required: 'Full name is Required', minLength: 2 }}
          />
          <Button type="submit" className="w-full yellow-btn mt-5" disabled={isSubmitting}>
               {isSubmitting ? "Creating Account" : "Start yor investing Journey"}
          </Button>
      </form>
    </>
  );
};

export default SignUp;
