import mongoose from 'mongoose'

const ticketCollection = 'ticket'

const ticketSchema = new mongoose.Schema({
    code: {
      type: String,
      unique: true,
      required: true,
    },
    purchase_datetime: {
      type: Date,
      default: Date.now, // Guarda la fecha y hora actual por defecto
    },
    amount: {
      type: Number,
      required: true,
    },
    purchaser: {
      type: String,
      required: true,
    },
  });
  
  const ticketModel = new mongoose.model(ticketCollection, ticketSchema);

  export default ticketModel