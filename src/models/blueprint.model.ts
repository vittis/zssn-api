import mongoose, { Document, Schema } from 'mongoose';

export interface Blueprint extends Document {
  name: string;
  points: number;
}

const BlueprintSchema: Schema = new Schema({
  name: { type: Schema.Types.String, required: true, unique: true },
  points: { type: Schema.Types.Number, required: true },
});

export default mongoose.model<Blueprint>('Blueprint', BlueprintSchema);
