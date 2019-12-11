import mongoose, { Document, Schema } from 'mongoose';

export interface ISurvivor extends Document {
  name: string;
  age: number;
  gender: string;
}

const SurvivorSchema: Schema = new Schema(
  {
    name: { type: Schema.Types.String, required: true },
    age: { type: Schema.Types.Number, required: true },
    gender: { type: Schema.Types.String, required: true, maxlength: 1 }, // M or F
  },
  { timestamps: true },
);

export default mongoose.model<ISurvivor>('Survivor', SurvivorSchema);
