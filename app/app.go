package app

import (
	"changeme/internal/api"
	"changeme/internal/client"
	"context"
	"errors"
	"log"
	"strconv"
)

type App struct {
	ctx        context.Context
	api        *api.API
	httpClient *client.Client
}

func NewApp(httpClient *client.Client) *App {
	return &App{
		api:        api.NewAPI(httpClient),
		httpClient: httpClient,
	}
}

func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) LogData(messages *string, data ...interface{}) {
	log.Println(messages, data)
}

func (a *App) SetToken(token string) error {
	if a.ctx == nil {
		return context.Canceled
	}

	if a.httpClient != nil {
		a.httpClient.SetHeader("Authorization", "Bearer "+token)
		return nil
	}

	return errors.New("HTTP client is not initialized")
}

func (a *App) Login(email, password string) (*client.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	result, err := a.api.Auth().Login(email, password)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func (a *App) Logout() (*client.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.Auth().Logout()
}

func (a *App) Register(email, password, fullName, phone string) (*client.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.Auth().Register(email, password, fullName, phone)
}

func (a *App) GetMe() (*client.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.Auth().GetMe()
}

func (a *App) VerifyAccount(token, email string) (*client.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.Auth().VerifyAccount(token, email)
}

func (a *App) ResendVerifyAccount(email string) (*client.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.Auth().ResendVerifyAccount(email)
}

func (a *App) SendForgotPasswordEmail(email string) (*client.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}
	return a.api.Auth().SendForgotPasswordEmail(email)
}

func (a *App) ResetPassword(data map[string]interface{}) (*client.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}
	return a.api.Auth().ResetPassword(data)
}

func (a *App) GetUserDetails(userID string) (*client.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.User().GetUserDetails(userID)
}

func (a *App) GetListUsers(page string, keyword string, order string, status string, gender string, statusAccount string, role string, hasRoom *bool) (*client.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	// Convert page string to int
	pageInt, err := strconv.Atoi(page)
	if err != nil {
		return nil, errors.New("invalid page number: " + page)
	}

	return a.api.User().GetListUsers(pageInt, keyword, order, status, gender, statusAccount, role, hasRoom)
}

func (a *App) UpdateUserStatus(userID string, statusAccount string) (*client.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.User().UpdateUserStatus(userID, statusAccount)
}

func (a *App) GetRoomDetails(roomID string) (*client.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	// Convert roomID string to int
	roomIDInt, err := strconv.Atoi(roomID)
	if err != nil {
		return nil, errors.New("invalid room ID: " + roomID)
	}

	return a.api.Room().GetRoomDetails(roomIDInt)
}

func (a *App) GetListRooms(page string) (*client.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	// Convert page string to int
	pageInt, err := strconv.Atoi(page)
	if err != nil {
		return nil, errors.New("invalid page number: " + page)
	}

	return a.api.Room().GetListRooms(pageInt)
}

func (a *App) CreateRoom(roomData map[string]interface{}) (*client.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.Room().CreateRoom(roomData)
}

func (a *App) DeleteRoom(roomID string) (*client.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	// Convert roomID string to int
	roomIDInt, err := strconv.Atoi(roomID)
	if err != nil {
		return nil, errors.New("invalid room ID: " + roomID)
	}

	return a.api.Room().DeleteRoom(roomIDInt)
}
func (a *App) UpdateRoom(roomID string, roomData map[string]interface{}) (*client.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	// Convert roomID string to int
	roomIDInt, err := strconv.Atoi(roomID)
	if err != nil {
		return nil, errors.New("invalid room ID: " + roomID)
	}

	return a.api.Room().UpdateRoom(roomIDInt, roomData)
}

func (a *App) AddStudentToRoom(roomID string, userID string) (*client.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}
	roomIDInt, err := strconv.Atoi(roomID)
	if err != nil {
		return nil, errors.New("invalid room ID: " + roomID)
	}
	userIDInt, err := strconv.Atoi(userID)
	if err != nil {
		return nil, errors.New("invalid user ID: " + userID)
	}

	return a.api.User().AddStudentToRoom(roomIDInt, userIDInt)
}

func (a *App) GetContractDetails(contractID string) (*client.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	// Convert contractID string to int
	contractIDInt, err := strconv.Atoi(contractID)
	if err != nil {
		return nil, errors.New("invalid contract ID: " + contractID)
	}

	return a.api.Contract().GetContractDetails(contractIDInt)
}

func (a *App) GetListContracts(page string, keyword *string) (*client.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	// Convert page string to int
	pageInt, err := strconv.Atoi(page)
	if err != nil {
		return nil, errors.New("invalid page number: " + page)
	}

	return a.api.Contract().GetListContracts(pageInt, keyword)
}

func (a *App) CreateContract(contractData map[string]interface{}) (*client.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.Contract().CreateContract(contractData)
}

func (a *App) GetAmenityDetails(amenityID string) (*client.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.Amenities().GetAmenityDetails(amenityID)
}

func (a *App) GetListAmenities(page string) (*client.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	// Convert page string to int
	pageInt, err := strconv.Atoi(page)
	if err != nil {
		return nil, errors.New("invalid page number: " + page)
	}

	return a.api.Amenities().GetListAmenities(pageInt)
}

func (a *App) CreateAmenity(amenityData map[string]interface{}) (*client.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.Amenities().CreateAmenity(amenityData)
}

func (a *App) DeleteAmenity(amenityID string) (*client.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.Amenities().DeleteAmenity(amenityID)
}

func (a *App) UpdateAmenity(amenityID string, amenityData map[string]interface{}) (*client.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.Amenities().UpdateAmenity(amenityID, amenityData)
}

func (a *App) GetRoomCategoryDetails(categoryID string) (*client.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.RoomCategory().GetRoomCategoryDetails(categoryID)
}

func (a *App) GetListRoomCategories(page string) (*client.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.RoomCategory().GetListRoomCategories(page)
}

func (a *App) CreateRoomCategory(categoryData map[string]interface{}) (*client.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.RoomCategory().CreateRoomCategory(categoryData)
}

func (a *App) GetMaintenanceHistoryDetails(historyID string) (*client.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.MaintenanceHistory().GetMaintenanceHistoryDetails(historyID)
}

func (a *App) GetListMaintenanceHistories(page string, roomID string) (*client.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.MaintenanceHistory().GetListMaintenanceHistories(page, roomID)
}

func (a *App) CreateMaintenanceHistory(historyData map[string]interface{}) (*client.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.MaintenanceHistory().CreateMaintenanceHistory(historyData)
}

func (a *App) DeleteMaintenanceHistory(historyID string) (*client.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.MaintenanceHistory().DeleteMaintenanceHistory(historyID)
}

func (a *App) UpdateMaintenanceHistory(historyID string, historyData map[string]interface{}) (*client.Response, error) {
	if a.ctx == nil {
		return nil, context.Canceled
	}

	return a.api.MaintenanceHistory().UpdateMaintenanceHistory(historyID, historyData)
}
