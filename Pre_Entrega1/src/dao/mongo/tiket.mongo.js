import ticketModel from "../mongo/models/ticket.model.js";

export default class ticket {

    createTicket = async (ticketData) => {
        return await ticketModel.create(ticketData)
      }
}
