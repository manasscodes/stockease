"use client";
import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";
import { Button } from "@/components/ui/button";
import { INVESTMENT_GOALS } from "@/lib/constants";
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
  };
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
          validation={{ required: "Full name is Required", minLength: 2 }}
        />

        <InputField
          name="email"
          label="Email"
          placeholder="contact@gmail.com"
          register={register}
          error={errors.email}
          validation={{ required: "Email name is Required", pattern:/^\w+@\w+\.\w+$/, message: 'Email address is required'   }}
        />

        <InputField
          name="password"
          label="Password"
          placeholder="Enter a strong password"
          type="password"
          register={register}
          error={errors.password}
          validation={{ required: "Password is Required", minLength: 8 }}
        />

        { /* Country */}

        <SelectField 
        name="investmentGoals"
        label="Investment Goals"
        placeholder="Select your investment goals"
        options={INVESTMENT_GOALS}
        control={control}
        error={errors.investmentGoals}
        required
        />

        <Button
          type="submit"
          className="w-full yellow-btn mt-5"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Account" : "Start your investing Journey"}
        </Button>
      </form>
    </>
  );
};

export default SignUp;
