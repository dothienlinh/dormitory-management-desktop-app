package api

import "github.com/go-resty/resty/v2"

type Response struct {
	Success bool          `json:"success"`
	Message string        `json:"message"`
	Data    []interface{} `json:"data"`
}

type API struct {
	apiAuth               *AuthAPI
	userAPI               *UserAPI
	roomAPI               *RoomAPI
	contractAPI           *ContractAPI
	amenitiesAPI          *AmenitiesAPI
	roomCategoryAPI       *RoomCategoryAPI
	maintenanceHistoryAPI *MaintenanceHistoryAPI
}

func NewAPI(client *resty.Client) *API {
	return &API{
		apiAuth:               NewAuthAPI(client),
		userAPI:               NewUserAPI(client),
		roomAPI:               NewRoomAPI(client),
		contractAPI:           NewContractAPI(client),
		amenitiesAPI:          NewAmenitiesAPI(client),
		roomCategoryAPI:       NewRoomCategoryAPI(client),
		maintenanceHistoryAPI: NewMaintenanceHistoryAPI(client),
	}
}

func (a *API) Auth() *AuthAPI {
	return a.apiAuth
}

func (a *API) User() *UserAPI {
	return a.userAPI
}

func (a *API) Room() *RoomAPI {
	return a.roomAPI
}

func (a *API) Contract() *ContractAPI {
	return a.contractAPI
}

func (a *API) Amenities() *AmenitiesAPI {
	return a.amenitiesAPI
}

func (a *API) RoomCategory() *RoomCategoryAPI {
	return a.roomCategoryAPI
}

func (a *API) MaintenanceHistory() *MaintenanceHistoryAPI {
	return a.maintenanceHistoryAPI
}
