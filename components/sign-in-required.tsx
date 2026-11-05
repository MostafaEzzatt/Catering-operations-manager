import { Show, SignInButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

// "Sign in to continue", with a sign-in button. Shown by the root layout and
// by each page's own sign-in check (the proxy normally redirects signed-out
// visitors before either runs).
const SignInRequired = () => {
  return (
    <div className="container mx-auto text-center font-bold text-3xl">
      قم{" "}
      <Show when="signed-out">
        <SignInButton>
          <Button
            variant={"link"}
            size={"lg"}
            className="text-3xl px-0 text-orange-400"
          >
            بتسجيل الدخول
          </Button>
        </SignInButton>
      </Show>{" "}
      حتى تستطيع ان تكمل
    </div>
  );
};

export default SignInRequired;
