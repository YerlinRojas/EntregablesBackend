import TicketDTO from "../dao/DTO/ticket.dto.js";


export default class TicketRepository{
    constructor(dao){
        this.dao = dao
    }

    createTicket= async (ticketData) =>{
        try {
          // Crea un nuevo ticket en la base de datos
          const ticket = new TicketDTO(
            ticketData.code,
            ticketData.amount,
            ticketData.purchaser,
            );


          return await this.dao.createTicket(ticket)
    
         } catch (error) {
          throw error;
        }
      }
}    
