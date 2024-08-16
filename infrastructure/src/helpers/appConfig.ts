import * as dotenv from "dotenv";
import * as z from "zod";

const appConfigSchema = z.object({
  awsAccountId: z.string(),
  awsRegion: z.string(),
  domain: z.string(),
  apiSubdomain: z.string(),
  webSubdomain: z.string(),
});

export type AppConfig = z.infer<typeof appConfigSchema>;

export const getAppConfig = (): AppConfig => {
  dotenv.config({ path: "../.env" });

  const { AWS_ACCOUNT_ID, AWS_REGION, DOMAIN, API_SUBDOMAIN, WEB_SUBDOMAIN } =
    process.env;

  const { data, error, success } = appConfigSchema.safeParse({
    awsAccountId: AWS_ACCOUNT_ID,
    awsRegion: AWS_REGION,
    domain: DOMAIN,
    apiSubdomain: API_SUBDOMAIN,
    webSubdomain: WEB_SUBDOMAIN,
  });

  if (!data && !success) {
    throw new Error(error.message);
  }

  return data;
};
