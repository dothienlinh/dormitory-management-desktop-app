package app

import (
	"changeme/internal/api"
	"context"

	"github.com/go-resty/resty/v2"
)

type App struct {
	ctx context.Context
	api *api.API
}

func NewApp(client *resty.Client) *App {
	return &App{
		api: api.NewAPI(client),
	}
}

func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) Login(email, password string) (*resty.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.Auth().Login(email, password)
}

func (a *App) Logout() (*resty.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.Auth().Logout()
}

func (a *App) Register(email, password, fullName, phone string) (*resty.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.Auth().Register(email, password, fullName, phone)
}

func (a *App) GetUserDetails(userID string) (*resty.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.User().GetUserDetails(userID)
}

func (a *App) GetListUsers(page int, keyword *string, order *string, status *string, gender *string) (*resty.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.User().GetListUsers(page, keyword, order, status, gender)
}

func (a *App) GetRoomDetails(roomID int) (*resty.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.Room().GetRoomDetails(roomID)
}

func (a *App) GetListRooms(page int) (*resty.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.Room().GetListRooms(page)
}

func (a *App) CreateRoom(roomData map[string]interface{}) (*resty.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.Room().CreateRoom(roomData)
}

func (a *App) DeleteRoom(roomID int) (*resty.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.Room().DeleteRoom(roomID)
}
func (a *App) UpdateRoom(roomID int, roomData map[string]interface{}) (*resty.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.Room().UpdateRoom(roomID, roomData)
}

func (a *App) GetContractDetails(contractID int) (*resty.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.Contract().GetContractDetails(contractID)
}

func (a *App) GetListContracts(page int, keyword *string) (*resty.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.Contract().GetListContracts(page, keyword)
}

func (a *App) CreateContract(contractData map[string]interface{}) (*resty.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.Contract().CreateContract(contractData)
}

func (a *App) GetAmenityDetails(amenityID string) (*resty.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.Amenities().GetAmenityDetails(amenityID)
}

func (a *App) GetListAmenities(page int) (*resty.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.Amenities().GetListAmenities(page)
}

func (a *App) CreateAmenity(amenityData map[string]interface{}) (*resty.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.Amenities().CreateAmenity(amenityData)
}

func (a *App) DeleteAmenity(amenityID string) (*resty.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.Amenities().DeleteAmenity(amenityID)
}

func (a *App) UpdateAmenity(amenityID string, amenityData map[string]interface{}) (*resty.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.Amenities().UpdateAmenity(amenityID, amenityData)
}

func (a *App) GetRoomCategoryDetails(categoryID string) (*resty.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.RoomCategory().GetRoomCategoryDetails(categoryID)
}

func (a *App) GetListRoomCategories(page string) (*resty.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.RoomCategory().GetListRoomCategories(page)
}

func (a *App) CreateRoomCategory(categoryData map[string]interface{}) (*resty.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.RoomCategory().CreateRoomCategory(categoryData)
}

func (a *App) GetMaintenanceHistoryDetails(historyID string) (*resty.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.MaintenanceHistory().GetMaintenanceHistoryDetails(historyID)
}

func (a *App) GetListMaintenanceHistories(page string, roomID string) (*resty.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.MaintenanceHistory().GetListMaintenanceHistories(page, roomID)
}

func (a *App) CreateMaintenanceHistory(historyData map[string]interface{}) (*resty.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.MaintenanceHistory().CreateMaintenanceHistory(historyData)
}

func (a *App) DeleteMaintenanceHistory(historyID string) (*resty.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.MaintenanceHistory().DeleteMaintenanceHistory(historyID)
}

func (a *App) UpdateMaintenanceHistory(historyID string, historyData map[string]interface{}) (*resty.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.MaintenanceHistory().UpdateMaintenanceHistory(historyID, historyData)
}
