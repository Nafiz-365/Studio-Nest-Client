import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";
import { jwt } from "better-auth/plugins";

const mongoClient = new MongoClient(process.env.MONGODB_URI as string);
const database = mongoClient.db("studionest");

export const auth = betterAuth({
    database: mongodbAdapter(database, {
        client: mongoClient,
    }),
    emailAndPassword: {
        enabled: true,
    },
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
        ? {
              socialProviders: {
                  google: {
                      clientId: process.env.GOOGLE_CLIENT_ID,
                      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                  },
              },
          }
        : {}),
    plugins: [jwt({ disableSettingJwtHeader: true })],
    session: {
        cookieCache: {
            enabled: true,
            strategy: "jwt",
            maxAge: 7 * 24 * 60 * 60,
        },
    },
});
