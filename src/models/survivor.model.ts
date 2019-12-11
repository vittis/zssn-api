import mongoose, { Document, Schema } from 'mongoose';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface Survivor extends Document {
  name: string;
  age: number;
  gender: string;
}

const SurvivorSchema: Schema = new Schema(
  {
    name: { type: Schema.Types.String, required: true },
    age: { type: Schema.Types.Number, required: true },
    gender: { type: Schema.Types.String, required: true, maxlength: 1 }, // M or F
    loc: {
      type: { type: String },
      coordinates: [Number],
    },
  },
  { timestamps: true },
);

SurvivorSchema.index({ loc: '2dsphere' });

export default mongoose.model<Survivor>('Survivor', SurvivorSchema);
