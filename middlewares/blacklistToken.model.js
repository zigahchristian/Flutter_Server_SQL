import mongoose from "mongoose";

const BlacklistTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
});

// Set TTL index to automatically remove documents after 24 hours
BlacklistTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const BlacklistTokenModel = mongoose.model(
  "BlacklistToken",
  BlacklistTokenSchema
);

// Helper to add a token to the blacklist for 24 hours
export const addTokenToBlacklist = async (token) => {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return BlacklistTokenModel.create({ token, expiresAt });
};

// Helper to check if a token is blacklisted
export const isTokenBlacklisted = async (token) => {
  const found = await BlacklistTokenModel.findOne({ token });
  return !!found;
};
