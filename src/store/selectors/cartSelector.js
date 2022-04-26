export const commandesSelector = ({ cart }) => cart
export const commandeSelector = id => ({ cart }) => cart.find(commande => commande.ID_MENU_RESTAURANT == id)