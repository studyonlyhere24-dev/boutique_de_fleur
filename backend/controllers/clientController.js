//backend/controllers/clientController.js

import Client from '../models/clientModel.js' 
import { StatusCodes } from 'http-status-codes'
import { NotFoundError } from '../errors/customErrors.js'

// ============================= GET CLIENT PROFILE =======================
export const getClientProfile = async (req, res) => {
    const client = await Client.findById(req.userId).select("-password") 

    if (!client) throw new NotFoundError("Profil client introuvable") 

    res.status(StatusCodes.OK).json({ success: true, client }) 
}

// ============================= UPDATE CLIENT PROFILE =======================
export const updateClientProfile = async (req, res) => {
    const { name, address, phone } = req.body 
    let client = await Client.findById(req.userId) 

    if (!client) throw new NotFoundError("Profil client introuvable") 

    if (name) client.name = name 
    if (address) client.address = address 
    if (phone) client.phone = phone 

    const updatedClient = await client.save() 
    const clientResponse = { ...updatedClient._doc } 
    delete clientResponse.password 

    res.status(StatusCodes.OK).json({ 
        success: true, message: "Profil mis à jour avec succès", client: clientResponse 
    }) 
}