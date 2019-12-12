import mongoose, { Document, Schema } from 'mongoose';

export interface Survivor extends Document {
  name: string;
  age: number;
  gender: string;
  loc: { coordinats: [number, number] };
  infected: boolean;
  reportedBy: [string];
}

const SurvivorSchema: Schema = new Schema(
  {
    name: { type: Schema.Types.String, required: true, unique: true },
    age: { type: Schema.Types.Number, required: true },
    gender: { type: Schema.Types.String, required: true, maxlength: 1 }, // M or F
    loc: {
      type: { type: String },
      coordinates: [Number],
    },
    infected: { type: Schema.Types.Boolean, default: false },
    reportedBy: { type: Schema.Types.Array, default: [] },
  },
  { timestamps: true },
);

SurvivorSchema.index({ loc: '2dsphere' });

export default mongoose.model<Survivor>('Survivor', SurvivorSchema);
