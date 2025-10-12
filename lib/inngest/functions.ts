import { getAllUsersForNewsEmail } from "../actions/user.actions";
import { sendWelcomeEmail } from "../nodemailer";
import { inngest } from "./client";
import { PERSONALIZED_WELCOME_EMAIL_PROMPT } from "./prompts";

export const sendSignUpEmail = inngest.createFunction(
  { id: "sign-up-email" },
  { event: "app/user.created" },
  async ({ event, step }) => {
    const userProfile = `
           - Country ${event.data.country}
           - Investment Goals ${event.data.investmentGoals}
           - Risk Tolerance ${event.data.riskTolerance}
           - Preferred Industry ${event.data.preferredIndustry}
          `;

    const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace(
      "{{userProfile}}",
      userProfile
    );

    const response = await step.ai.infer("generate-welcome-intro", {
      model: step.ai.models.gemini({ model: "gemini-2.5-flash-lite" }),
      body: {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      },
    });

    await step.run("send-welcome-email", async () => {
      const part = response.candidates?.[0]?.content?.parts?.[0];
      const introText =
        (part && "text" in part ? part.text : null) ||
        "Thanks for joining StockEase. You now have the tools to track markets and make smarter moves.";

      // Send email logic here using i
      const {
        data: { email, name },
      } = event;
      return await sendWelcomeEmail({
        email,
        name,
        intro: introText,
      });
    });

    return {
      success: true,
      message: "Welcome email sent successfully",
    };
  }
);


export const sendDailyNewsSummary = inngest.createFunction(
  { id: "daily-news-summary" },
  [ { event: "app/send.daily.news"}, { cron:'0 12 * * *' }] ,// every Hour  "0 * * * *"
  async ({ step })=> {
    //Step 1 Get all users for news Delivery
    const users = await step.run("get-all-users",getAllUsersForNewsEmail)

    if(!users || users.length === 0) 
      return {
        success: false,
        message: "No users found for news delivery",
      };
    
    // step 2 Fetch Personalized News for each user
    
    // step 3 summarize these news via AI for each user
    // step 4 Send email to each user
   }
)