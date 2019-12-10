import mongoose, { Document, Schema } from 'mongoose';

export interface Survivor extends Document {
  name: string;
  age: number;
  gender: string;
}

const SurvivorSchema: Schema = new Schema({
  name: { type: Schema.Types.String, required: true },
  age: { type: Schema.Types.Number, required: true },
  gender: { type: Schema.Types.String, required: true, max: 1 }, // M or F
});

export default mongoose.model<Survivor>('Survivor', SurvivorSchema);
