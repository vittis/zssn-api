import mongoose, { Document, Schema } from 'mongoose';
import { Blueprint } from './blueprint.model';
import { Survivor } from './survivor.model';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface Item extends Document {
  quantity: number;
  item: Blueprint;
  owner: Survivor;
}

const ItemSchema: Schema = new Schema(
  {
    quantity: { type: Schema.Types.Number, required: true },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blueprint',
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Survivor',
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<Item>('Item', ItemSchema);
