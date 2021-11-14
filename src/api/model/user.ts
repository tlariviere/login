import { Schema, model } from "mongoose";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";

import type { User } from "../../auth/utils/types";
import type { Roles } from "../strategy/roles";
import { roles } from "../strategy/roles";

const emailRegex = /^[a-z0-9_!#$%&’*+/=?`{|}~^.-]+@[a-z0-9.-]+$/;

const schema = new Schema({
  name: { type: String, minLength: 3, trim: true, unique: true },
  email: { type: String, lowercase: true, match: emailRegex, unique: true },
  hashedPassword: { type: String, required: true },
  role: { type: String, enum: roles, default: "user" },
});

schema.plugin(mongooseLeanVirtuals);

export default model<User<Roles>>("user", schema);
