export const favMenusSelector = ({ favorites }) => favorites.menus
export const favMenuSelector = id => ({ favorites }) => favorites.menus.find(menu => menu.ID_MENU_RESTAURANT == id)
export const favRestaurantsSelector = ({ favorites }) => favorites.restaurants
export const favRestoSelector = id => ({ favorites }) => favorites.restaurants.find(resto => resto.ID_RESTAURANT == id)
export const loadingMenusSelector = ({ favorites }) => favorites.loadingMenus
export const loadingRestosSelector = ({ favorites }) => favorites.loadingRestos